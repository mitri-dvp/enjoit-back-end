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
  ValidateFPConfirmationCodeDto,
  ChangePasswordDto,
  GuestDto,
  SocialDto,
} from '@src/auth/dto/auth.dto';
import { AuthService } from '@src/auth/services/auth.service';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { JwtUserPayload } from '@src/auth/models/token.model';

import { User } from '@src/users/schemas/user.schema';
import { UserResponseDto } from '@src/users/dto/user.dto';

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

  @Post('guest')
  @UseZodGuard('body', GuestDto)
  @ZodSerializerDto(AuthReponseDto)
  async loginAsGuest(@Body() dto: GuestDto) {
    return this.authService.loginAsGuest(dto);
  }

  @Post('login-social')
  @UseZodGuard('body', SocialDto)
  @ZodSerializerDto(AuthReponseDto)
  async loginSocial(@Body() dto: SocialDto) {
    return this.authService.loginSocial(dto);
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
    @Body() dto: ValidateFPConfirmationCodeDto,
  ) {
    return this.authService.validateForgotPasswordConfirmationCode(dto);
  }
  @Post('change-password')
  @HttpCode(200)
  async changePassword(@Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ZodSerializerDto(UserResponseDto)
  async me(@Req() req: Request) {
    return this.authService.me(req.user as JwtUserPayload);
  }
}
