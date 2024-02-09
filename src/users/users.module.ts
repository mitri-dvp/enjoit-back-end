import { Module } from '@nestjs/common';
import { UsersService } from '@src/users/users.service';
import { UsersController } from '@src/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
