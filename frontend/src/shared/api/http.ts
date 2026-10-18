import axios from "axios"
import { tokenStorage } from "./token";
import { ApiError } from "./ApiError";

interface ErrorBody {
  code?: string;
  message?: string | string[];
}

type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
    onUnauthorized = handler;
}

export const http = axios.create({
    timeout: 10000,
    baseURL: '/api'
});

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
    (error: unknown) => { 
        const apiError = toApiError(error);

        if (apiError.status === 401) {
            onUnauthorized?.();
        }

        return Promise.reject(apiError);
    }
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

    const code = data?.code ?? (status >= 500 ? 'SERVICE_UNAVAILABLE' : `HTTP_${status}`);

    return new ApiError(code, message, status);
}