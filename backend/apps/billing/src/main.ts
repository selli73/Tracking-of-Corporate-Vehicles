import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module.js';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  await app.listen(process.env.port ?? 3004);
}
await bootstrap();
