import { Module } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { CompanyController } from './company.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FLEET_SERVICE } from '@app/contracts';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ClientsModule.registerAsync([
    {
      name: FLEET_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:secret@localhost:5672'],
          queue: 'fleet_queue',
          queueOptions: {
            durable: true              
          }
        }
      })
    },]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.getOrThrow('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: '1d'
          }
        }
      }
    })
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
