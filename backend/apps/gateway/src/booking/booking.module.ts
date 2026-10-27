import { Module } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { BookingController } from './booking.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { BOOKING_SERVICE, QUEUES } from '@app/contracts';

@Module({
  imports: [
    ClientsModule.registerAsync([
          {
            name: BOOKING_SERVICE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
                queue: QUEUES.BOOKING,
                queueOptions: {
                  durable: true,
                },
              },
            }),
          },
        ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
