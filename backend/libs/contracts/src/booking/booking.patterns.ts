export const BOOKING_SERVICE = 'BOOKING_SERVICE';
export const BOOKING_EVENTS_CLIENT = 'BOOKING_EVENTS_CLIENT';

export const BOOKING_PATTERNS = {
  CREATE_BOOKING: 'booking.create',
  CREATED_BOOKING: 'booking.created',
  
  CHECK_DRIVER_STATUS: 'booking.check-driver-status',
  GET_BOOKINGS: 'get-bookings',
  GET_ACTIVE_BOOKING: 'get-active-booking',

  START_BOOKING: 'start-booking',
  FINISH_BOOKING: 'finish-booking',
  CANCEL_BOOKING: 'cancel-booking',

  BOOKING_STARTED: 'booking.started',
  BOOKING_FINISHED: 'booking.finished',
  BOOKING_CANCELED: 'booking.canceled',
  BOOKINGS_EXPIRED: 'booking.expired'
} as const;
