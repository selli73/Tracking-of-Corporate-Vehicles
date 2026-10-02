import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BOOKING_PATTERNS, CreateBookingDto, ERROR_CODES, FLEET_PATTERNS, RpcRequest } from '@app/contracts';
import { BookingStatus } from '@prisma/client-booking';
import { VehicleReleasedEvent } from './events/vehicleReleased';

@Injectable()
export class BookingService {
  constructor(private _prismaService: PrismaService, @Inject('FLEET_SERVICE') private _fleetClient: ClientProxy) {}

  async handleCreateBooking(dto: RpcRequest<CreateBookingDto>) {

    const start = new Date(dto.data.startDate);
    const end = new Date(dto.data.endDate);
    
    if (start.getTime() < Date.now() - 60000) {
      throw new RpcException({ code: ERROR_CODES.START_IN_PAST, message: 'Start date is in the past' });
    }    

    if (start >= end) {
      throw new RpcException({
        code: ERROR_CODES.INTERVAL_INVALID,
        message: 'The booking period is incorrect'
      });
    }

    try {      
      await firstValueFrom(this._fleetClient.send(FLEET_PATTERNS.CHECH_VEHICLE_STATUS, { vehicleId: dto.data.vehicleId }));
    } catch(error: any) {
      throw new RpcException(error.message);
    }

    const booking = await this._prismaService.booking.findFirst({
      where: {
        companyId: dto.user.companyId,
        vehicleId: dto.data.vehicleId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.ACTIVE]
        },
        startDate: { 
          lt: end
        },
        endDate: {
          gt: start
        }
      }
    });

    if (booking) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_OVERLAP,
        message: 'The car is booked for this date'
      });
    }

    const newBooking = await this._prismaService.booking.create({
      data: { 
        vehicleId: dto.data.vehicleId,
        userId: dto.user.userId,
        startDate: start,
        endDate: end,
        companyId: dto.user.companyId
      }
    });

    this._fleetClient.emit(BOOKING_PATTERNS.BOOKING_CREATED, { vehicleId: dto.data.vehicleId, bookingId: newBooking.id });

    return {
      success: true,
      booking: newBooking
    }
  }

  async start(bookingId: string, companyId: string) {
    const booking = await this._prismaService.booking.findUnique({
      where: {
       id: bookingId       
      }
    });

    if (!booking) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found'
      });
    }

    if (booking.companyId !== companyId) {
      throw new RpcException({
        code: ERROR_CODES.NOT_YOUR_RESERATION,
        message: 'The booking does not apply to this company'
      });
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new RpcException({
        code: ERROR_CODES.DOES_NOT_START,
        message: 'We cannot start the trip'
      });
    }

    const startedBooking = await this._prismaService.booking.update({
      where: {
        id: booking.id
      },
      data: {
        status: BookingStatus.ACTIVE
      }
    });

    this._fleetClient.emit(FLEET_PATTERNS.BOOKING_STARTED, new VehicleReleasedEvent(booking.vehicleId, booking.id));    

    return startedBooking;
  }

  async finish(bookingId: string, companyId: string) {
    const booking = await this._prismaService.booking.findUnique({
      where: {
        id: bookingId
      }
    });

    if (!booking) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found'
      });
    }

    if (booking.companyId !== companyId) {
      throw new RpcException({
        code: ERROR_CODES.NOT_YOUR_RESERATION,
        message: 'The booking does not apply to this company'
      });
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new RpcException({
        code: ERROR_CODES.DOES_NOT_COMPLETE,
        message: 'We cannot complete the booking'
      });
    }

    const finishedBooking = await this._prismaService.booking.update({
      where: {
        id: booking.id
      },
      data: {
        status: BookingStatus.COMPLETED
      }
    });

    this._fleetClient.emit(FLEET_PATTERNS.BOOKING_FINISHED, new VehicleReleasedEvent(booking.vehicleId, booking.id));

    return finishedBooking;
  }
}
