import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestResponseFromContext } from '../utils';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const { req } = getRequestResponseFromContext(context);

    return req.user;
  },
);
