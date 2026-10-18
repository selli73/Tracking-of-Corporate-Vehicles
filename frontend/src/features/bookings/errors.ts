import { isApiError } from "@/shared/api/ApiError"
import { getErrorMessage } from "@/shared/api/getErrorMessage";

const BOOKING_ERROR_TEXT: Record<string, string> = {
    BOOKING_OVERLAP: 'Машина уже забронирована на это время. Выберите другое время или другую машину',
    START_IN_PAST: 'Начало брони не может быть в прошлом',
    INTERVAL_INVALID: 'Окончание брони должно быть позже начала',
    BOOKING_NOT_FOUND: 'Бронь не найдена',
    BOOKING_NOT_STARTED: 'Поездку нельзя начать: бронь уже не в статусе ожидания или время ещё не наступило',
    BOOKING_NOT_COMPLETE: 'Поездку нельзя завершить: она не активна',
    BOOKING_PERIOD_EXPIRED: 'Поездку нельзя начать: срок брони уже истёк',
    CANNOT_BE_CANCELED: 'Бронь нельзя отменить: поездка уже началась или завершена'
}

export const getBookingErrorMessage = (error: unknown, fallback = 'Не удалось выполнить действие') => {
    if (isApiError(error) && BOOKING_ERROR_TEXT[error.code]) {
        return BOOKING_ERROR_TEXT[error.code];
    }
    return getErrorMessage(error, fallback);
}