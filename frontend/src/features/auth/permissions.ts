import type { Role } from "@/features/auth";


type Section = 'vehicles' | 'vehiclesManage' | 'bookings' | 'users' | 'tariffs';

const ALL: Role[] = ['OWNER', 'COMPANY_ADMIN', 'MANAGER', 'DRIVER'];

export const ACCESS = {
    vehicles: ALL,
    vehiclesManage: ['OWNER', 'COMPANY_ADMIN'],
    bookings: ALL,
    bookingsCreate: ['OWNER', 'COMPANY_ADMIN', 'MANAGER'],
    bookingsManage: ['OWNER', 'COMPANY_ADMIN', 'MANAGER'],
    users: ['OWNER', 'COMPANY_ADMIN', 'MANAGER'],
    tariffs: ['OWNER', 'COMPANY_ADMIN'],
    map: ['OWNER', 'COMPANY_ADMIN', 'MANAGER'],
    geofencesManage: ['OWNER', 'COMPANY_ADMIN'],
    invoices: ['OWNER', 'COMPANY_ADMIN', 'MANAGER', 'DRIVER'],
    invoicesPay: ['OWNER', 'COMPANY_ADMIN', 'MANAGER', 'DRIVER'],
} satisfies Record<string, readonly Role[]>;

export type CreatableRole = Exclude<Role, 'OWNER'>;

export const CREATABLE_ROLES: Record<Role, readonly CreatableRole[]> = {
    OWNER: ['COMPANY_ADMIN', 'MANAGER', 'DRIVER'],
    COMPANY_ADMIN: ['MANAGER', 'DRIVER'],
    MANAGER: ['DRIVER'],
    DRIVER: [],
};