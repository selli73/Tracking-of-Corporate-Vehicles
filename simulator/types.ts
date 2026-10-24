export interface Point {
    lat: number;
    lng: number;
}

export interface ActiveBooking {
    id: string;
    vehicleId: string;
}

export type Route = Point[];