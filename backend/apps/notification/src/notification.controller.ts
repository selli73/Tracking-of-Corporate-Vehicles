import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagePattern } from '@nestjs/microservices';
import { NOTIFICATION_PATTERNS } from '@app/contracts/notification.patterns';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(NOTIFICATION_PATTERNS.PING)
  getHello() {
    return { service: 'notification', status: 'ok' };
  }
}
