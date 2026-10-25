import type { MantineColor } from "@mantine/core";

export type BookingStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELED' | 'DEBT' | 'EXPIRED';

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
    PENDING: 'Ожидает',
    ACTIVE: 'В поездке',
    COMPLETED: 'Завершена',
    CANCELED: 'Отменена',
    DEBT: 'Поездка не оплачена',
    EXPIRED: 'Не состоялась'
};

export const BOOKING_STATUS_COLOR: Record<BookingStatus, MantineColor> = {
  PENDING: 'blue',
  ACTIVE: 'green',
  COMPLETED: 'gray',
  CANCELED: 'gray',
  DEBT: 'red',
  EXPIRED: 'orange',
};

export interface Booking {
    id: string;
    recorderId: string;
    driverId: string;
    driverEmail: string;
    vehicleId: string;
    companyId: string;
    status: BookingStatus;
    startDate: string;
    endDate: string;
    finishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleInfo {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
}

export interface DriverInfo {
    id: string;
    name: string;
    surname: string;
}

export interface CreateBookingDto {
    vehicleId: string;
    driverId: string;
    startDate: string;
    endDate: string;
}