import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from '@src/users/users.service';
import {
  UserCreateDto,
  UserResponseDto,
  UserUpdateDto,
} from '@src/users/dto/user.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ZodSerializerDto(UserResponseDto)
  create(@Body() dto: UserCreateDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ZodSerializerDto(UserResponseDto)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ZodSerializerDto(UserResponseDto)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ZodSerializerDto(UserResponseDto)
  update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ZodSerializerDto(UserResponseDto)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
