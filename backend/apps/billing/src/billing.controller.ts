import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service.js';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BOOKING_PATTERNS, VehicleReleasedEvent } from '@app/contracts';

@Controller()
export class BillingController {
  constructor(private readonly _billingService: BillingService) {}

  @EventPattern(BOOKING_PATTERNS.BOOKING_FINISHED)
  handleBookingFinished(@Payload() dto: VehicleReleasedEvent) {
    this._billingService.handleBookingFinished(dto);
  }
}