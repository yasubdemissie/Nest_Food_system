import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, throwError, timeout } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // const resonse = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getResponse<Request>();

    console.log(request.originalUrl);

    return next.handle().pipe(
      timeout(10000),
      catchError(() => {
        return throwError(() => new RequestTimeoutException());
      }),
    );
  }
}
