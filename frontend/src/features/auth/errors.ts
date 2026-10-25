import { isApiError } from "@/shared/api/ApiError";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

const REGISTER_ERROR_TEXT: Record<string, string> = {
  COMPANY_OR_OWNER_ALREADY_EXISTS:
    'Компания с таким ИНН, названием компании или пользователь с такой почтой уже зарегистрированы',
};

export function getRegisterErrorMessage(error: unknown, fallback?: string): string {
  if (isApiError(error) && REGISTER_ERROR_TEXT[error.code]) {
    return REGISTER_ERROR_TEXT[error.code];
  }
  return getErrorMessage(error, fallback);
}