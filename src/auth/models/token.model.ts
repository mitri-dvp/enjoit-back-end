export interface JwtUserPayload {
  sub: number;
}

export interface JwtResetPasswordPayload {
  confirmationCode: string;
}

export interface JwtPayload {
  iat: number;
  exp: number;
}
