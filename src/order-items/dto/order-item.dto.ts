import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const CreateOrderItemSchema = z
  .object({
    quantity: z.number().positive().step(1),
    productId: z.number().positive().step(1),
    orderId: z.number().positive().step(1),
  })
  .strict();

export class CreateOrderItemDto extends createZodDto(CreateOrderItemSchema) {}

export class UpdateOrderItemDto extends createZodDto(
  CreateOrderItemSchema.partial(),
) {}
