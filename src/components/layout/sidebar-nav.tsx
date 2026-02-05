"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Conversations", href: "/conversations" },
  { name: "Settings", href: "/settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              block px-4 py-2 text-sm font-medium rounded-md transition
              ${
                isActive
                  ? "bg-green-100 text-green-900"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
