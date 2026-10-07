import { NestFactory } from '@nestjs/core';
import { TelemetryModule } from './telemetry.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TelemetryModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:secret@localhost:5672'],
        queue: 'telemetry_queue',
        queueOptions: {
          durable: true
        }
      },
    },
  );
  await app.listen();
}
await bootstrap();
