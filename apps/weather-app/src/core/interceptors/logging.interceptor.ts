import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from '../utils/CustomLogger';
import { Request, Response } from 'express';
const logger = new CustomLogger('HTTP');

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const timeTaken = Date.now() - startTime;
        logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${timeTaken}ms`); //prettier-ignore
      }),
    );
  }
}
