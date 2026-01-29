import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const Response = ctx.getResponse<Response>();
    const Request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    return Response.status(status).json({
      status: status,
      timeStamp: new Date(),
      path: Request.path,
      text: 'This my custom message through the filter',
    });
  }
}
