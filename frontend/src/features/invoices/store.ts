import type { LoadStatus } from "@/shared/lib/loadStatus";
import type { Invoice } from "./types";
import { makeAutoObservable } from "mobx";
import { invoicesApi } from "./api";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

class InvoiceStore {
    items: Invoice[] = [];
    status: LoadStatus = 'idle';
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;
        try {
            const items = await invoicesApi.getAll();
            this.setItems(items);
        } catch(error) {
            this.setError(getErrorMessage(error));
        }
    }

    async pay(id: string) {
        const updated = await invoicesApi.pay(id);
        this.replaceItem(updated);
        return updated;
    }

    reset() {
        this.items = [];
        this.status = 'idle';
        this.error = null;
    }

    setItems(items: Invoice[]) {
        this.items = items;
        this.status = 'success';
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }

    replaceItem(updated: Invoice) {
        this.items = this.items.map((item) => (item.id === updated.id ? updated : item));
    }
}

export const invoicesStore = new InvoiceStore();