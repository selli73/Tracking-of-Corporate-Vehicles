import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.TCP,
    options: {
      host: process.env['IP'],
      port: Number(process.env['NOTIFICATION_PORT'])
    }
  });
  
  await app.listen();
}
await bootstrap();
