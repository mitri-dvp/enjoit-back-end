import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import {
  UserCreateInputSchema,
  UserUpdateInputSchema,
} from 'src/users/schemas/user.schema';

export class CreateUserDto extends createZodDto(UserCreateInputSchema) {}

export class UpdateUserDto extends createZodDto(UserUpdateInputSchema) {}
