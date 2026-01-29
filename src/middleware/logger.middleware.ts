import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`'Show Request: '  ${req.header.name}`);
    if (!req) {
      return res.status(403).send({
        status: HttpStatus.FORBIDDEN,
        message: "You can't make this request!",
      });
    }
    next();
  }
}
