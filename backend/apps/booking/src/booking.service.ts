import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { BOOKING_EVENTS_CLIENT, BOOKING_PATTERNS, CreateBookingDto, ERROR_CODES, FLEET_PATTERNS, isRpcErrorPayload, PaymentDto, RpcRequest, UserContext } from '@app/contracts';
import { BookingStatus } from '@prisma/client-booking';
import { VehicleReleasedEvent } from '@app/contracts';
import { VehicleStartedEvent } from './events/vehicleStarted';
import { BookingCreatedEvent } from '@app/contracts';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingService {

  private _logger = new Logger(BookingService.name);

  constructor(private _prismaService: PrismaService, @Inject('FLEET_SERVICE') private _fleetClient: ClientProxy, 
    @Inject(BOOKING_EVENTS_CLIENT) private _bookingEventsClient: ClientProxy ) {}

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
    let driver;
    try {      
      await firstValueFrom(this._fleetClient.send(FLEET_PATTERNS.CHECH_VEHICLE_STATUS, { companyId: dto.user.companyId, vehicleId: dto.data.vehicleId }).pipe(timeout(4000)));
      driver = await firstValueFrom(this._fleetClient.send<{ email: string }>(FLEET_PATTERNS.GET_DRIVER_EMAIL, { driverId: dto.data.driverId }));
    } catch(error: unknown) {
      if (isRpcErrorPayload(error)) {
        throw new RpcException(error);
      }

      throw new RpcException({
        code: ERROR_CODES.SERVICE_UNAVAILABLE,
        message: 'Fleet service is unavailable',
      })
    }

    const booking = await this._prismaService.booking.findFirst({
      where: {
        companyId: dto.user.companyId,
        vehicleId: dto.data.vehicleId,
        status: {
          notIn: [BookingStatus.CANCELED, BookingStatus.COMPLETED]
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
        recorderId: dto.user.userId,
        driverId: dto.data.driverId,
        driverEmail: driver.email, 
        startDate: start,
        endDate: end,
        companyId: dto.user.companyId
      }
    });

    this._bookingEventsClient.emit(BOOKING_PATTERNS.CREATED_BOOKING, new BookingCreatedEvent(newBooking.id, dto.data.vehicleId, newBooking.driverId, newBooking.driverEmail, newBooking.startDate.toISOString(), newBooking.endDate.toISOString()));

    return {
      success: true,
      booking: newBooking
    }
  }

  async getBookings(dto: RpcRequest<null>) {
    return this._prismaService.booking.findMany({
      where: {
        companyId: dto.user.companyId,
        driverId: dto.user.role === 'DRIVER'? dto.user.userId : undefined
      }
    });
  }

  async getActiveBookingDriver(user: UserContext) {
    return this._prismaService.booking.findFirst({
      where: {
        driverId: user.userId,
        status: BookingStatus.ACTIVE
      }
    });
  }

  async start(bookingId: string, companyId: string) {
    const booking = await this._prismaService.booking.findUnique({
      where: {
       id: bookingId,
       companyId    
      }
    });

    if (!booking) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found'
      });
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_STARTED,
        message: 'We cannot start the trip'
      });
    }

    if (booking.startDate > new Date()) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_STARTED,
        message: 'You cannot start using the vehicle before the reservation start date'
      })
    }

    if (new Date() >= booking.endDate) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_PERIOD_EXPIRED,
        message: 'The trip cannot be started because the booking period has expired'
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

    this._bookingEventsClient.emit(BOOKING_PATTERNS.BOOKING_STARTED, new VehicleStartedEvent(booking.vehicleId, booking.id));    

    return startedBooking;
  }

  async finish(bookingId: string, companyId: string) {
    const now = new Date();

    const booking = await this._prismaService.booking.findUnique({
      where: {
        id: bookingId,
        companyId
      }
    });

    if (!booking) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found'
      });
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_COMPLETE,
        message: 'We cannot complete the booking'
      });
    }

    const finishedBooking = await this._prismaService.booking.update({
      where: {
        id: booking.id
      },
      data: {
        status: BookingStatus.COMPLETED,
        finishedAt: now
      }
    });

    this._bookingEventsClient.emit(BOOKING_PATTERNS.BOOKING_FINISHED, new VehicleReleasedEvent(booking.id, finishedBooking.companyId,booking.vehicleId, finishedBooking.driverId, finishedBooking.driverEmail,
      finishedBooking.recorderId, finishedBooking.startDate.toISOString(), finishedBooking.finishedAt? finishedBooking.finishedAt.toISOString() : 'empty'));

    return finishedBooking;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async expiredBookings() {
    try {
      const { count } = await this._prismaService.booking.updateMany({
        where: {
          status: BookingStatus.PENDING,
          endDate: {
            lte: new Date()
          }
        },
        data: {
          status: BookingStatus.EXPIRED
        }
      });

      if (count > 0) {        
        this._logger.log(`Просроченных броней переведено в EXPIRED: ${count}`);
      }      

    } catch(error) {
      this._logger.error('Не удалось обработать просроченные брони', error)
    }
  }

  async cancel(bookingId: string, companyId: string) {
    const booking = await this._prismaService.booking.findUnique({
      where: {
        id: bookingId
      }
    });

    if (!booking || booking.companyId !== companyId) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found'
      });
    }

    const { count } = await this._prismaService.booking.updateMany({
      where: {
        id: bookingId,
        status: BookingStatus.PENDING
      },
      data: {
        status: BookingStatus.CANCELED
      }
    });

    if (count === 0) {
      throw new RpcException({ code: ERROR_CODES.CANNOT_BE_CANCELED, message: 'The trip cannot be cancelled' });
    }  
    
    return { ...booking, status: BookingStatus.CANCELED };
  }

  async paymentFailed(data: PaymentDto) {
    const { count } = await this._prismaService.booking.updateMany({
      where: {
        id: data.bookingId,
        status: {
          in: [BookingStatus.COMPLETED, BookingStatus.DEBT]
        }
      },
      data: { status: BookingStatus.DEBT },
    });    

    if (count === 0) {
      this._logger.warn(`Booking ${data.bookingId}: not found or not completed, DEBT not set`);
    }    
  }

  async paymentSuccess(data: PaymentDto) {
    await this._prismaService.booking.updateMany({
      where: {
        id: data.bookingId,
        status: BookingStatus.DEBT
      },
      data: {
        status: BookingStatus.COMPLETED
      }
    });
  }

  async checkDriverStatus(data: { vehicleId: string, driverId: string }) {
    const booking = await this._prismaService.booking.findFirst({
      where: {
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        status: BookingStatus.ACTIVE
      }
    });

    if (!booking) {
      throw new RpcException({
        code: ERROR_CODES.BOOKING_NOT_FOUND,
        message: 'Booking not found'
      });
    }

    return {
      success: true
    };
  }
}
