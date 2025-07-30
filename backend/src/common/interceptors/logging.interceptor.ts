import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip || request.connection.remoteAddress;

    const now = Date.now();
    
    // Log incoming request
    this.logger.log(
      `📥 ${method} ${url} - ${ip} - ${userAgent}`,
    );

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      if (Object.keys(body || {}).length > 0) {
        this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
      }
      if (Object.keys(query || {}).length > 0) {
        this.logger.debug(`Query Params: ${JSON.stringify(query)}`);
      }
      if (Object.keys(params || {}).length > 0) {
        this.logger.debug(`Route Params: ${JSON.stringify(params)}`);
      }
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `📤 ${method} ${url} - ${responseTime}ms - Success`,
          );
          
          // Log response in development (truncated)
          if (process.env.NODE_ENV === 'development' && data) {
            const responsePreview = JSON.stringify(data).substring(0, 200);
            this.logger.debug(`Response Preview: ${responsePreview}${JSON.stringify(data).length > 200 ? '...' : ''}`);
          }
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `❌ ${method} ${url} - ${responseTime}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}