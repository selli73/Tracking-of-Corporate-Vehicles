import type { InvoiceStatus } from "./types";

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
    PENDING: 'Ожидает оплаты',
    PAID: 'Оплачен',
    FAILED: 'Не оплачен',
    REFUNDED: 'Возвращено'
};