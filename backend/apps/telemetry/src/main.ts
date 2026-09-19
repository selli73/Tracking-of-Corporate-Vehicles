import { NestFactory } from '@nestjs/core';
import { TelemetryModule } from './telemetry.module.js';

async function bootstrap() {
  const app = await NestFactory.create(TelemetryModule);
  await app.listen(process.env.port ?? 3003);
}
await bootstrap();
