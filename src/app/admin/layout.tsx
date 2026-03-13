import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { Users, LayoutTemplate, FileCheck, Settings } from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "概览", icon: Settings },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/templates", label: "模板管理", icon: LayoutTemplate },
  { href: "/admin/watchfaces", label: "表盘审核", icon: FileCheck },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.ACCESS_ADMIN)) {
    redirect("/forbidden");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold">管理后台</h1>
          </div>
          <nav className="space-y-1 px-3">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
