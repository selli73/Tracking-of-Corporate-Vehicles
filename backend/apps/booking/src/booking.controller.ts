import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service.js';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  getHello() {
    return this.bookingService.getHello();
  }
}
