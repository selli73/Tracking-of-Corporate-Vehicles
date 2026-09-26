import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { BOOKING_SERVICE, BOOKING_PATTERNS } from '@app/contracts/booking.patterns';
import { TELEMETRY_PATTERNS, TELEMETRY_SERVICE } from '@app/contracts/telemetry.patterns';
import { BILLING_SERVICE, BILLING_PATTERNS } from '@app/contracts/billing.patterns';
import { NOTIFICATION_SERVICE, NOTIFICATION_PATTERNS } from '@app/contracts/notification.patterns';
import { FLEET_SERVICE, FLEET_PATTERNS, CreateVehicleDto } from '@app/contracts';

@Controller('gateway')
export class GatewayController {
  constructor(
    @Inject(FLEET_SERVICE) private _clientFleet: ClientProxy,
    @Inject(BOOKING_SERVICE) private _clientBooking: ClientProxy,
    @Inject(TELEMETRY_SERVICE) private _clientTelemetry: ClientProxy,
    @Inject(BILLING_SERVICE) private _clientBilling: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private _clientNotification: ClientProxy,
  ) {}

  @Get()
  async check() {
      const fleet = await firstValueFrom(this._clientFleet.send(FLEET_PATTERNS.PING, { }).pipe(timeout(3000)));
      const booking = await firstValueFrom(this._clientBooking.send(BOOKING_PATTERNS.PING, { }).pipe(timeout(3000)));
      const telemetry = await firstValueFrom(this._clientTelemetry.send(TELEMETRY_PATTERNS.PING, { }).pipe(timeout(3000)));
      const billing = await firstValueFrom(this._clientBilling.send(BILLING_PATTERNS.PING, { }).pipe(timeout(3000)));
      const notification = await firstValueFrom(this._clientNotification.send(NOTIFICATION_PATTERNS.PING, { }).pipe(timeout(3000)));

      return {
        gateway: 'ok',
        fleet,
        booking,
        telemetry,
        billing,
        notification
      };
  }

  
  @Post()
  createVehicleGateway(@Body() data: CreateVehicleDto) {
    return this._clientFleet.send(FLEET_PATTERNS.CREATE_VEHICLE, data).pipe(timeout(10000));
  }

  @Get('all-vehicle')
  getAllVehicle() {
    return this._clientFleet.send(FLEET_PATTERNS.GET_ALL_VEHICLE, {});
  }
}
