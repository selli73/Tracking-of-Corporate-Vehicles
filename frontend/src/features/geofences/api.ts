import { http } from "@/shared/api/http";
import type { CreateGeofenceDto, Geofence } from "./types";

export const geofencesApi = {
    getAll: () => http.get<Geofence[]>('/telemetry/geofences').then((res) => res.data),
    create: (dto: CreateGeofenceDto) => http.post<{ success: boolean }>('/telemetry/createGeofence', dto).then((res) => res.data),
};