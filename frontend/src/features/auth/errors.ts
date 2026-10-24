import { isApiError } from "@/shared/api/ApiError";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

const REGISTER_ERROR_TEXT: Record<string, string> = {
  COMPANY_OR_OWNER_ALREADY_EXISTS: 'Пользователь или компания с такими данными существует',
};

export function getRegisterErrorMessage(error: unknown, fallback?: string): string {
  if (isApiError(error) && REGISTER_ERROR_TEXT[error.code]) {
    return REGISTER_ERROR_TEXT[error.code];
  }
  return getErrorMessage(error, fallback);
}