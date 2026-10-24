import { isApiError } from "@/shared/api/ApiError";
import { getErrorMessage } from "@/shared/api/getErrorMessage";


const INVOICE_ERROR_TEXT: Record<string, string> = {
  INVOICE_NOT_FOUND: 'Счёт не найден',
  INVOICE_ALREADY_PAID: 'Счёт уже оплачен. Обновите страницу',
};

export function getInvoiceErrorMessage(error: unknown, fallback?: string): string {
  if (isApiError(error) && INVOICE_ERROR_TEXT[error.code]) {
    return INVOICE_ERROR_TEXT[error.code];
  }
  return getErrorMessage(error, fallback);
}