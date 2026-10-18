import { http } from "@/shared/api/http";
import type { CreateVehicleDto, Vehicle, VehicleStatus } from "./types";

export const vehicleApi = {
    getAll: () => http.get<Vehicle[]>('/vehicles/get-all').then((res) => res.data),
    create: (dto: CreateVehicleDto) => http.post<Vehicle>('/vehicles/create-vehicle', dto).then((res) => res.data),
    updateStatus: (id: string, status: VehicleStatus) => http.patch<Vehicle>(`/vehicles/${id}/update-status`, { status }).then((res) => res.data),
    linkTariffToVehicle: (id: string, tariffId: string | null) => http.patch<Vehicle>('/vehicles/link-tariff-to-vehicle', { vehicleId: id, tariffId }).then((res) => res.data),
};