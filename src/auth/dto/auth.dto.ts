import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

export class LoginDto extends createZodDto(LoginSchema) {}

export class SignupDto extends createZodDto(LoginSchema) {}
