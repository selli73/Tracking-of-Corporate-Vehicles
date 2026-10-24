import type { LoadStatus } from "@/shared/lib/loadStatus";
import { makeAutoObservable } from "mobx";
import type { CreateVehicleDto, Vehicle, VehicleStatus } from "./types";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { vehicleApi } from "./api";

class VehiclesStore {
    
    items: Vehicle[] = [];
    status: LoadStatus = 'idle';
    error: string | null = null;
    
    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;

        try {
            const items = await vehicleApi.getAll();
            this.setItems(items);
        } catch(error: unknown) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить машины'));
        }
    }

    async create(dto: CreateVehicleDto) {
        const vehicle = await vehicleApi.create(dto);
        this.addItem(vehicle);
        return vehicle;
    }

    async updateStatus(id: string, status: VehicleStatus) {
        const updated = await vehicleApi.updateStatus(id, status);
        this.replaceItem(updated);
    }

    async linkTariffToVehicle(id: string, tariffId: string | null) {
        const updated = await vehicleApi.linkTariffToVehicle(id, tariffId);
        this.replaceItem(updated);
    }


    addItem(vehicle: Vehicle) {
        this.items.push(vehicle);        
    }

    setItems(items: Vehicle[]) {
        this.items = items;
        this.status = 'success';
    }

    replaceItem(updated: Vehicle) {
        const index = this.items.findIndex((v) => v.id === updated.id);
        if (index !==  -1) {
            this.items[index] = updated;
        }
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }
}

export const vehiclesStore =  new VehiclesStore();