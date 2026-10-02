import { BOOKING_PATTERNS, BOOKING_SERVICE, CreateBookingDto, IStartOrFinishBooking, RpcRequest, StartOrFinishBookingDto, UserContext } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
;

@Injectable()
export class BookingService {
  constructor(@Inject(BOOKING_SERVICE) private _clientBooking: ClientProxy) {}

  async create(data: CreateBookingDto, userContext: UserContext) {
    const booking = await firstValueFrom(this._clientBooking.send<unknown, RpcRequest<CreateBookingDto>>(BOOKING_PATTERNS.BOOK_VEHICLE, 
      { 
        user: { userId: userContext.userId, companyId: userContext.companyId, role: userContext.role },
        data
      })
      .pipe(timeout(4000))
    );

    return booking;
  }

  async start(bookingId: string, companyId: string) {
    const response = await firstValueFrom(this._clientBooking.send<unknown, IStartOrFinishBooking>(BOOKING_PATTERNS.START_BOOKING, 
      { 
        user: {         
          companyId
        }, 
        data: { 
          bookingId 
        }
      }
    ).pipe(timeout(4000)));
    
    return response;
  }

  async finish(bookingId: string, companyId: string) {
    const response = await firstValueFrom(this._clientBooking.send<unknown, IStartOrFinishBooking>(BOOKING_PATTERNS.FINISH_BOOKING, 
      { 
        user: {           
          companyId: companyId,
        }, 
        data: { 
          bookingId 
        }
      }
    ).pipe(timeout(4000)));

    return response;
  }
}
