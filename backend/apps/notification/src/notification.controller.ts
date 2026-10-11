import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BILLING_PATTERNS, PaymentDto } from '@app/contracts';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(BILLING_PATTERNS.PAYMENT_FAILED)
  paymentFailed(@Payload() dto: PaymentDto) {
    this.notificationService.paymentFailed(dto);
  }

  @EventPattern(BILLING_PATTERNS.PAYMENT_SUCCESS)
  paymentSuccess(@Payload() dto: PaymentDto) {
    this.notificationService.paymentSuccess(dto);
  }
}
