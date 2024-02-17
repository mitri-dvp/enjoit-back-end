import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { ConfigModule } from '@nestjs/config';
import { enviorments } from '@src/config/enviorments';
import { validate } from '@src/config/validation';
import config from '@src/config/config';

import { PrismaModule } from '@src/prisma/prisma.module';

import { AuthModule } from '@src/auth/auth.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviorments[process.env.NODE_ENV || '.env'] || '.env',
      load: [config],
      validate: validate,
    }),
    UsersModule,
  ],
})
export class AppModule {}
