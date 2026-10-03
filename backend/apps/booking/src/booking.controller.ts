import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BOOKING_PATTERNS, CreateBookingDto } from '@app/contracts';
import type { IStartOrFinishBooking, RpcRequest } from '@app/contracts';

@Controller()
export class BookingController {
  constructor(private _bookingService: BookingService) {}

  @MessagePattern(BOOKING_PATTERNS.BOOK_VEHICLE)
  handleCreateBooking(@Payload() dto: RpcRequest<CreateBookingDto>) {
    return this._bookingService.handleCreateBooking(dto);
  }

  @MessagePattern(BOOKING_PATTERNS.GET_BOOKINGS)
  getBookings(@Payload() dto: RpcRequest<null>) {
    return this._bookingService.getBookings(dto);
  }

  @MessagePattern(BOOKING_PATTERNS.START_BOOKING)
  start(@Payload() dto: IStartOrFinishBooking) {
    return this._bookingService.start(dto.data.bookingId, dto.user.companyId)
  }

  @MessagePattern(BOOKING_PATTERNS.FINISH_BOOKING)
  finish(@Payload() dto: IStartOrFinishBooking) {
    return this._bookingService.finish(dto.data.bookingId, dto.user.companyId);
  }
}
