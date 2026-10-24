import { Marker, Popup } from "react-leaflet";
import type { VehicleLabel, VehicleLocation } from "../types"
import { formatDateTime } from "@/shared/lib/format";

interface VehicleMarkersProps {
    locations: VehicleLocation[];
    vehicleById: Map<string, VehicleLabel>
}

export const VehicleMarkers = ({ locations, vehicleById }: VehicleMarkersProps) => {        
    return (
        <>
            {
                locations.map((location) => {
                    const vehicle = vehicleById.get(location.vehicleId);
                    return (
                        <Marker key={location.vehicleId} position={[location.lat, location.lng]}>
                            <Popup>
                                <strong>{vehicle? vehicle.licensePlate : 'Машина'}</strong>
                                {
                                    vehicle && (
                                        <>
                                            <br />
                                            {vehicle.brand} {vehicle.model}                                            
                                        </>
                                    )
                                }
                                <br />
                                    Скорость: {Math.round(location.speed)} км/ч
                                <br />
                                Обновлено: {formatDateTime(location.timestamp)}
                            </Popup>
                        </Marker>
                    )
                })
            }
        </>
    )
}

