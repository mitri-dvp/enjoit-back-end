import { Injectable } from '@nestjs/common';
import {
  JsonWebTokenError,
  JwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

import {
  JwtResetPasswordPayload,
  JwtUserPayload,
} from '@src/auth/models/token.model';

import {
  SignupDto,
  GetFPConfirmationCodeDto,
  validateFPConfirmationCodeDto,
  ChangePasswordDto,
} from '@src/auth/dto/auth.dto';

import { UsersService } from '@src/users/users.service';
import { User } from '@src/users/schemas/user.schema';
import { ZodHttpException } from '@src/handler/exception';
import { HttpResponse } from '@src/handler/http';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new ZodHttpException('UNAUTHORIZED', [
        {
          code: 'invalid_credentials',
          path: [],
          message: 'Invalid credentials',
        },
      ]);

    return user;
  }

  async generateJWT(user: User) {
    const payload: JwtUserPayload = { sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }

  async login(user: User) {
    const jwtPayload: JwtUserPayload = { sub: user.id };

    return {
      accessToken: this.jwtService.sign(jwtPayload),
      user: user,
    };
  }

  async signup(payload: SignupDto) {
    const newUser = await this.usersService.create(payload);

    const jwtPayload: JwtUserPayload = { sub: newUser.id };

    return {
      accessToken: this.jwtService.sign(jwtPayload),
      user: newUser,
    };
  }

  async getForgotPasswordConfirmationCode(params: GetFPConfirmationCodeDto) {
    const { identifier } = params;

    const user = await this.usersService.findByIdentifier(identifier);

    const confirmationCode = String(crypto.randomInt(10 ** 5, 10 ** 6 - 1));
    const payload: JwtResetPasswordPayload = {
      confirmationCode: confirmationCode,
    };

    const resetPasswordToken = this.jwtService.sign(payload);

    // TO-DO #1 send resetPasswordToken to identifier (phone | email)
    this.usersService.update(user.id, {
      resetPasswordToken: resetPasswordToken,
    });

    return {
      confirmationCode: confirmationCode,
    };
  }

  async validateForgotPasswordConfirmationCode(
    payload: validateFPConfirmationCodeDto,
  ) {
    const { confirmationCode, identifier } = payload;

    const user = await this.usersService.findByIdentifier(identifier);

    if (!user) {
      throw new ZodHttpException('NOT_FOUND', [
        {
          code: 'not_found',
          path: ['identifier'],
          message: 'User not found',
        },
      ]);
    }

    if (!user.resetPasswordToken) {
      throw new ZodHttpException('BAD_REQUEST', [
        {
          code: 'invalid_string',
          path: ['reset_password_token'],
          message: 'Invalid reset password token',
          validation: 'regex',
        },
      ]);
    }

    try {
      this.jwtService.verify(user.resetPasswordToken);
    } catch (err) {
      const error = err as
        | TokenExpiredError
        | NotBeforeError
        | JsonWebTokenError;

      if (error.name === 'TokenExpiredError') {
        throw new ZodHttpException('BAD_REQUEST', [
          {
            code: 'token_expired',
            path: ['reset_password_token'],
            message: 'Token expired',
          },
        ]);
      }

      throw new ZodHttpException('BAD_REQUEST', [
        {
          code: 'custom',
          path: [],
          message: 'Token error',
        },
      ]);
    }

    const token = this.jwtService.decode<JwtResetPasswordPayload>(
      user.resetPasswordToken,
    );

    if (token.confirmationCode !== confirmationCode) {
      throw new ZodHttpException('BAD_REQUEST', [
        {
          code: 'invalid_string',
          path: ['confirmation_code'],
          message: 'Invalid confirmation code',
          validation: 'regex',
        },
      ]);
    }

    return new HttpResponse('OK', 'Valid confirmation code');
  }

  async changePassword(payload: ChangePasswordDto) {
    const { identifier, newPassword } = payload;
    const isValid = await this.validateForgotPasswordConfirmationCode(payload);

    const user = await this.usersService.findByIdentifier(identifier);

    if (!user) {
      throw new ZodHttpException('NOT_FOUND', [
        {
          code: 'not_found',
          path: ['identifier'],
          message: 'User not found',
        },
      ]);
    }

    if (isValid.statusCode !== 200) {
      throw new ZodHttpException('BAD_REQUEST', [
        {
          code: 'custom',
          path: [],
          message: 'Invalid request',
        },
      ]);
    }

    this.usersService.update(user.id, {
      password: newPassword,
      resetPasswordToken: null,
    });

    return new HttpResponse('OK', 'Password changed');
  }
}
