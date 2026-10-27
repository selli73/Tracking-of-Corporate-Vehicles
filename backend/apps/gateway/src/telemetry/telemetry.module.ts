import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service.js';
import { TelemetryController } from './telemetry.controller.js';
import { QUEUES, TELEMETRY_SERVICE } from '@app/contracts';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FleetMapModule } from '../fleet-map/fleet-map.module.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TELEMETRY_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: QUEUES.TELEMETRY,
            queueOptions: {
              durable: true
            }
          },
        }),
      },
    ]),
    FleetMapModule
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
