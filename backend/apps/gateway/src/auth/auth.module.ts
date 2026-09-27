import { Module } from '@nestjs/common';
import { JwtStrategy } from '../user/strategies/jwt.strategy';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FLEET_SERVICE } from '@app/contracts';

@Module({
    imports: [
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
        }),
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
                durable: true              
                }
            }
            })
        },]),
    ],
    providers: [JwtStrategy, AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
