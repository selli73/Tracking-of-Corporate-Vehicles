import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service.js';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello() {
    return this.notificationService.getHello();
  }
}
