import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Response = ctx.switchToHttp().getResponse();
    return request.locals.user; // eslint-disable-line
  },
);
