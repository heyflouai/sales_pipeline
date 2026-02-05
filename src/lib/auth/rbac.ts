import { auth } from "@clerk/nextjs/server";

// Clerk organization roles
export type OrgRole = "org:admin" | "org:manager" | "org:agent";

// Role hierarchy levels (higher = more permissions)
const roleHierarchy: Record<string, number> = {
  "org:admin": 3,
  "org:manager": 2,
  "org:agent": 1,
};

/**
 * Get the current user's context from Clerk auth.
 * Throws if user is not authenticated or not in an organization.
 */
export async function getCurrentUser(): Promise<{
  userId: string;
  orgId: string;
  orgRole: OrgRole;
}> {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (!orgId || !orgRole) {
    throw new Error("Organization required: Please select or create an organization");
  }

  return {
    userId,
    orgId,
    orgRole: orgRole as OrgRole,
  };
}

/**
 * Check if the current user has at least the specified role.
 * Returns false if user is not authenticated or doesn't have sufficient role.
 */
export async function hasRole(requiredRole: OrgRole): Promise<boolean> {
  try {
    const { orgRole } = await getCurrentUser();
    const userLevel = roleHierarchy[orgRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    return userLevel >= requiredLevel;
  } catch {
    return false;
  }
}

/**
 * Require that the current user has at least the specified role.
 * Throws 403 error if insufficient permissions.
 */
export async function requireRole(requiredRole: OrgRole): Promise<void> {
  const { orgRole } = await getCurrentUser();
  const userLevel = roleHierarchy[orgRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    throw new Error(
      `Forbidden: ${requiredRole} role required. You have ${orgRole}.`
    );
  }
}

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("org:admin");
}

/**
 * Check if the current user can manage users (admin or manager).
 */
export async function canManageUsers(): Promise<boolean> {
  return hasRole("org:manager");
}
