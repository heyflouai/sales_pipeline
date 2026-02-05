import { requireRole, getCurrentUser } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { OrganizationList } from "@clerk/nextjs";
import Image from "next/image";

// Force dynamic rendering (don't build statically)
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  // Require manager or admin role
  await requireRole("org:manager");

  // Get current user context
  const { orgId } = await getCurrentUser();

  // Query team members (RLS will auto-filter by org, but we'll be explicit)
  const teamMembers = await db
    .select()
    .from(users)
    .where(eq(users.organizationId, orgId));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h1>

      {/* Team members list */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.imageUrl && (
                        <Image
                          src={member.imageUrl}
                          alt={member.firstName || "User"}
                          width={32}
                          height={32}
                          className="rounded-full mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : member.role === "manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clerk Organization List for invitations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Manage Invitations
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Invite new team members and manage pending invitations through Clerk.
        </p>
        <OrganizationList
          hidePersonal
          afterSelectOrganizationUrl="/settings/team"
        />
      </div>
    </div>
  );
}
