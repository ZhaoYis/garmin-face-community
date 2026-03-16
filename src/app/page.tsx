import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Activity, Image as ImageIcon, Upload, Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { watchFaces, users } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import WatchFaceGrid from "@/components/watchface-grid";

// 获取公开表盘数据
async function getPublicWatchFaces() {
  const limit = 12;

  const watchfaces = await db
    .select({
      id: watchFaces.id,
      name: watchFaces.name,
      description: watchFaces.description,
      category: watchFaces.category,
      thumbnailUrl: watchFaces.thumbnailUrl,
      downloads: watchFaces.downloads,
      likes: watchFaces.likes,
      createdAt: watchFaces.createdAt,
      author: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(watchFaces)
    .leftJoin(users, eq(watchFaces.userId, users.id))
    .where(eq(watchFaces.status, "approved"))
    .orderBy(desc(watchFaces.createdAt))
    .limit(limit);

  // 获取总数
  const [totalResult] = await db
    .select({ count: count() })
    .from(watchFaces)
    .where(eq(watchFaces.status, "approved"));

  return {
    data: watchfaces,
    hasMore: totalResult.count > limit,
  };
}

export default async function HomePage() {
  const t = await getTranslations();
  const session = await auth();
  const { data: watchfaces, hasMore } = await getPublicWatchFaces();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("home.subtitle")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("home.description")}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/activities">
            <Button size="lg">
              <Activity className="w-5 h-5 mr-2" />
              {t("nav.activities")}
            </Button>
          </Link>
          <Link href="/poster/create">
            <Button variant="outline" size="lg">
              <ImageIcon className="w-5 h-5 mr-2" />
              {t("nav.createPoster")}
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" size="lg">
              <Upload className="w-5 h-5 mr-2" />
              上传表盘
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">{t("home.features.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.features.syncData")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.syncDataDesc")}
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.features.generatePoster")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.generatePosterDesc")}
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.features.sharePoster")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.sharePosterDesc")}
            </p>
          </Card>
        </div>
      </section>

      {/* User Works Section - 小红书风格 */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5" />
            用户作品展示
          </h2>
          <Link href="/watchfaces" className="text-sm text-primary hover:underline">
            查看全部 →
          </Link>
        </div>

        <WatchFaceGrid
          initialData={watchfaces}
          initialHasMore={hasMore}
          isAuthenticated={!!session?.user}
        />
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Garmin Face Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
