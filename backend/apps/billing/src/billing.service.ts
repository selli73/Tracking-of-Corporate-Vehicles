import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BILLING_EVENTS_CLIENT, BILLING_PATTERNS, FLEET_PATTERNS, FLEET_SERVICE, PaymentDto, TELEMETRY_PATTERNS, TELEMETRY_SERVICE, VehicleReleasedEvent } from '@app/contracts';
import { InvoiceStatus } from '@prisma/client-billing';
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
      ((durationMinutes * vehicleResponse.minuteRate) + (distanceKm * vehicleResponse.kmRate))
    );


    const invoice = await this._prismaService.invoice.create({
      data: {
        bookingId: data.bookingId,
        driverId: data.driverId,
        amount: totalAmount
      }
    });

    // имитация оплаты
    const isPaymentSuccessful = Math.random() > 0.5;

    await this._prismaService.invoice.update({
      where: {
        id: invoice.id
      },
      data: {
        status: isPaymentSuccessful ? InvoiceStatus.PAID : InvoiceStatus.FAILED
      }
    });

    if (isPaymentSuccessful) {
      this._billingEventsClient.emit(BILLING_PATTERNS.PAYMENT_SUCCESS, new PaymentDto(invoice.driverId, invoice.bookingId, invoice.amount));
    } else {
      this._billingEventsClient.emit(BILLING_PATTERNS.PAYMENT_FAILED, new PaymentDto(invoice.driverId, invoice.bookingId, invoice.amount));
    }
  }
}
