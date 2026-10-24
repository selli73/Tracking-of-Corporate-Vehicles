export type InvoiceStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Invoice {
    id: string;
    bookingId: string;
    companyId: string;
    driverId: string;
    vehicleId: string;
    durationMinutes: number;
    distanceKm: string;            
    minuteRate: string;
    kmRate: string;
    amount: string;
    status: InvoiceStatus;
    paidAt: string | null;
    createdAt: string;
}