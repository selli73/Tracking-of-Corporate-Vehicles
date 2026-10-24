import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BILLING_EVENTS_CLIENT, BILLING_PATTERNS, ERROR_CODES, FLEET_PATTERNS, FLEET_SERVICE, PaymentDto, Role, TELEMETRY_PATTERNS, TELEMETRY_SERVICE, UserContext, VehicleReleasedEvent } from '@app/contracts';
import { InvoiceStatus, Prisma } from '@prisma/client-billing';
@Injectable()
export class BillingService {
  constructor(@Inject(BILLING_EVENTS_CLIENT) private _billingEventsClient: ClientProxy,
    @Inject(FLEET_SERVICE) private _clientFleet: ClientProxy, 
    @Inject(TELEMETRY_SERVICE) private _clientTelemetry: ClientProxy, private _prismaService: PrismaService) {}


  async handleBookingFinished(data: VehicleReleasedEvent) {
    const [telemetryResponse, vehicleResponse] = await Promise.all([
      firstValueFrom(this._clientTelemetry.send(TELEMETRY_PATTERNS.CALCULATE_DISTANCE, data)),
      firstValueFrom(this._clientFleet.send<{ minuteRate: number, kmRate: number }>(FLEET_PATTERNS.GET_VEHICLE_TARIFF, { vehicleId: data.vehicleId }))
    ]);

    const start = new Date(data.startTime).getTime();
    const end = new Date(data.finishedAt).getTime();

    const durationMinutes = Math.ceil((end-start) / (1000 * 60));
    const distanceKm = telemetryResponse.distanceKm;

    const totalAmount = Math.round(
      (((durationMinutes * vehicleResponse.minuteRate) + (distanceKm * vehicleResponse.kmRate))  * 100)
    ) / 100;
    

    // имитация оплаты
    const isPaymentSuccessful = Math.random() > 0.5;

    let invoice;
    try {
      invoice = await this._prismaService.invoice.create({
        data: {
          bookingId: data.bookingId,
          companyId: data.companyId,
          driverId: data.driverId,
          driverEmail: data.driverEmail,
          vehicleId: data.vehicleId,
          durationMinutes,
          distanceKm,
          minuteRate: vehicleResponse.minuteRate, 
          kmRate: vehicleResponse.kmRate,
          amount: totalAmount,
          status: isPaymentSuccessful ? InvoiceStatus.PAID : InvoiceStatus.FAILED,
          paidAt: isPaymentSuccessful ? new Date() : null
        }
      });
    } catch(error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return;
      }
      throw error;
    }

    const payment = new PaymentDto(invoice!.driverId, data.driverEmail, invoice!.bookingId, totalAmount);

    if (isPaymentSuccessful) {
      this._billingEventsClient.emit(BILLING_PATTERNS.PAYMENT_SUCCESS, payment);
    } else {
      this._billingEventsClient.emit(BILLING_PATTERNS.PAYMENT_FAILED, payment);
    }
  }

  async getInvoices(user: UserContext) {
    return this._prismaService.invoice.findMany({
      where: {
        driverId: user.role === Role.DRIVER ? user.userId : undefined,
        companyId: user.companyId
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async payInvoice(invoiceId: string, user: UserContext) {
    const invoice = await this._prismaService.invoice.findFirst({
      where: {
        id: invoiceId,
        companyId: user.companyId,
        driverId: user.role === Role.DRIVER ? user.userId : undefined
      }
    });

    if (!invoice) {
      throw new RpcException({ code: ERROR_CODES.INVOICE_NOT_FOUND, message: 'Invoice not found' });
    }

    if (invoice.status !== InvoiceStatus.FAILED) {
      throw new RpcException({ code: ERROR_CODES.INVOICE_ALREADY_PAID, message: 'Invoice already paid' });
    }

    // имитация оплаты
    const isPaymentSuccessful = Math.random() > 0.5;

    const payment = new PaymentDto(
      invoice.driverId,
      invoice.driverEmail,
      invoice.bookingId,
      Number(invoice.amount)
    );

     if (!isPaymentSuccessful) {
      this._billingEventsClient.emit(BILLING_PATTERNS.PAYMENT_FAILED, payment);
      return invoice; 
    }

    const paidAt = new Date();
    const { count } = await this._prismaService.invoice.updateMany({
      where: { id: invoice.id, status: InvoiceStatus.FAILED },
      data: { status: InvoiceStatus.PAID }
    });

    if (count === 0) {
      throw new RpcException({ code: ERROR_CODES.INVOICE_ALREADY_PAID, message: 'Invoice already paid' });
    }

    this._billingEventsClient.emit(BILLING_PATTERNS.PAYMENT_SUCCESS, payment);
    return { ...invoice, status: InvoiceStatus.PAID, paidAt };
  }
}
