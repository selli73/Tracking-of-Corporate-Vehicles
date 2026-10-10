import { NestFactory } from '@nestjs/core';
import { FleetModule } from './fleet.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EXCHANGES, QUEUES } from '@app/contracts';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(FleetModule);
  const url = app.get(ConfigService).getOrThrow<string>('RABBITMQ_URL');

  // это слушатель команды send() от gateway и booking.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: QUEUES.FLEET,
      queueOptions: {
        durable: true
      }
    }
  })

  // это слушатель событий: emit() из exchange. Он читает очередь fleet_events_queue. Опции exchange, exchangeType, wildcards говорят что привязаны к exchange booking.events
  // При старте он делает три вещи: объявляет exchange (создаёт, если его ещё нет); объявляет очередь fleet_events_queue; привязывает очередь к exchange: создаёт binding.
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: QUEUES.FLEET_EVENTS,
      queueOptions: {
        durable: true
      },
      exchange: EXCHANGES.BOOKING_EVENTS,
      exchangeType: 'topic',
      wildcards: true      
    }
  });

  await app.startAllMicroservices();
  await app.init()
}
await bootstrap();
