import { http } from "@/shared/api/http";
import type { Booking, CreateBookingDto } from "./types";

export const bookingsApi = {
    getAll: () => http.get<Booking[]>('/booking').then((res) => res.data),
    create: (dto: CreateBookingDto) => http.post<{ success: boolean, booking: Booking }>('/booking', dto)
        .then((res) => res.data.booking),
    start: (id: string) => http.patch<Booking>(`/booking/${id}/start`).then((res) => res.data),
    finish: (id: string) => http.patch<Booking>(`/booking/${id}/finish`).then((res) => res.data),
    cancel: (id: string) => http.patch<Booking>(`/booking/${id}/cancel`).then((res) => res.data),
}