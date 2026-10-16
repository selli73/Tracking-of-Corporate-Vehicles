import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PaymentDto } from '@app/contracts';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { NotificationChannel, NotificationStatus } from '@prisma/client-notification';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MailService } from './mail/mail.service';

@Injectable()
export class NotificationService {

  private _logger = new Logger(NotificationService.name)

  private transporter: Transporter;
  private readonly tgBotToken: string;
  private readonly tgDispatcherTgId: string;

  constructor(private _prismaService: PrismaService, private _configService: ConfigService, private readonly _http: HttpService,
      private _mailService: MailService
  ) {
    this.tgBotToken = _configService.getOrThrow('TELEGRAM_BOT_TOKEN');
    this.tgDispatcherTgId = _configService.getOrThrow('TELEGRAM_DISPATCHER_ID');
  }

  async sendTelegramAlert(eventType: string, message: string) {
    const log = await this._prismaService.notificationLog.create({
      data: {
        recipient: this.tgDispatcherTgId,
        channel: NotificationChannel.TELEGRAM,
        eventType,
        payload: message
      }
    });

    try {      
      const response = await firstValueFrom(this._http.post('/sendMessage', {
        chat_id: this.tgDispatcherTgId,
        text: message,
        parse_mode: 'HTML'
      }));
      
      if (response.status !== 200) {
        throw new Error('Telegram API error(')
      }

      await this._prismaService.notificationLog.update({
        where: {
          id: log.id
        },
        data: {
          status: NotificationStatus.SENT
        }
      });

      this._logger.log('Telegram alert успешно доставлен');
    } catch(error: any) {
      await this._prismaService.notificationLog.update({
        where: {
          id: log.id
        },
        data: {
          status: NotificationStatus.FAILED,
          error: error.message
        }
      });

      throw error;
    }
  }

  async sendEmail(to: string, subject: string, text: string, eventType: string) {
    const log = await this._prismaService.notificationLog.create({
      data: {
        recipient: to,
        channel: NotificationChannel.EMAIL,
        eventType,
        payload: text
      }
    });

    try {
      await this._mailService.sendMessage(to, subject, text, eventType);

      await this._prismaService.notificationLog.update({
        where: {
          id: log.id
        },
        data: {
          status: NotificationStatus.SENT
        }
      });

      this._logger.log('Письмо на почту отправлено');
    } catch(error: any) {
      await this._prismaService.notificationLog.update({
        where: {
          id: log.id
        },
        data: {
          status: NotificationStatus.FAILED
        }
      });

      throw error;
    }
  }
}
