import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';
import * as httpContext from 'express-http-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  //prettier-ignore
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = req.headers['x-request-id'] ? String(req.headers['x-request-id']) : uuidv4();
    const sessionId = req.headers['x-session-id'] ? String(req.headers['x-session-id']) : 'N/A';
    httpContext.set('requestId', requestId);
    httpContext.set('sessionId', sessionId);
    next();
  }
}
