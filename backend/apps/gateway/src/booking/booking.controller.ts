import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { CreateBookingDto } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { Role } from '@app/contracts';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard.js';
import { RolesGuard } from '../roles/guards/roles.guard.js';
import { Roles } from '../roles/roles.decorator.js';

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly _bookingService: BookingService) {}

  @Post()
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  create(@Req() req: IJwtUserRequest, @Body() dto: CreateBookingDto) {
    return this._bookingService.create(dto, req.user);
  }

  @Get()
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  getBookings(@Req() req: IJwtUserRequest) {
    return this._bookingService.getBookings(req.user);
  }

  @Patch(':id/start')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  start(@Req() req: IJwtUserRequest, @Param('id') bookingId: string) {
    return this._bookingService.start(bookingId, req.user);
  }

  @Patch(':id/finish')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  finish(@Req() req: IJwtUserRequest, @Param('id') id: string) {
    return this._bookingService.finish(id, req.user);
  }
}
