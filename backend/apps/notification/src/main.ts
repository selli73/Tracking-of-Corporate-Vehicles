import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module.js';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  await app.listen(process.env.port ?? 3005);
}
await bootstrap();
