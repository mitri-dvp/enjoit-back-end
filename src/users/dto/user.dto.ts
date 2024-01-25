import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { Role } from '../../auth/models/roles.model';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  customerId: z.number().optional().describe('ID del Client'),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateUserDto extends createZodDto(CreateUserSchema.partial()) {}
