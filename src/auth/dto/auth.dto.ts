import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { UserModel } from 'prisma/zod/';

import {
  UserCreateInputSchema,
  UserResponseSchema,
} from '@src/users/schemas/user.schema';

export const emailSchema = z.string().min(1).email();

const LoginSchema = UserModel.pick({
  birthCountry: true,
  email: true,
  password: true,
});
export class LoginDto extends createZodDto(LoginSchema) {}

const SignupSchema = UserCreateInputSchema;
export class SignupDto extends createZodDto(SignupSchema) {}

const GuestSchema = z.object({
  deviceId: z.string(),
});
export class GuestDto extends createZodDto(GuestSchema) {}

const AuthReponseSchema = z.object({
  accessToken: z.string(),
  user: UserResponseSchema,
});
export const AuthReponseDto = createZodDto(AuthReponseSchema);

const GetFPConfirmationCodeSchema = z.object({ identifier: z.string() });
export class GetFPConfirmationCodeDto extends createZodDto(
  GetFPConfirmationCodeSchema,
) {}

const ValidateFPConfirmationCodeSchema = z.object({
  confirmationCode: z.string(),
  identifier: z.string(),
});
export class ValidateFPConfirmationCodeDto extends createZodDto(
  ValidateFPConfirmationCodeSchema,
) {}

const ChangePasswordSchema = z
  .object({
    newPassword: z.string(),
  })
  .merge(ValidateFPConfirmationCodeSchema);
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}
