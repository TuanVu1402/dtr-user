import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_VERSION: z.string().min(1),

  VITE_APP_ENV: z.enum([
    'development',
    'production',
  ]),

  VITE_API_URL: z.string().url(),

  VITE_API_TIMEOUT: z.coerce.number().positive(),

  VITE_ENABLE_DEVTOOLS: z.coerce.boolean(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error(
    'Invalid environment configuration',
  );
}

export const env = parsedEnv.data;