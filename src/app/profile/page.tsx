import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Activity, Image, Watch } from "lucide-react";
import { GarminBindButton } from "@/components/garmin-bind-button";

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

  const isGarminConnected = !!user.garminUserId && !!user.garminAccessToken;

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
                  {isGarminConnected && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      已绑定佳明
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {user.bio || "这个人很懒，什么都没留下..."}
            </p>

            {/* Garmin 绑定 */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">佳明账号</h3>
                  <p className="text-sm text-muted-foreground">
                    {isGarminConnected
                      ? "已绑定，可以同步运动数据"
                      : "绑定后可同步运动数据并生成海报"}
                  </p>
                </div>
                <GarminBindButton
                  isConnected={isGarminConnected}
                  onDisconnect={() => {
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/activities">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">运动记录</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  查看和同步您的运动数据
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/my-posters">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">我的海报</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  管理您创建的海报
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/poster/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">创建海报</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  生成运动成就海报
                </p>
              </CardContent>
            </Card>
          </Link>
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
              <Link href="/upload">
                <Button className="mt-4">上传表盘</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
