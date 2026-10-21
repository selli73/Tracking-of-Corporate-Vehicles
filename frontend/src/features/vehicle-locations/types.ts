export interface VehicleLocation {
    vehicleId: string;
    lat: number;
    lng: number;
    speed: number;
    timestamp: string;    
}

export interface VehicleLabel {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
}