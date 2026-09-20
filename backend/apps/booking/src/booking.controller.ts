import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service.js';
import { MessagePattern } from '@nestjs/microservices';
import { BOOKING_PATTERNS } from '@app/contracts/booking.patterns';

@Controller()
export class BookingController {
  constructor() {}

  @MessagePattern(BOOKING_PATTERNS.PING)
  async ping() {
    return { service: 'booking', status: 'ok' };
  }
}
