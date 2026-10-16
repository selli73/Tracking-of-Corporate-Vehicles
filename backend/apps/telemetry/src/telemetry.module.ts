import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry.controller.js';
import { TelemetryService } from './telemetry.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';import { NOTIFICATION_SERVICE, QUEUES } from '@app/contracts';
;

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: QUEUES.NOTIFICATION_EVENTS,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ])
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
