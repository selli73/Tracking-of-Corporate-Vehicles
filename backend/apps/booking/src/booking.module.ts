import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller.js';
import { BookingService } from './booking.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BOOKING_EVENTS_CLIENT, EXCHANGES, FLEET_SERVICE } from '@app/contracts';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: BOOKING_EVENTS_CLIENT,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            exchange: EXCHANGES.BOOKING_EVENTS,
            exchangeType: 'topic',
            wildcards: true,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
      {
        name: FLEET_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: 'fleet_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
  ])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
