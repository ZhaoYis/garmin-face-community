import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Watch } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.name || "用户"}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "管理员" : "用户"}
                  </Badge>
                  <Badge variant={user.status === "active" ? "default" : "destructive"}>
                    {user.status === "active" ? "活跃" : "已禁用"}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {user.bio || "这个人很懒，什么都没留下..."}
            </p>
          </CardContent>
        </Card>

        {/* 统计数据 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">我的作品</CardTitle>
              <Watch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">暂无作品</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">我的收藏</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">暂无收藏</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">关注者</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">暂无关注者</p>
            </CardContent>
          </Card>
        </div>

        {/* 作品列表占位 */}
        <Card>
          <CardHeader>
            <CardTitle>我的作品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Watch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无作品，快去上传你的第一个表盘吧！</p>
              <Button className="mt-4">上传表盘</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
