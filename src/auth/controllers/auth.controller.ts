import { Request } from 'express';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseZodGuard } from 'nestjs-zod';

import { LoginDto, SignupDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

import { User } from '@prisma/client';

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
