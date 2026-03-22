import Link from "next/link";
import { Users, LayoutTemplate, FileCheck, Settings } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations();

  const adminNavItems = [
    { href: "/admin", label: t("admin.overview"), icon: Settings },
    { href: "/admin/users", label: t("admin.users"), icon: Users },
    { href: "/admin/templates", label: t("admin.templates"), icon: LayoutTemplate },
    { href: "/admin/watchfaces", label: t("admin.watchfaces"), icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold">{t("nav.admin")}</h1>
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
