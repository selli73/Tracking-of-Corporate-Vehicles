import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch() // так как в скобке пусто, значит ловим все исключения. 
export class AllExceptionsFilter implements ExceptionFilter {
    
    private _logger = new Logger(AllExceptionsFilter.name);
    
    catch(exception: any, host: ArgumentsHost) {            
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();      
        
        const { status, code, message } = this.resolve(exception);
        
        if (status === undefined || status >= 500 ) {
            this._logger.error(`${request.method} ${request.url}`, exception as any);
        }

        response.status(status ?? 500).json({
            statusCode: status,
            code,
            path: request.url,
            message
        });
    }

    private resolve(exception: unknown) {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const body: any = exception.getResponse();

            return {
                status,
                code: status === 400 ? 'VALIDATION_ERROR' : 'HTTP_ERROR',
                message: Array.isArray(body?.message) ? body.message : undefined
            };
        }

        if (this.isRpcError(exception)) {            
            return {
                status: undefined,
                code: exception.code,
                message: exception.message
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            code: 'INTERNAL_ERROR',
            message: 'Внутренняя ошибка сервера',
        }
    }

    private isRpcError(error: unknown) {
        return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
    }
}