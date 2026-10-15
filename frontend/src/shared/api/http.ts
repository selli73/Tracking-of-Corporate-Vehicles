import axios from "axios"
import { tokenStorage } from "./token";
import { ApiError } from "./ApiError";

export const http = axios.create({
    timeout: 10000,
    baseURL: '/api'
});

interface ErrorBody {
  code?: string;
  message?: string | string[];
}

// перед каждым запросом: добавляет токен
http.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// после каждого ответа с ошибкой превратить ее в ApiError
http.interceptors.response.use(
    (response) => response, 
    (error: unknown) => Promise.reject(toApiError(error))
);

const toApiError = (error: unknown): ApiError => {
    if (!axios.isAxiosError<ErrorBody>(error)) {
        return new ApiError('UNKNOWN_ERROR', 'Неизвестная ошибка');
    }

    if (!error.response) {
        const code = error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK_ERROR';

        return new ApiError(code, 'Нет связи с сервером');
    }

    const { status, data } = error.response;

    const message = Array.isArray(data?.message) 
        ? data.message.join(', ')
        : (data?.message ?? 'Ошибка сервера');

    const code = data?.code ?? (status >= 502 ? 'SERVICE_UNAVAILABLE' : `HTTP_${status}`);

    return new ApiError(code, message, status);
}

