import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EXCHANGES, QUEUES } from '@app/contracts';

async function bootstrap() {
  
  const app = await NestFactory.create(BookingModule);
  const url = app.get(ConfigService).getOrThrow<string>('RABBITMQ_URL');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: QUEUES.BOOKING,
        queueOptions: {
          durable: true
        }
      }
    }
  );

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [url],
        exchange: EXCHANGES.BILLING_EVENTS,
        exchangeType: 'topic',
        wildcards: true,
        queue: QUEUES.BOOKING_EVENTS,
        queueOptions: {
          durable: true
        }
      }
    }
  );

  await app.startAllMicroservices();
  await app.init();
}
await bootstrap();
