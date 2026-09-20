import { Module } from '@nestjs/common';
import 'dotenv/config';
import { HealthController } from './health.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FLEET_SERVICE } from '@app/contracts/fleet.patterns';
import { BOOKING_SERVICE } from '@app/contracts/booking.patterns';
import { TELEMETRY_SERVICE } from '@app/contracts/telemetry.patterns';
import { BILLING_SERVICE } from '@app/contracts/billing.patterns';
import { NOTIFICATION_SERVICE } from '@app/contracts/notification.patterns';

@Module({
  imports: [
    ClientsModule.register([
      { 
        name: FLEET_SERVICE, transport: Transport.TCP, options: { host: process.env['IP'], port: Number(process.env['FLEET_PORT']) }
      },
      {
        name: BOOKING_SERVICE, transport: Transport.TCP, options: { host: process.env['IP'], port: Number(process.env['BOOKING_PORT']) }
      },
      {
        name: TELEMETRY_SERVICE, transport: Transport.TCP, options: { host: process.env['IP'], port: Number(process.env['TELEMETRY_PORT']) }
      },
      {
        name: BILLING_SERVICE, transport: Transport.TCP, options: { host: process.env['IP'], port: Number(process.env['BILLING_PORT']) }
      },
      {
        name: NOTIFICATION_SERVICE, transport: Transport.TCP, options: { host: process.env['IP'], port: Number(process.env['NOTIFICATION_PORT']) }
      }
    ]),
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [HealthController],
  providers: [GatewayService],
})
export class GatewayModule {}