import { latLngBounds, type LatLngTuple } from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

interface FitBoundsProps {
  points: LatLngTuple[];
}

// маленький компонент, который кладётся внутрь карты, ничего не рисует и только двигает её:
export const FitBounds = ({ points }: FitBoundsProps) => {
    
    const map = useMap();
    const hasFitted = useRef(false);

    useEffect(() => {
        if  (hasFitted.current || points.length === 0) return;

        map.fitBounds(latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
        hasFitted.current = true;
    }, [map, points]);    
    
    return null;
}