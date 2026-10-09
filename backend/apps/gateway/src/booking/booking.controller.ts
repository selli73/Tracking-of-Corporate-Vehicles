import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { CreateBookingDto } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { Role } from '@app/contracts';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard.js';
import { RolesGuard } from '../roles/guards/roles.guard.js';
import { Roles } from '../roles/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly _bookingService: BookingService) {}

  @Post()
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Book a car' }) @ApiResponse({ status: 200, description: 'The car is reserved' })
  create(@Req() req: IJwtUserRequest, @Body() dto: CreateBookingDto) {
    return this._bookingService.create(dto, req.user);
  }

  @Get()
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get a list of bookings' }) @ApiResponse({ status: 200, description: 'List of bookings received' })
  getBookings(@Req() req: IJwtUserRequest) {
    return this._bookingService.getBookings(req.user);
  }

  @Patch(':id/start')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Start the trip' }) @ApiResponse({ status: 200, description: 'The trip got off to a successful start' })
  start(@Req() req: IJwtUserRequest, @Param('id') bookingId: string) {
    return this._bookingService.start(bookingId, req.user);
  }

  @Patch(':id/finish')
  @Roles(Role.OWNER, Role.COMPANY_ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'End trip' }) @ApiResponse({ status: 200, description: 'The trip has been successfully completed' })
  finish(@Req() req: IJwtUserRequest, @Param('id') id: string) {
    return this._bookingService.finish(id, req.user);
  }
}
