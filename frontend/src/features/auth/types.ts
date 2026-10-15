export type Role = 'OWNER' | 'COMPANY_ADMIN' | 'MANAGER' | 'DRIVER';

export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    surname: string;
    role: Role;
    dismissed: boolean;
    driverLicenseNumber: string | null;
    driverLicenseExpiresAt: Date | null;
    companyId: string;
    createdAt: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string
}