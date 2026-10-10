import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { FLEET_PATTERNS, FLEET_SERVICE, TELEMETRY_PATTERNS, TELEMETRY_SERVICE, VehicleReleasedEvent } from '@app/contracts';

@Injectable()
export class BillingService {
  constructor(@Inject(FLEET_SERVICE) private _clientFleet: ClientProxy, 
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
        status: isPaymentSuccessful ? 'PAID' : 'FAILED'
      }
    });

    if (isPaymentSuccessful) {
      this.
    } else {

    }
  }
}
