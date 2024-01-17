import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthsModule {}
