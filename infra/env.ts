import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import z from 'zod';

dotenvExpand.expand(
  dotenv.config({
    path: '.env.development',
  })
);

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.string().default('development'),
  POSTGRES_CA: z.string().optional(),
  POSTGRES_DB: z.string(),
});

export const env = envSchema.parse(process.env);
