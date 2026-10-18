import { http } from "@/shared/api/http";
import type { CreateEmployeeDto, Employee } from "./types";
import type { CreatableRole } from "../auth";

const CREATE_PATH: Record<CreatableRole, string> = {
    COMPANY_ADMIN: '/user/register-admin',
    MANAGER: '/user/register-manager',
    DRIVER: '/user/register-driver'
}

export const usersApi = {
    getAll: () => http.get<Employee[]>('/user/get-all-users').then((res) => res.data),
    create: (role: CreatableRole, dto: CreateEmployeeDto) => 
        http.post<Employee>(CREATE_PATH[role], dto).then((res) => res.data),
}