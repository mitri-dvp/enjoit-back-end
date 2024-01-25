import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const CreateCustomerSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
  })
  .strict();

export class CreateCustomerDto extends createZodDto(CreateCustomerSchema) {}

export class UpdateCustomerDto extends createZodDto(
  CreateCustomerSchema.partial(),
) {}
