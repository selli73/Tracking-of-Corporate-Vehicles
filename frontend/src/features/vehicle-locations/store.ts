import { makeAutoObservable } from "mobx";
import type { VehicleLocation } from "./types";
import type { LoadStatus } from "@/shared/lib/loadStatus";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { vehicleLocationsApi } from "./api";


function isNewer(a: VehicleLocation, b: VehicleLocation) {
    return Date.parse(a.timestamp) > Date.parse(b.timestamp);
}

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

    upsert(location: VehicleLocation) {
        const index = this.items.findIndex((item) => item.vehicleId === location.vehicleId);

        if (index === -1) {
            this.items.push(location);
        } else if (isNewer(location, this.items[index])) {
            this.items[index] = location;
        }
        // иначе пришла старая точка — пропускаем
    }

    reset() {
        this.items = [];
        this.status = 'idle';
        this.error = null;
        this.isRefreshing = false;
    }

    setAll(items: VehicleLocation[]) {

        const current = new Map(this.items.map((item) => [item.vehicleId, item]))

        this.items = items.map((fresh) => {
            const existing = current.get(fresh.vehicleId);
            return existing && isNewer(existing, fresh) ? existing : fresh;
        });

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