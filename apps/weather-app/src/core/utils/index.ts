/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

export const getRequestResponseFromContext = (context: ExecutionContext) => {
  const isGraphQL = context.getType<GqlContextType>() === 'graphql';

  const req: Request = isGraphQL
    ? (GqlExecutionContext.create(context).getContext().request as Request)
    : context.switchToHttp().getRequest();
  const res: Response = isGraphQL
    ? (GqlExecutionContext.create(context).getContext().response as Response)
    : context.switchToHttp().getResponse();

  return { req, res };
};
