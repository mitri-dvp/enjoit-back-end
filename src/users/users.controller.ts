import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '@src/auth/decorators/roles.decorator';
import { Role } from '@src/auth/models/roles.model';

import { ZodSerializerDto } from 'nestjs-zod';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@src/auth/guards/roles.guard';

import { UsersService } from '@src/users/users.service';
import {
  UserCreateDto,
  UserResponseDto,
  UserUpdateDto,
} from '@src/users/dto/user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  create(@Body() dto: UserCreateDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ZodSerializerDto(UserResponseDto)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
