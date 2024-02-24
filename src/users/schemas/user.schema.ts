import { z } from 'nestjs-zod/z';
import { UserModel } from 'prisma/zod/';

// Should be the same as: import { User } from '@prisma/client';
export type User = z.infer<typeof UserModel>;

export const UserCreateInputSchema = UserModel.pick({
  email: true,
  password: true,
  role: true,
  nickName: true,
  firstName: true,
  lastName: true,
  gender: true,
  birthDate: true,
  phone: true,
  phonePrefix: true,
  birthCountry: true,
  birthState: true,
  birthCity: true,
  birthPostalCode: true,
})
  .merge(
    UserModel.partial().pick({
      resetPasswordToken: true,
    }),
  )
  .strict();

export const UserUpdateInputSchema = UserCreateInputSchema.partial();

export const FindByPhoneSchema = UserModel.pick({
  phone: true,
  phonePrefix: true,
}).strict();

export const UserResponseSchema = z.object(
  UserModel.omit({
    password: true,
    resetPasswordToken: true,
    deviceId: true,
  }).shape,
);
