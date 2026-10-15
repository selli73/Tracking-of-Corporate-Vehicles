export class ApiError extends Error {
    
    readonly code: string;
    readonly status: number | null;

    constructor(code: string, message: string, status: number | null = null) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
    }
}

export const isApiError = (error: unknown) => error instanceof ApiError;