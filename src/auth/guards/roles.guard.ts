import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '@src/auth/decorators/roles.decorator';
import { Role } from '@src/auth/models/roles.model';
import { JwtUserPayload } from '@src/auth/models/token.model';
import { ZodHttpException } from '@src/handler/exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: Role[] = this.reflector.get(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as JwtUserPayload;

    const isAuth = roles.some((role) => user.role === role);

    if (!isAuth) {
      throw new ZodHttpException('FORBIDDEN', [
        {
          code: 'invalid_role',
          path: ['role'],
          message: 'Forbidden',
        },
      ]);
    }

    return true;
  }
}
