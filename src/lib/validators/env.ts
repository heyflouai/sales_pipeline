import { z } from "zod";

const envSchema = z.object({
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required")
    .startsWith("pk_", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with pk_"),
  CLERK_SECRET_KEY: z
    .string()
    .min(1, "CLERK_SECRET_KEY is required")
    .startsWith("sk_", "CLERK_SECRET_KEY must start with sk_"),
  CLERK_WEBHOOK_SECRET: z
    .string()
    .min(1, "CLERK_WEBHOOK_SECRET is required")
    .startsWith("whsec_", "CLERK_WEBHOOK_SECRET must start with whsec_"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_DATABASE_URL: z.string().min(1, "DIRECT_DATABASE_URL is required"),

  // WhatsApp Meta Cloud API (optional during build — required for runtime)
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_API_TOKEN: z.string().optional(),

  // Supabase (for Realtime on client side)
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Type alias to allow optional WhatsApp fields
export type EnvStrict = Required<Env>;

let env: Env;

export function validateEnv(): Env {
  if (env) return env;

  // Skip validation during build if env vars are placeholders
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (
    publishableKey?.includes('...') ||
    databaseUrl?.includes('[project-ref]')
  ) {
    console.warn(
      "⚠️  Environment variables not configured. Please set up Clerk and Supabase and update .env.local"
    );
    // Return mock env during build
    return {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: publishableKey || 'pk_test_placeholder',
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'sk_test_placeholder',
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET || 'whsec_placeholder',
      DATABASE_URL: databaseUrl || 'postgresql://placeholder',
      DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL || 'postgresql://placeholder',
    };
  }

  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: publishableKey,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    DATABASE_URL: databaseUrl,
    DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  env = parsed.data;
  return env;
}

export function getEnv(): Env {
  if (!env) {
    throw new Error("Environment not validated. Call validateEnv() first.");
  }
  return env;
}
