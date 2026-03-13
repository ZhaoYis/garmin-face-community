import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Watch, FileCheck, BarChart } from "lucide-react";
import { db } from "@/lib/db";
import { users, watchFaces } from "@/lib/db/schema";
import { count, sql } from "drizzle-orm";

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
  const stats = await getStats();

  const statCards = [
    { title: "总用户", value: stats.users, icon: Users },
    { title: "总表盘", value: stats.watchfaces, icon: Watch },
    { title: "待审核", value: stats.pending, icon: FileCheck },
    { title: "总下载", value: stats.downloads, icon: BarChart },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

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
          <CardTitle>快速操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              管理用户
            </Link>
            <Link
              href="/admin/watchfaces"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
            >
              审核表盘
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
