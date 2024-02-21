import { Role } from './roles.model';

export interface JwtUserPayload {
  sub: number;
  role: Role | null;
}

export interface JwtResetPasswordPayload {
  confirmationCode: string;
}

export interface JwtPayload {
  iat: number;
  exp: number;
}
