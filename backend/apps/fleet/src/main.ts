import { NestFactory } from '@nestjs/core';
import { FleetModule } from './fleet.module.js';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(FleetModule, {
    transport: Transport.TCP,
    options: {
      host: process.env['IP'],
      port: Number(process.env['FLEET_PORT'])
    }
  });

  await app.listen();
}
await bootstrap();
