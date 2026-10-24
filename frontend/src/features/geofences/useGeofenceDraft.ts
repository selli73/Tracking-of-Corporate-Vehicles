import { useState } from "react"
import type { GeoPoint } from "./types";

// это хук для рисования. 
export const useGeofenceDraft = () => {
    const [points, setPoints] = useState<GeoPoint[] | null>(null);

    return {
        points,
        isDrawing: points !== null,
        start: () => setPoints([]),
        addPoint: (point: GeoPoint) => setPoints((prev) => (prev ? [...prev, point] : prev)),
        undo: () => setPoints((prev) => (prev ? prev.slice(0, -1) : prev)),
        cancel: () => setPoints(null)
    };
}

export type GeofenceDraft = ReturnType<typeof useGeofenceDraft>;