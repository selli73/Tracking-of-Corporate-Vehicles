import type { Role } from "../auth";

export interface Employee {
    id: string;
    email: string;
    name: string;
    surname: string;
    role: Role;
    dismissed: boolean;
    driverLicenseNumber: string | null;
    driverLicenseExpiresAt: string | null;
    createdAt: string;
}

export interface CreateEmployeeDto {
    email: string;
    password: string;
    name: string;
    surname: string;
    driverLicenseNumber?: string;
    driverLicenseExpiresAt?: string;
}