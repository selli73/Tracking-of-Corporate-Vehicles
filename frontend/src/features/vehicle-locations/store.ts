import { makeAutoObservable } from "mobx";
import type { VehicleLocation } from "./types";
import type { LoadStatus } from "@/shared/lib/loadStatus";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { vehicleLocationsApi } from "./api";

class VehicleLocationStore {    
    items: VehicleLocation[] = []
    status: LoadStatus = 'idle';
    error: string | null = null;
    isRefreshing = false;

    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;
        try {
            this.setAll(await vehicleLocationsApi.getCurrent());
        } catch(error) {
            this.setError(getErrorMessage(error));
        }
    }

    async refresh() {
        if (this.isRefreshing) return;
        this.isRefreshing = true;

        try {
            this.setAll(await vehicleLocationsApi.getCurrent());
        } catch(error) {
            // оставляем последние известные положения
        } finally {
            this.setRefreshing(false);
        }

    }

    setAll(items: VehicleLocation[]) {
        this.items = items;
        this.status = 'success';
        this.error = null;
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }

    setRefreshing(value: boolean) {
        this.isRefreshing = value;
    }
}

export const vehicleLocationStore = new VehicleLocationStore();