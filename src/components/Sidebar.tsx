"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, FolderTree, Users, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import clsx from "clsx";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "News", href: "/dashboard/news", icon: FileText },
  { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { name: "Users", href: "/dashboard/users", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <h1 className="text-xl font-bold">News Admin</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
              )}
            >
              <item.icon
                className={clsx(
                  isActive ? "text-white" : "text-gray-400 group-hover:text-white",
                  "mr-3 flex-shrink-0 h-6 w-6 transition-colors"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-white" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
