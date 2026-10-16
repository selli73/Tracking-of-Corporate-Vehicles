import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EXCHANGES, QUEUES } from '@app/contracts';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const url = app.get(ConfigService).getOrThrow<string>('RABBITMQ_URL');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      exchange: EXCHANGES.BILLING_EVENTS,
      exchangeType: 'topic',
      noAck: false,
      wildcards: true,
      queue: QUEUES.NOTIFICATION_EVENTS,
      queueOptions: {
        durable: true
      }
    }
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      exchange: EXCHANGES.BOOKING_EVENTS,
      exchangeType: 'topic',
      noAck: false,
      wildcards: true,
      queue: QUEUES.NOTIFICATION_EVENTS,
      queueOptions: {
        durable: true
      }
    }
  });

  await app.startAllMicroservices();
  await app.init();
}
await bootstrap();
