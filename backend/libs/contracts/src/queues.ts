
export const EXCHANGES = {
    BOOKING_EVENTS: 'booking.events',
} as const;

export const QUEUES = {
    FLEET: 'fleet_queue',  // команда send()
    FLEET_EVENTS: 'fleet_events_queue',  // события для fleet

    BILLING_EVENTS: 'billing_events_queue',
    ALERTS: 'alerts_queue',

    TELEMETRY: 'telemetry_queue'
} as const;