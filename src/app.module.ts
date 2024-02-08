import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { ConfigModule } from '@nestjs/config';
import { enviorments } from './config/enviorments';
import { validate } from './config/validation';
import config from './config/config';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviorments[process.env.NODE_ENV] || '.env',
      load: [config],
      validate: validate,
    }),
    UsersModule,
  ],
})
export class AppModule {}
