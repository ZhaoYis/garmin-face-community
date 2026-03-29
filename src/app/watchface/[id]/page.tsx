import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { watchFaces, users, comments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import CommentSection from "./comment-section";
import ActionButtons from "./action-buttons";
import AuthorCard from "./author-card";

interface Props {
  params: Promise<{ id: string }>;
}

// 获取表盘详情
async function getWatchFace(id: string) {
  const watchface = await db.query.watchFaces.findFirst({
    where: eq(watchFaces.id, id),
  });

  if (!watchface) return null;

  // 获取作者信息
  const author = await db.query.users.findFirst({
    where: eq(users.id, watchface.userId),
    columns: {
      id: true,
      name: true,
      image: true,
      bio: true,
    },
  });

  return { ...watchface, author };
}

// 获取评论列表
async function getComments(watchFaceId: string) {
  return await db
    .select({
      id: comments.id,
      content: comments.content,
      rating: comments.rating,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.watchFaceId, watchFaceId))
    .orderBy(desc(comments.createdAt))
    .limit(20);
}

// 检查用户是否点赞/收藏 (匿名用户始终返回未点赞/未收藏)
async function getUserActions(watchFaceId: string, userId: string | undefined) {
  return { liked: false, favorited: false };
}

export default async function WatchFaceDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations();
  const [watchface, commentList] = await Promise.all([
    getWatchFace(id),
    getComments(id),
  ]);

  if (!watchface) {
    notFound();
  }

  const userActions = { liked: false, favorited: false };

  // 分类显示名称
  const categoryNames: Record<string, string> = {
    analog: t("watchfaces.categories.analog"),
    digital: t("watchfaces.categories.digital"),
    hybrid: t("watchfaces.categories.hybrid"),
    fitness: t("watchfaces.categories.fitness"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/watchfaces">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div>
            <Card>
              <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                {watchface.thumbnailUrl ? (
                  <img
                    src={watchface.thumbnailUrl}
                    alt={watchface.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <span className="text-muted-foreground">{t("watchfaceDetail.preview")}</span>
                )}
              </div>
              <CardContent className="p-4">
                <ActionButtons
                  watchFaceId={id}
                  liked={userActions.liked}
                  favorited={userActions.favorited}
                  likes={watchface.likes}
                  downloads={watchface.downloads}
                  fileUrl={watchface.fileUrl}
                  isAuthenticated={false}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{watchface.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <Badge>{categoryNames[watchface.category] || watchface.category}</Badge>
              {watchface.tags && Array.isArray(watchface.tags) && (watchface.tags as string[]).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-6">
              {watchface.description || t("watchfaceDetail.noDescription")}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">{t("watchfaceDetail.downloads")}</span>
                <span className="font-medium">{watchface.downloads}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">{t("watchfaceDetail.likes")}</span>
                <span className="font-medium">{watchface.likes}</span>
              </div>
              {watchface.fileSize && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">{t("watchfaceDetail.fileSize")}</span>
                  <span className="font-medium">{(watchface.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">{t("watchfaceDetail.publishDate")}</span>
                <span className="font-medium">
                  {watchface.createdAt ? new Date(watchface.createdAt).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>

            {/* Author */}
            {watchface.author && (
              <AuthorCard
                author={watchface.author}
                currentUserId={undefined}
                isAuthenticated={false}
              />
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {t("watchfaceDetail.comments")} ({commentList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection
                watchFaceId={id}
                comments={commentList}
                isAuthenticated={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
