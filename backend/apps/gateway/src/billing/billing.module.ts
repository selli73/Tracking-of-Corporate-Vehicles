import { Module } from '@nestjs/common';
import { BillingService } from './billing.service.js';
import { BillingController } from './billing.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BILLING_SERVICE, QUEUES } from '@app/contracts';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: BILLING_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: QUEUES.BILLING,
            queueOptions: {
              durable: true,
            },
          },
        }),
      }
    ])
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
