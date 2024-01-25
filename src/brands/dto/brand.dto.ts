import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateBrandSchema = z
  .object({
    name: z.string(),
    image: z.string().url(),
  })
  .strict();

export class CreateBrandDto extends createZodDto(CreateBrandSchema) {}

export class UpdateBrandDto extends createZodDto(CreateBrandSchema.partial()) {}
