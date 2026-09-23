import { NestFactory } from '@nestjs/core';
import { FleetModule } from './fleet.module.js';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(FleetModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:secret@localhost:5672'],
      queue: 'fleet_queue',
      noAck: false,
      queueOptions: {
        durable: true        
      }
    }
  });

  await app.listen();
}
await bootstrap();
