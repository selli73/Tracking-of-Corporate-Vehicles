import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service.js';
import { MessagePattern } from '@nestjs/microservices';
import { BILLING_PATTERNS } from '@app/contracts/billing.patterns';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @MessagePattern(BILLING_PATTERNS.PING)
  ping() {
    return { service: 'billing', status: 'ok' };
  }
}
