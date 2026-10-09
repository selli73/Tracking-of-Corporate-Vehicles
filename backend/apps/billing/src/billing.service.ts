import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BillingService {
  constructor(@Inject('FLEET_SERVICE') private _clientFleet: ClientProxy, 
    @Inject('TELEMETRY_SERVICE') private _clientTelemetry: ClientProxy, private _prismaService: PrismaService) {}


  async handleBookingFinished(data: { bookingId: string, vehicleId: string, userId: string, startTime: string, endTime: string }) {
    const [telemetryResponse, vehicleResponse] = await Promise.all([
      firstValueFrom(this._clientTelemetry.send('calculate_distance', data)),
      firstValueFrom(this._clientFleet.send('get_vehicle_tariff', { vehicleId: data.vehicleId }))
    ]);

    const start = new Date(data.startTime).getTime();
    const end = new Date(data.endTime).getTime();

    const durationMinutes = Math.ceil((end-start) / (1000 * 60));
    const distanceKm = telemetryResponse.distanceKm;

    const totalAmount = Math.round(
      ((durationMinutes * vehicleResponse.minuteRate) + (distanceKm * vehicleResponse.kmRate)) * 100
    );

    const invoice = await this._prismaService.invoice.create({
      data: {
        bookingId: data.bookingId,
        userId: data.userId,
        amount: totalAmount
      }
    });
  }
}
