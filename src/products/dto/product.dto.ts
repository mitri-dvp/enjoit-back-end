import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

const CreateProductSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive().min(1).step(1),
    stock: z.number().positive().min(1).step(1),
    image: z.string().url(),
    brandId: z.number().positive().min(1).step(1),
    categoriesIds: z.array(z.number()),
  })
  .strict();

export class CreateProductDto extends createZodDto(CreateProductSchema) {}

export class UpdateProductDto extends createZodDto(
  CreateProductSchema.partial(),
) {}

const FindProductSchema = z
  .object({
    limit: z.number().positive().min(1).step(1),
    offset: z.number().positive().min(0).step(1),
    minPrice: z.number().positive().min(1).step(1),
    maxPrice: z.number().positive().min(1).step(1),
  })
  .strict()
  .optional();

export class FindProductDto extends createZodDto(FindProductSchema) {}
