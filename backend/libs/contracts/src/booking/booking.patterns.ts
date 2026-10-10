export const BOOKING_SERVICE = 'BOOKING_SERVICE';
export const BOOKING_EVENTS_CLIENT = 'BOOKING_EVENTS_CLIENT';

export const BOOKING_PATTERNS = {
  CREATE_BOOKING: 'booking.create',
  CREATED_BOOKING: 'booking.created',
  
  GET_BOOKINGS: 'get-bookings',

  START_BOOKING: 'start-booking',
  FINISH_BOOKING: 'finish-booking',

  BOOKING_STARTED: 'booking.started',
  BOOKING_FINISHED: 'booking.finished'
} as const;
