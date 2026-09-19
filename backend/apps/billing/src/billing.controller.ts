import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service.js';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  getHello() {
    return this.billingService.getHello();
  }
}
