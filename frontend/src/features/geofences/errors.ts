import { isApiError } from "@/shared/api/ApiError";
import { getErrorMessage } from "@/shared/api/getErrorMessage";

const GEOFENCE_ERROR_TEXT: Record<string, string> = {
    GEOFENCE_UNIQUENESS_VIOLATION: 'Для этой компании с таким названием геозона создана',
    POLYGON_INVALID: 'Неправильный формат геозоны. Ставьте точки по порядку, обходя область по краю',
};

export const getGeofenceErrorMessage = (error: unknown): string => {
    if (isApiError(error) && GEOFENCE_ERROR_TEXT[error.code]) {
        return GEOFENCE_ERROR_TEXT[error.code];
    }
    
    return getErrorMessage(error, 'Не удалось сохранить геозону');
}