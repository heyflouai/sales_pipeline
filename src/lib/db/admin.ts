import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

/**
 * Admin database connection that bypasses RLS.
 * Use ONLY for:
 * - Webhook handlers (no tenant session context)
 * - System-level operations
 * - Admin tools
 *
 * NEVER use this for user-facing queries - use the regular db instance instead.
 */

let _adminDb: PostgresJsDatabase<typeof schema> | null = null;

function getAdminDbConnection(): PostgresJsDatabase<typeof schema> {
  if (_adminDb) return _adminDb;

  // Use DIRECT_DATABASE_URL for admin operations (bypasses connection pooling)
  const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes('[project-ref]')) {
    throw new Error("DIRECT_DATABASE_URL not configured. Please set up Supabase and update .env.local");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  _adminDb = drizzle({ client, schema });
  return _adminDb;
}

// Export lazy-loaded admin db connection
export const adminDb = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const connection = getAdminDbConnection();
    return connection[prop as keyof typeof connection];
  },
});
