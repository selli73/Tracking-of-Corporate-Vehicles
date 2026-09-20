import { NestFactory } from '@nestjs/core';
import { TelemetryModule } from './telemetry.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TelemetryModule, 
    {
      transport: Transport.TCP,
      options: {
        host: process.env['IP'],
        port: Number(process.env['TELEMETRY_PORT'])
      }
    }    
  );
  await app.listen();
}
await bootstrap();
