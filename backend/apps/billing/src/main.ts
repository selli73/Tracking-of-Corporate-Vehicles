import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BillingModule, 
    {
      transport: Transport.TCP,
      options: { host: process.env['IP'], port: Number(process.env['BILLING_PORT']) }
    }
  );
  
  await app.listen();
}
await bootstrap();
