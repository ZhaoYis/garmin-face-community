import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Watch, FileCheck, BarChart } from "lucide-react";
import { db } from "@/lib/db";
import { users, watchFaces } from "@/lib/db/schema";
import { count, sql } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

async function getStats() {
  const [userCount] = await db.select({ count: count() }).from(users);
  const [watchfaceCount] = await db.select({ count: count() }).from(watchFaces);
  const [pendingCount] = await db
    .select({ count: count() })
    .from(watchFaces)
    .where(sql`status = 'pending'`);
  const [downloadsResult] = await db
    .select({ total: sql<number>`COALESCE(SUM(downloads), 0)` })
    .from(watchFaces);

  return {
    users: userCount.count,
    watchfaces: watchfaceCount.count,
    pending: pendingCount.count,
    downloads: Number(downloadsResult?.total || 0),
  };
}

export default async function AdminDashboardPage() {
  // P2 修复：页面级别的额外权限检查
  const session = await auth();
  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.ACCESS_ADMIN)) {
    redirect("/forbidden");
  }

  const stats = await getStats();
  const t = await getTranslations();

  const statCards = [
    { title: t("admin.totalUsers"), value: stats.users, icon: Users },
    { title: t("admin.totalWatchfaces"), value: stats.watchfaces, icon: Watch },
    { title: t("admin.pending"), value: stats.pending, icon: FileCheck },
    { title: t("admin.totalDownloads"), value: stats.downloads, icon: BarChart },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("admin.dashboard")}</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t("admin.manageUsers")}
            </Link>
            <Link
              href="/admin/watchfaces"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              {t("admin.reviewWatchfaces")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
