import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { ConfigType } from '@nestjs/config';
import config from '@src/config/config';

import { AuthController } from '@src/auth/controllers/auth.controller';
import { AuthService } from '@src/auth/services/auth.service';

import { LocalStrategy } from '@src/auth/strategies/local.strategy';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';

import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.server.jwtSecret,
          signOptions: { expiresIn: '4h' },
        };
      },
      inject: [config.KEY],
    }),
    PassportModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
