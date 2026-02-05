import { isAdmin } from "@/lib/auth/rbac";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userIsAdmin = await isAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <p className="text-gray-600">
            Manage your personal profile and preferences.
          </p>
        </div>

        {/* Organization Settings (Admin only) */}
        {userIsAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Organization Settings
            </h2>
            <p className="text-gray-600 mb-4">
              Manage your organization&apos;s settings and team members.
            </p>
            <Link
              href="/settings/team"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Manage Team
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
