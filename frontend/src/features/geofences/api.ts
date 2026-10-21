import { http } from "@/shared/api/http";
import type { Geofence } from "./types";

export const geofencesApi = {
    getAll: () => http.get<Geofence[]>('/telemetry/geofences').then((res) => res.data),
}