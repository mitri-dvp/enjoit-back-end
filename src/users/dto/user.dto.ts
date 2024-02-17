import { createZodDto } from 'nestjs-zod';
import {
  UserCreateInputSchema,
  UserUpdateInputSchema,
  UserResponseSchema,
  FindByPhoneSchema,
} from '@src/users/schemas/user.schema';

export class UserCreateDto extends createZodDto(UserCreateInputSchema) {}

export class UserUpdateDto extends createZodDto(UserUpdateInputSchema) {}

export class UserResponseDto extends createZodDto(UserResponseSchema) {}

export class FindByPhoneDto extends createZodDto(FindByPhoneSchema) {}
