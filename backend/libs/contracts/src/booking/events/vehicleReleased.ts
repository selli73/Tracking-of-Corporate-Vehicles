export class VehicleReleasedEvent {
    
    public readonly timestamp: string;

    constructor(public readonly bookingId: string, public readonly vehicleId: string, public readonly driverId: string, 
            public readonly userId: string, public readonly startTime: string, public readonly finishedAt: string) { 
        
        this.timestamp = new Date().toISOString();
    }
}