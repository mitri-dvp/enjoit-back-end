import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const CreateOrderSchema = z
  .object({
    customerId: z.number().positive().step(1),
  })
  .strict();

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}

export class UpdateOrderDto extends createZodDto(CreateOrderSchema.partial()) {}
