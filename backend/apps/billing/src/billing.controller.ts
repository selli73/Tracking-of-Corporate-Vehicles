import { Controller, Get } from '@nestjs/common';
import { BillingService } from './billing.service.js';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BILLING_PATTERNS, BOOKING_PATTERNS, UserContext, VehicleReleasedEvent } from '@app/contracts';
import type { RpcRequest } from '@app/contracts';

@Controller()
export class BillingController {
  constructor(private readonly _billingService: BillingService) {}

  @EventPattern(BOOKING_PATTERNS.BOOKING_FINISHED)
  handleBookingFinished(@Payload() dto: VehicleReleasedEvent) {
    return this._billingService.handleBookingFinished(dto);
  }

  @MessagePattern(BILLING_PATTERNS.GET_INVOICES)
  getInvoices(@Payload() dto: UserContext) {
    return this._billingService.getInvoices(dto);
  }

  @MessagePattern(BILLING_PATTERNS.PAY_INVOICE)
  payInvoce(@Payload() dto: RpcRequest<{ invoiceId: string }>) {
    return this._billingService.payInvoice(dto.data.invoiceId, dto.user);
  }
}