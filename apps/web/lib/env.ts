import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("file:./dev.db"),
  XAI_API_KEY: z.string().optional(),
  PROMPTCRASH_XAI_MODEL: z.string().default("grok-4.3")
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  XAI_API_KEY: process.env.XAI_API_KEY,
  PROMPTCRASH_XAI_MODEL: process.env.PROMPTCRASH_XAI_MODEL
});
