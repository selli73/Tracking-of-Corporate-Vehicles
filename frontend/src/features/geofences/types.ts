export interface GeoPoint {
    lat: number;
    lng: number;
}

export interface Geofence {
    id: string;
    name: string;
    points: GeoPoint[];
}

export interface CreateGeofenceDto {
    name: string;
    polygon: GeoPoint[];
}