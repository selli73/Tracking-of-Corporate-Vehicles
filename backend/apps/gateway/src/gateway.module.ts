import { Module } from '@nestjs/common';
import 'dotenv/config';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FLEET_SERVICE } from '@app/contracts';
import { BOOKING_SERVICE } from '@app/contracts/booking.patterns';
import { TELEMETRY_SERVICE } from '@app/contracts/telemetry.patterns';
import { BILLING_SERVICE } from '@app/contracts/billing.patterns';
import { NOTIFICATION_SERVICE } from '@app/contracts/notification.patterns';
import { AuthModule } from './auth/auth.module.js';
import { CompanyModule } from './company/company.module.js';
import { VehiclesController } from './vehicles/vehicles.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: FLEET_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq:secret@localhost:5672'],
            queue: 'fleet_queue',
            queueOptions: {
              durable: true              
            }
          }
        })
      },
      {
        name: BOOKING_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: process.env['IP'],
            port: Number(process.env['BOOKING_PORT'])
          }
        })
      },
      {
        name: TELEMETRY_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: process.env['IP'],
            port: Number(process.env['TELEMETRY_PORT'])
          }
        })
      },
      {
        name: BILLING_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: process.env['IP'],
            port: Number(process.env['BILLING_PORT'])
          }
        })
      },
      {
        name: NOTIFICATION_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: process.env['IP'],
            port: Number(process.env['NOTIFICATION_PORT'])
          }
        })
      }
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompanyModule,    
  ],
  controllers: [GatewayController, VehiclesController],
  providers: [GatewayService]
})
export class GatewayModule {}