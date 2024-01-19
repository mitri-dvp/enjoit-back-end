import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayloadToken } from '../auth/models/token.model';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/roles.model';

import { ProfileService } from './profile.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Roles(Role.CUSTOMER)
  @Get('my-orders')
  findMyOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this.profileService.findMyOrders(user.sub);
  }
}
