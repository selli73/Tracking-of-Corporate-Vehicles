import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUES } from '@app/contracts';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:secret@localhost:5672'],
      queue: QUEUES.ALERTS,
      queueOptions: {
        durable: true
      }
    }
  });
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Tracking-of-Corporate-Vehicles')
    .setDescription('API documentation for the tracking')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse({ status: 500, description: 'Internal server error' })
    .addGlobalResponse({ status: 400, description: 'Bad request' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
