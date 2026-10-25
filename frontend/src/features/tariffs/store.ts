import { makeAutoObservable } from "mobx";
import type { CreateTariffDto, Tariff } from "./types";
import type { LoadStatus } from "@/shared/lib/loadStatus";
import { tariffsApi } from "./api";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

class TariffStore {
    
    items: Tariff[] = [];
    status: LoadStatus = 'idle';
    error: string | null = null;
    
    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;

        try {
            this.setItems(await tariffsApi.getAll());            
        } catch(error) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить тарифы'));
        }
    }

    async create(dto: CreateTariffDto) {
        const tariff = await tariffsApi.create(dto);
        this.addItem(tariff);
        return tariff;
    }

    reset() {
        this.items = [];
        this.status = 'idle';
        this.error = null;
    }

    setItems(items: Tariff[]) {
        this.items = items;
        this.status = 'success';
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }

    addItem(tariff: Tariff) {
        this.items.push(tariff);
    }
}

export const tariffStore = new TariffStore();