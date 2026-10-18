import { isApiError } from "./ApiError"

export const getErrorMessage = (error: unknown, fallback = '') => {
    if (!isApiError(error)) return fallback;

    switch (error.code) {
        case 'NETWORK_ERROR':
        case 'TIMEOUT':
        case 'SERVICE_UNAVAILABLE':
            return 'Сервер недоступен. Попробуйте позже'
        default:
            return error.message || fallback;
    }
}