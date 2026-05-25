import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user?: {
    rol: string;
  };
}

/**
 * Guard para verificar roles de usuario
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    return requiredRoles.some((role) => user.rol === role);
  }
}
