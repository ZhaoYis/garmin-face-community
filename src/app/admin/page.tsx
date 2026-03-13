import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Watch, FileCheck, BarChart } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r min-h-screen p-4">
          <h2 className="text-xl font-bold mb-6">管理后台</h2>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"
            >
              <BarChart className="w-4 h-4" />
              仪表盘
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"
            >
              <Users className="w-4 h-4" />
              用户管理
            </Link>
            <Link
              href="/admin/watchfaces"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"
            >
              <Watch className="w-4 h-4" />
              表盘管理
            </Link>
            <Link
              href="/admin/reviews"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"
            >
              <FileCheck className="w-4 h-4" />
              审核管理
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总表盘</CardTitle>
                <Watch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">待审核</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总下载</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                暂无数据
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
