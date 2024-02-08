import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { UserCreateInputSchema, UserUpdateInputSchema } from 'prisma/zod';

const CreateUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

export class CreateUserDto extends createZodDto(UserCreateInputSchema) {}

export class UpdateUserDto extends createZodDto(UserUpdateInputSchema) {}
