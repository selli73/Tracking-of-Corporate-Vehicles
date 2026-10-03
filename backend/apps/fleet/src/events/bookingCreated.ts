export class BookingCreatedEvent {

    public readonly timestamp: string;

    constructor(public readonly vehicleId: string, public readonly bookingId: string) {
        this.timestamp = new Date().toISOString();
    }
}