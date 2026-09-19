import { NestFactory } from '@nestjs/core';
import { FleetModule } from './fleet.module.js';

async function bootstrap() {
  const app = await NestFactory.create(FleetModule);
  await app.listen(process.env.port ?? 3001);
}
await bootstrap();
