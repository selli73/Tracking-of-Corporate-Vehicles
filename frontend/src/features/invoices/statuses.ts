import type { MantineColor } from '@mantine/core';
import type { InvoiceStatus } from './types';

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  PENDING: 'Ожидает оплаты',
  PAID: 'Оплачен',
  FAILED: 'Не оплачен',
  REFUNDED: 'Возвращён',
};

export const INVOICE_STATUS_COLOR: Record<InvoiceStatus, MantineColor> = {
  PENDING: 'yellow',
  PAID: 'green',
  FAILED: 'red',
  REFUNDED: 'gray',
};