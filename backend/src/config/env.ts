import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const boolEnv = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'string') return val.toLowerCase() === 'true';
  return Boolean(val);
}, z.boolean().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().url().default('http://localhost:4200'),
  JWT_ACCESS_SECRET: z.string().min(24),
  JWT_REFRESH_SECRET: z.string().min(24),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().default(7),
  COOKIE_SECURE: boolEnv.default(false),
  IMGUR_CLIENT_ID: z.string().optional().default(''),
  IMGUR_MOCK: boolEnv.default(false),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('REASONS Research Hub <no-reply@example.com>'),
  SMTP_MOCK: boolEnv.default(false),
  TURNSTILE_SECRET_KEY: z.string().optional().default(''),
  TURNSTILE_MOCK: boolEnv.default(false)
});

export const env = envSchema.parse(process.env);
