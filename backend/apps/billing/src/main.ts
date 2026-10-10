import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EXCHANGES, QUEUES } from '@app/contracts';

async function bootstrap() {

  const app = await NestFactory.create(BillingModule);
  const url = app.get(ConfigService).getOrThrow<string>('RABBITMQ_URL');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      exchange: EXCHANGES.BOOKING_EVENTS,
      exchangeType: 'topic',
      wildcards: true,
      queue: QUEUES.BILLING_EVENTS,
      queueOptions: {
        durable: true
      }
    }
  });

  await app.startAllMicroservices();
  await app.init();

}
await bootstrap();
