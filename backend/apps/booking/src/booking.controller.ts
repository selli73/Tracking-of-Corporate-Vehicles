import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BILLING_PATTERNS, BOOKING_PATTERNS, CreateBookingDto } from '@app/contracts';
import type { ChangeStatusBooking, RpcRequest, UserContext } from '@app/contracts';
import { PaymentDto } from '@app/contracts';

@Controller()
export class BookingController {
  constructor(private _bookingService: BookingService) {}

  @MessagePattern(BOOKING_PATTERNS.CREATE_BOOKING)
  handleCreateBooking(@Payload() dto: RpcRequest<CreateBookingDto>) {
    return this._bookingService.handleCreateBooking(dto);
  }

  @MessagePattern(BOOKING_PATTERNS.GET_BOOKINGS)
  getBookings(@Payload() dto: RpcRequest<null>) {
    return this._bookingService.getBookings(dto);
  }

  @MessagePattern(BOOKING_PATTERNS.GET_ACTIVE_BOOKING)
  getActiveBookingDriver(@Payload() dto: UserContext) {
    return this._bookingService.getActiveBookingDriver(dto);
  }

  @MessagePattern(BOOKING_PATTERNS.START_BOOKING)
  start(@Payload() dto: ChangeStatusBooking) {
    return this._bookingService.start(dto.data.bookingId, dto.user.companyId)
  }

  @MessagePattern(BOOKING_PATTERNS.FINISH_BOOKING)
  finish(@Payload() dto: ChangeStatusBooking) {
    return this._bookingService.finish(dto.data.bookingId, dto.user.companyId);
  }

  @MessagePattern(BOOKING_PATTERNS.CANCEL_BOOKING)
  cancel(@Payload() dto: ChangeStatusBooking) {
    return this._bookingService.cancel(dto.data.bookingId, dto.user.companyId);
  }

  @EventPattern(BILLING_PATTERNS.PAYMENT_SUCCESS)
  paymentSuccess(@Payload() dto: PaymentDto) {
    return this._bookingService.paymentSuccess(dto);
  }

  @EventPattern(BILLING_PATTERNS.PAYMENT_FAILED)
  paymentFailed(@Payload() dto: PaymentDto) {
    return this._bookingService.paymentFailed(dto);
  }

  @MessagePattern(BOOKING_PATTERNS.CHECK_DRIVER_STATUS)
  checkDriverStatus(@Payload() dto: { vehicleId: string, driverId: string }) {
    return this._bookingService.checkDriverStatus(dto);
  }
}
