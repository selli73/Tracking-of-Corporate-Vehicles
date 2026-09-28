import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BookingModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'booking_queue',
        queueOptions: {
          durable: true
        }
      }
    },
  );

  await app.listen();
}
await bootstrap();
