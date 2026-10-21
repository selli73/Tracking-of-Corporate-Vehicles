import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {

  private _logger = new Logger(CorrelationIdInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Берем ID из заголовка (если фронтенд прислал) или генерируем новый
    const correlationId = request.headers['x-correlation-id'] || randomUUID();
    request.headers['x-correlation-id'] = correlationId;

    // Приклеиваем его прямо к body, чтобы он автоматически улетал в RabbitMQ payload
    if (request.body && typeof request.body === 'object') {
      request.body.correlationId = correlationId;
    }

    this._logger.log(`🔍 [Trace: ${correlationId}] Входящий запрос: ${request.method} ${request.url}`);
    return next.handle();
  }
}
