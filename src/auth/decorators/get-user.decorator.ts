import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { User } from '../../user/entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

/**
 * Decorador personalizado para extraer el usuario del request
 * Uso: @GetUser() user: User
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
