import { isRpcErrorPayload } from '@app/contracts';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ERROR_STATUS, isKnownErrorCode } from './error-status';

@Catch() // так как в скобке пусто, значит ловим все исключения.
export class AllExceptionsFilter implements ExceptionFilter {
  private _logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    const { status, code, message } = this.resolve(exception);

    if (status >= 500) {
      this._logger.error(`${request.method} ${request.url}`, exception as any);
    }

    response.status(status).json({
      statusCode: status,
      code,
      path: request.url,
      message,
    });
  }

  private resolve(exception: unknown) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body: any = exception.getResponse();

      const codes: Record<number, string> = {
        400: 'VALIDATION_ERROR',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
      };


      return {
        status,
        code: codes[status] ?? 'HTTP_ERROR',
        message: typeof body === 'string' ? body : (body?.message ?? exception.message),
      };
    }

    if (isRpcErrorPayload(exception) && isKnownErrorCode(exception.code)) {
      return {
        status: ERROR_STATUS[exception.code],
        code: exception.code,
        message: exception.message,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Внутренняя ошибка сервера',
    };
  }
}
