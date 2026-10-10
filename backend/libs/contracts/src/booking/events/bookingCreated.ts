export class BookingCreatedEvent {

    public readonly timestamp: string;

    constructor(public readonly bookingId: string, public readonly vehicleId: string, public readonly driverId: string, startTime: string, endTime: string) {
        this.timestamp = new Date().toISOString();
    }
}