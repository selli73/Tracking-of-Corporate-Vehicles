import { http } from "@/shared/api/http";
import type { VehicleLocation } from "./types";

export const vehicleLocationsApi = {
    getCurrent: () => http.get<VehicleLocation[]>('/telemetry/vehicles/locations').then((res) => res.data),
}