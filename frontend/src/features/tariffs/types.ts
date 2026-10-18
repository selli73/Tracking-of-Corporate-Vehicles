export interface Tariff {
    id: string;
    name: string;
    minuteRate: string;    
    kmRate: string;
    dayRate: string | null;
    isActive: boolean;
}

export interface CreateTariffDto {
    name: string;
    minuteRate: string;
    kmRate: string;
    dayRate?: string | undefined;
}