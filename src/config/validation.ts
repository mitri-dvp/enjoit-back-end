import { z } from 'zod';

const configSchema = z.object({
  // Server
  PORT: z.coerce.number().positive(),
  API_KEY: z.string(),
  // PostgreSQL
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PORT: z.coerce.number().positive(),
  // PgAdmin
  PGADMIN_DEFAULT_EMAIL: z.string().email(),
  PGADMIN_DEFAULT_PASSWORD: z.string(),
});

export type Config = z.infer<typeof configSchema>;

export const validate = (config: Record<string, unknown>) => {
  return configSchema.parse(config);
};
