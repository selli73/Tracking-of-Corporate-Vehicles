
export const EXCHANGES = {
    BOOKING_EVENTS: 'booking.events',
    BILLING_EVENTS: 'billing.events'
} as const;

export const QUEUES = {
    FLEET: 'fleet_queue',  // команда send()
    FLEET_EVENTS: 'fleet_events_queue',  // события для fleet

    BOOKING: 'booking_queue',
    BOOKING_EVENTS: 'booking_events_queue',

    TELEMETRY: 'telemetry_queue',

    BILLING_EVENTS: 'billing_events_queue',
    ALERTS: 'alerts_queue',


    NOTIFICATION: 'notification_queue',
    NOTIFICATION_EVENTS: 'notification_events_queue'

} as const;