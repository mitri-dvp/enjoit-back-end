import { z } from 'nestjs-zod/z';
import { UserModel } from 'prisma/zod/';

// Old
const CreateUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();

export const UserCreateInputSchema = UserModel.merge(
  z.object({
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
)
  .omit({
    id: true,
    storeId: true,
    tableId: true,
    countryId: true,
  })
  .strict();

export const UserUpdateInputSchema = UserCreateInputSchema.partial();
