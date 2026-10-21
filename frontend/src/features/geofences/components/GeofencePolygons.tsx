import { Polygon, Tooltip } from "react-leaflet";
import type { Geofence } from "../types"

interface GeofencePolygonProps {
    geofences: Geofence[]
}

const GEOFENCE_STYLE = {
  color: '#2563eb',
  weight: 2,
  fillOpacity: 0.1,
};

export const GeofencePolygon = ({ geofences }: GeofencePolygonProps) => {
    return (
        <>
            {
                geofences.map((geofence) => (
                    <Polygon 
                        key={geofence.id} 
                        positions={geofence.points.map((p) => [p.lat, p.lng] as [number, number])} 
                        pathOptions={GEOFENCE_STYLE}
                    >                        
                        <Tooltip sticky>{geofence.name}</Tooltip>
                    </Polygon>
                ))
            }
        </>
    )
}