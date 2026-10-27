import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service.js';
import { TariffController } from './tariff.controller.js';
import { FLEET_SERVICE, QUEUES } from '@app/contracts';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: FLEET_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: QUEUES.FLEET,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },]),
  ],
  controllers: [TariffController],
  providers: [TariffService],
})
export class TariffModule {}
