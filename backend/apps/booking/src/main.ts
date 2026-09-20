import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BookingModule, {
    transport: Transport.TCP,
    options: {
      host: process.env['IP'],
      port: Number(process.env['BOOKING_PORT'])
    }
  });
  
  await app.listen();
}
await bootstrap();
