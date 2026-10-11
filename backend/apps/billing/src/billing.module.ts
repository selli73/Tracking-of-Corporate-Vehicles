import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller.js';
import { BillingService } from './billing.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BILLING_EVENTS_CLIENT, EXCHANGES, FLEET_SERVICE, QUEUES, TELEMETRY_SERVICE } from '@app/contracts';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: BILLING_EVENTS_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({ 
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            exchange: EXCHANGES.BILLING_EVENTS,
            exchangeType: 'topic',
            wildcards: true,
            queueOptions: {
              durable: true
            }
          }
        })
      },
      {
        name: FLEET_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: QUEUES.FLEET,
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      {
        name: TELEMETRY_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: QUEUES.TELEMETRY,
            queueOptions: {
              durable: true,
            },
          },
        })
      }
    ]),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
