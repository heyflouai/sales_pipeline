import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Create postgres client with Supabase transaction pooling configuration
// prepare: false is CRITICAL for pgbouncer/transaction pooling
// max: 1 is required for serverless environments (one connection per function instance)

let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDbConnection(): PostgresJsDatabase<typeof schema> {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes('[project-ref]')) {
    throw new Error("DATABASE_URL not configured. Please set up Supabase and update .env.local");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
  });

  _db = drizzle({ client, schema });
  return _db;
}

// Export drizzle instance with schema for relational queries
// This will be lazy-loaded on first use
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const connection = getDbConnection();
    return connection[prop as keyof typeof connection];
  },
});

/**
 * Set tenant context for row-level security.
 * MUST be called before any database queries that access multi-tenant tables.
 *
 * @param organizationId - The Clerk organization ID (org_xxx)
 */
export async function setTenantContext(organizationId: string): Promise<void> {
  await db.execute(
    sql`SET LOCAL app.current_organization_id = ${organizationId}`
  );
}

/**
 * Set user context for row-level security and audit logging.
 *
 * @param userId - The Clerk user ID (user_xxx)
 * @param role - The user's role (admin, manager, agent)
 */
export async function setUserContext(userId: string, role: string): Promise<void> {
  await db.execute(sql`SET LOCAL app.current_user_id = ${userId}`);
  await db.execute(sql`SET LOCAL app.user_role = ${role}`);
}

/**
 * Helper to set tenant context from Next.js headers (set by middleware).
 * Use this in API routes and Server Actions before database queries.
 */
export async function setTenantContextFromHeaders(headers: Headers): Promise<void> {
  const orgId = headers.get("x-organization-id");
  if (orgId) {
    await setTenantContext(orgId);
  }
}
