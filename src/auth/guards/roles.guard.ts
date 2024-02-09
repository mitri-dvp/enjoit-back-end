import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '@src/auth/decorators/roles.decorator';
import { Role } from '@src/auth/models/roles.model';
import { JwtPayload } from '@src/auth/models/token.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: Role[] = this.reflector.get(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as JwtPayload;

    // const isAuth = roles.some((role) => role === user.role);
    const isAuth = false;

    if (!isAuth) {
      throw new ForbiddenException();
    }

    return true;
  }
}
