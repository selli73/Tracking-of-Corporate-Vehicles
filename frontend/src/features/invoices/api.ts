import { http } from "@/shared/api/http";
import type { Invoice } from "./types";

export const invoicesApi = {
    getAll: () => http.get<Invoice[]>('/billing/getInvoices').then((res) => res.data),
    pay: (id: string) => http.patch<Invoice>(`/billing/${id}/pay`).then((res) => res.data),
}