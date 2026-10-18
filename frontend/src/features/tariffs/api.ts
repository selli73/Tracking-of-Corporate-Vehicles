import { http } from "@/shared/api/http";
import type { CreateTariffDto, Tariff } from "./types";

export const tariffsApi = {
    getAll: () => http.get<Tariff[]>('/tariff/get-company-rates').then((res) => res.data),
    create: (dto: CreateTariffDto) => http.post<Tariff>('/tariff/create', dto).then((res) => res.data),
}