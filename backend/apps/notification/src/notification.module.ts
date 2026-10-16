import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller.js';
import { NotificationService } from './notification.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module.js';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: `${configService.getOrThrow('API_URL_TELEGRAM_BOT')}${configService.getOrThrow('TELEGRAM_BOT_TOKEN')}`,
        timeout: 10000
      })
    }),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
