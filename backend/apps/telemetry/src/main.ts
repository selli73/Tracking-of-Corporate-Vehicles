import { NestFactory } from '@nestjs/core';
import { TelemetryModule } from './telemetry.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@app/contracts';

const getEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`);
  }
  return value;
}

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TelemetryModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [getEnv('RABBITMQ_URL')],
        queue: QUEUES.TELEMETRY,
        queueOptions: {
          durable: true
        }
      },
    },
  );
  await app.listen();
}
await bootstrap();
