import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller.js';
import { BillingService } from './billing.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'FLEET_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq:secret@localhost:5672'],
            queue: 'fleet_queue',
            queueOptions: {
              durable: true,
            },
          },
        })
      }]),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
