import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';
import { Config } from '@src/config/validation';

import { AuthController } from '@src/auth/controllers/auth.controller';
import { AuthService } from '@src/auth/services/auth.service';

import { LocalStrategy } from '@src/auth/strategies/local.strategy';
import { JwtStrategy } from '@src/auth/strategies/jwt.strategy';

import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Config>) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: { expiresIn: '4h' },
        };
      },
      inject: [ConfigService],
    }),
    PassportModule,
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
