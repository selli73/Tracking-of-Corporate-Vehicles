import type { LoadStatus } from "@/shared/lib/loadStatus";
import { geofencesApi } from "./api";
import type { Geofence } from "./types";
import { makeAutoObservable } from "mobx";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

class GeofenceStore {
    items: Geofence[] = [];
    status: LoadStatus = 'idle';
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;

        try {
            this.setItems(await geofencesApi.getAll())
        } catch(error) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить геозоны'));
        }
    }

    setItems(items: Geofence[]) {        
        this.items = items;
        this.status = 'success';
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }
}

export const geofenceStore = new GeofenceStore();