import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">
              WhatsApp Inbox
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <SidebarNav />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <OrganizationSwitcher
              afterSelectOrganizationUrl="/conversations"
              afterCreateOrganizationUrl="/conversations"
            />
            <UserButton />
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
