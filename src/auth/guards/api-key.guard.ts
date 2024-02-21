import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ConfigService } from '@nestjs/config';
import { Config } from '@src/config/validation';

import { Request } from 'express';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from '@src/auth/decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService<Config>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const authHeader = request.header('Auth');
    const isAuth = authHeader === this.configService.getOrThrow('API_KEY');
    if (!isAuth) {
      throw new UnauthorizedException('Not Allowed');
    }
    return isAuth;
  }
}
