export class BookingCreatedEvent {

    public readonly timestamp: string;

    constructor(public readonly bookingId: string, public readonly vehicleId: string, public readonly driverId: string,
        public readonly driverEmail: string, public readonly startTime: string, public readonly endTime: string) {
        this.timestamp = new Date().toISOString();
    }
}