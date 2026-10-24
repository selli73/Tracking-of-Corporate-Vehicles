import { CircleMarker, Polygon, Polyline, useMapEvents } from "react-leaflet";
import type { GeofenceDraft } from "../useGeofenceDraft";
import { useEffect } from "react";
import type { LatLngTuple } from "leaflet";

const DRAFT_STYLE = { color: '#ea580c', weight: 2, dashArray: '6 4', fillOpacity: 0.15 };

interface GeofenceDraftLayerProps {
    draft: GeofenceDraft
}


export const GeofenceDraftLayer = ({ draft }: GeofenceDraftLayerProps) => {    
    const map = useMapEvents({
        click(event) {
            if (draft.isDrawing) {
                draft.addPoint({ lat: event.latlng.lat, lng: event.latlng.lng });
            }
        },
    });

    useEffect(() => {
        
        if (!draft.isDrawing) return;

        const container = map.getContainer();
        map.doubleClickZoom.disable();

        container.style.cursor = 'crosshair';

        return () => {
            map.doubleClickZoom.enable();
            container.style.cursor = '';
        };
    }, [draft.isDrawing, map]);

    if (!draft.points || draft.points.length === 0) {
        return null;
    }

    const positions = draft.points.map((p): LatLngTuple => [p.lat, p.lng]);

    return (
        <>
            {positions.length >= 3 ? (
                <Polygon positions={positions} pathOptions={DRAFT_STYLE} />
            ) : (
                <Polyline positions={positions} pathOptions={DRAFT_STYLE} />
            )}
            {positions.map((position, index) => (
                <CircleMarker key={index} center={position} radius={5} pathOptions={DRAFT_STYLE} />
            ))}
        </>
    );
}