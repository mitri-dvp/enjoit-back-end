import { Request } from 'express';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseZodGuard } from 'nestjs-zod';

import { User } from '@prisma/client';

import { LoginDto, SignupDto } from '@src/auth/dto/auth.dto';
import { AuthService } from '@src/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @UseZodGuard('body', LoginDto)
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @Post('signup')
  @UseZodGuard('body', SignupDto)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() req: Request) {
    return req.user;
  }
}
