import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseZodGuard, ZodSerializerDto } from 'nestjs-zod';

import {
  LoginDto,
  SignupDto,
  GetFPConfirmationCodeDto,
  AuthReponseDto,
  validateFPConfirmationCodeDto,
  ChangePasswordDto,
} from '@src/auth/dto/auth.dto';
import { AuthService } from '@src/auth/services/auth.service';

import { User } from '@src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @UseZodGuard('body', LoginDto)
  @ZodSerializerDto(AuthReponseDto)
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('signup')
  @UseZodGuard('body', SignupDto)
  @ZodSerializerDto(AuthReponseDto)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('forgot-password/confirm-code')
  async getForgotPasswordConfirmationCode(
    @Query() params: GetFPConfirmationCodeDto,
  ) {
    return this.authService.getForgotPasswordConfirmationCode(params);
  }

  @Post('forgot-password/confirm-code')
  @HttpCode(200)
  async validateForgotPasswordConfirmationCode(
    @Body() dto: validateFPConfirmationCodeDto,
  ) {
    return this.authService.validateForgotPasswordConfirmationCode(dto);
  }
  @Post('change-password')
  @HttpCode(200)
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ZodSerializerDto(AuthReponseDto)
  async me(@Req() req: Request) {
    return req.user;
  }
}
