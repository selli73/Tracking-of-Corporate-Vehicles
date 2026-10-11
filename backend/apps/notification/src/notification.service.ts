import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PaymentDto } from '@app/contracts';

@Injectable()
export class NotificationService {

  private _logger = new Logger(NotificationService.name)

  constructor(private _prismaService: PrismaService) {}

  paymentFailed(data: PaymentDto) {
    this._logger.warn(`У пользователя ${data.userId} долг ${data.amount} по booking: ${data.bookingId}`);
  }

  paymentSuccess(data: PaymentDto) {
    this._logger.log(`Пользователь ${data.userId} оплатил за аренду ${data.amount} по booking: ${data.bookingId}`);
  }
}
