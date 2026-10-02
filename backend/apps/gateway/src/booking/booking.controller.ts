import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { CreateBookingDto } from '@app/contracts';
import type { IJwtUserRequest } from '@app/contracts';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard.js';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly _bookingService: BookingService) {}

  @Post()
  create(@Req() req: IJwtUserRequest, @Body() dto: CreateBookingDto) {
    return this._bookingService.create(dto, { userId: req.user.userId, companyId: req.user.companyId, role: req.user.role });
  }

  @Post(':id/start')
  start(@Req() req: IJwtUserRequest, @Param('id') bookingId: string) {
    return this._bookingService.start(bookingId, req.user.companyId);
  }

  @Post(':id/finish')
  finish(@Req() req: IJwtUserRequest, @Param('id') id: string) {
    return this._bookingService.finish(id, req.user.companyId);
  }
}
