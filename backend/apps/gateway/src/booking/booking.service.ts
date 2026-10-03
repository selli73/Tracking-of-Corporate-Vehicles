import { BOOKING_PATTERNS, BOOKING_SERVICE, CreateBookingDto, IStartOrFinishBooking, Role, RpcRequest, StartOrFinishBookingDto, UserContext } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
;

@Injectable()
export class BookingService {
  constructor(@Inject(BOOKING_SERVICE) private _clientBooking: ClientProxy) {}

  async create(data: CreateBookingDto, userContext: UserContext) {
    const booking = await firstValueFrom(this._clientBooking.send<unknown, RpcRequest<CreateBookingDto>>(BOOKING_PATTERNS.BOOK_VEHICLE, 
      { 
        user: { ...userContext },
        data
      })
      .pipe(timeout(4000))
    );

    return booking;
  }

  async getBookings(userContext: { userId: string; companyId: string; role: Role }) {
    const response = await firstValueFrom(this._clientBooking.send<unknown, RpcRequest<null>>(BOOKING_PATTERNS.GET_BOOKINGS, 
      { 
        user: { ...userContext }, 
        data: null 
      }).pipe(timeout(4000))
    );

    return response;
  }

  async start(bookingId: string, userContext: UserContext) {
    const response = await firstValueFrom(this._clientBooking.send<unknown, IStartOrFinishBooking>(BOOKING_PATTERNS.START_BOOKING, 
      { 
        user: {         
          ...userContext
        }, 
        data: { 
          bookingId 
        }
      }
    ).pipe(timeout(4000)));
    
    return response;
  }

  async finish(bookingId: string, userContext: UserContext) {
    const response = await firstValueFrom(this._clientBooking.send<unknown, IStartOrFinishBooking>(BOOKING_PATTERNS.FINISH_BOOKING,
      { 
        user: {           
          ...userContext
        }, 
        data: { 
          bookingId 
        }
      }
    ).pipe(timeout(4000)));

    return response;
  }
}
