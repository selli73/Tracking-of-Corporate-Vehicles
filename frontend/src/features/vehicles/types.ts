export type VehicleStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    vin: string;
    licensePlate: string;
    companyId: string;
    tariffId: string | null;
    status: VehicleStatus;
    currentBookingId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateVehicleDto {
  brand: string;
  model: string;
  vin: string;
  licensePlate: string;
  tariffId?: string;
}

export interface UpdateStatusVehicle {
    status: VehicleStatus;
}

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
    ACTIVE: 'Доступна',
    MAINTENANCE: 'На обслуживании',
    DECOMMISSIONED: 'Списана'
};

export interface TariffOption {
    id: string;
    name: string;
    isActive: boolean;
}

export interface ResponseLinkTariffToVehicle {
    message: string;
    data: {
        brand: string;
        licensePlate: string;
        tariff: {
            name: string;
            minuteRate: string;
            kmRate: string;
        } | null;
    };
}