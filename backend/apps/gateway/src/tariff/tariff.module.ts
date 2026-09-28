import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service.js';
import { TariffController } from './tariff.controller.js';
import { FLEET_SERVICE } from '@app/contracts';
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
            urls: ['amqp://rabbitmq:secret@localhost:5672'],
            queue: 'fleet_queue',
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
