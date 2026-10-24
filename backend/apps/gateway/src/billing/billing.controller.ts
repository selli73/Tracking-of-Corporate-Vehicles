import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service.js';
import { Roles } from '../roles/roles.decorator.js';
import { Role } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard.js';

@Controller('billing')
@UseGuards(JwtAuthGuard) @ApiBearerAuth()
@Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER, Role.DRIVER)
export class BillingController {
  constructor(private readonly _billingService: BillingService) {}

  @Get('getInvoices')  
  getInvoices(@Req() req: IJwtUserRequest) {
    return this._billingService.getInvoices(req.user);
  }

  @Patch(':id/pay')
  payInvoice(@Param('id') id: string, @Req() req: IJwtUserRequest) {
    return this._billingService.payInvoice(id, req.user);
  }
}
