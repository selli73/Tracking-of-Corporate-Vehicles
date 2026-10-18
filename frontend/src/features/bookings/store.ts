import type { LoadStatus } from "@/shared/lib/loadStatus";
import type { Booking, CreateBookingDto } from "./types";
import { makeAutoObservable } from "mobx";
import { bookingsApi } from "./api";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

class BookingStore {
    items: Booking[] = [];
    status: LoadStatus = 'idle';
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async load() {
        this.status = 'loading';
        this.error = null;

        try {
            this.setItems(await bookingsApi.getAll());
        } catch(error) {
            this.setError(getErrorMessage(error, 'Не удалось загрузить брони'));
        }
    }

    async create(dto: CreateBookingDto) {
        const booking = await bookingsApi.create(dto);
        this.addItem(booking);
        return booking;
    }

    async start(id: string) {
        const updated = await bookingsApi.start(id);
        this.replaceItem(updated);
    }

    async finish(id: string) {
        const updated = await bookingsApi.finish(id);
        this.replaceItem(updated);
    }

    async cancel(id: string) {
        const updated = await bookingsApi.cancel(id);
        this.replaceItem(updated);
    }

    setItems(items: Booking[]) {
        this.items = items;
        this.status = 'success';
    }

    addItem(booking: Booking) {
        this.items.push(booking);
    }

    replaceItem(updated: Booking) {
        const index = this.items.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
            this.items[index] = updated;
        }
    }

    setError(message: string) {
        this.error = message;
        this.status = 'error';
    }
}

export const bookingStore = new BookingStore();