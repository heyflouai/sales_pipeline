import { auth } from "@clerk/nextjs/server";

export type TenantContext = {
  userId: string;
  orgId: string | null;
  orgRole: string | null;
};

/**
 * Get the current tenant context from Clerk auth.
 * Throws if user is not authenticated.
 */
export async function getTenantContext(): Promise<TenantContext> {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  return {
    userId,
    orgId: orgId ?? null,
    orgRole: orgRole ?? null,
  };
}

/**
 * Require that the user has selected an organization.
 * Throws if no organization is selected.
 */
export async function requireOrg(): Promise<{ userId: string; orgId: string; orgRole: string }> {
  const context = await getTenantContext();

  if (!context.orgId || !context.orgRole) {
    throw new Error("Organization required: Please select or create an organization");
  }

  return {
    userId: context.userId,
    orgId: context.orgId,
    orgRole: context.orgRole,
  };
}
