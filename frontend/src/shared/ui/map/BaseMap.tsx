import type { LatLngExpression } from "leaflet";
import type { ReactNode } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import 'leaflet/dist/leaflet.css';
import './fixLeafletIcons';


interface BaseMapProps {
    children?: ReactNode;
    height?: string;
}

const DEFAULT_CENTER: LatLngExpression = [55.751244, 37.618423];
const DEFAULT_ZOOM = 11;

export const BaseMap = ({ children, height = '600px' }: BaseMapProps) => {
    return (
        <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height, width: '100%' }}
        >
            <TileLayer
                attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  
            />
            {children}
        </MapContainer>
    )
}