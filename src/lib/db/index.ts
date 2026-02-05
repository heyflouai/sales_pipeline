import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

// Create postgres client with Supabase transaction pooling configuration
// prepare: false is CRITICAL for pgbouncer/transaction pooling
// max: 1 is required for serverless environments (one connection per function instance)
const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  prepare: false,
  max: 1,
});

// Export drizzle instance with schema for relational queries
export const db = drizzle({ client, schema });

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
