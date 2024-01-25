import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateCategorySchema = z
  .object({
    name: z.string(),
  })
  .strict();

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}

export class UpdateCategoryDto extends createZodDto(
  CreateCategorySchema.partial(),
) {}
