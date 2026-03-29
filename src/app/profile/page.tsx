import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Activity, ImageIcon, Watch } from "lucide-react";
import { getTranslations } from "next-intl/server";

// 匿名用户数据
const anonymousUser = {
  id: "anonymous",
  name: null,
  email: "visitor@example.com",
  image: null,
  bio: null,
  role: "guest",
  status: "active",
  garminUserId: null,
  garminAccessToken: null,
};

export default async function ProfilePage() {
  const t = await getTranslations();

  // 匿名用户模式
  const user = anonymousUser;

  const isGarminConnected = false;

  const getRoleLabel = (role: string) => {
    const key = `admin.roles.${role}` as const;
    try {
      return t(key);
    } catch {
      return role;
    }
  };

  const getStatusLabel = (status: string) => {
    const key = `admin.statuses.${status}` as const;
    try {
      return t(key);
    } catch {
      return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.name || t("profile.defaultUser")}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {getRoleLabel(user.role)}
                  </Badge>
                  <Badge variant={user.status === "active" ? "default" : "destructive"}>
                    {getStatusLabel(user.status)}
                  </Badge>
                  {isGarminConnected && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {t("profile.garminConnected")}
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
              {user.bio || t("profile.defaultBio")}
            </p>

            {/* Garmin 绑定 */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t("profile.garminAccount")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isGarminConnected
                      ? t("profile.garminConnectedDesc")
                      : t("profile.garminNotConnectedDesc")}
                  </p>
                </div>
                <Badge variant="outline">{t("profile.notConnected")}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/activities">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("nav.activities")}</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("home.features.syncDataDesc")}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/my-posters">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("nav.myPosters")}</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("poster.myPosters")}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/poster/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("nav.createPoster")}</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("home.features.generatePosterDesc")}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 作品列表占位 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.myWorks")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Watch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t("profile.noWorksDesc")}</p>
              <Link href="/upload">
                <Button className="mt-4">{t("profile.uploadWatchface")}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
