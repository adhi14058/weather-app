import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../utils/CustomLogger';
import * as httpContext from 'express-http-context';
import { GqlContextType } from '@nestjs/graphql';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private logger = new CustomLogger(CustomExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    if (host.getType<GqlContextType>() === 'graphql') {
      return exception;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorDetails = exception.getResponse();
      const err = typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails); //prettier-ignore
      this.logger.error(
        `${request?.method} ${request?.originalUrl} ${status} error: ${exception.message}: Details: ${err}`,
      );
      return response.status(status).json({
        statusCode: status,
        errorDetails,
        requestId: httpContext.get('requestId') as string,
      });
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(
        `${request?.method} ${request?.originalUrl} ${status} error: ${exception.message}`,
      );
      return response.status(status).json({
        statusCode: status,
        requestId: httpContext.get('requestId') as string,
        errorDetails: {
          message: 'Something went wrong, please try again later',
        },
      });
    }
  }
}
