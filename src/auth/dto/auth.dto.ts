import { createZodDto } from 'nestjs-zod';
import { UserModel } from 'prisma/zod/';

import { UserCreateInputSchema } from '@src/users/schemas/user.schema';

const LoginSchema = UserModel.pick({ email: true, password: true });

const SignupSchema = UserCreateInputSchema;

export class LoginDto extends createZodDto(LoginSchema) {}

export class SignupDto extends createZodDto(SignupSchema) {}
