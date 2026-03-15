import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { watchFaces, users, comments, likes, favorites } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
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

// 检查用户是否点赞/收藏
async function getUserActions(watchFaceId: string, userId: string | undefined) {
  if (!userId) return { liked: false, favorited: false };

  const [likeRecord, favoriteRecord] = await Promise.all([
    db.query.likes.findFirst({
      where: eq(likes.watchFaceId, watchFaceId) && eq(likes.userId, userId),
    }),
    db.query.favorites.findFirst({
      where: eq(favorites.watchFaceId, watchFaceId) && eq(favorites.userId, userId),
    }),
  ]);

  return {
    liked: !!likeRecord,
    favorited: !!favoriteRecord,
  };
}

export default async function WatchFaceDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const [watchface, commentList] = await Promise.all([
    getWatchFace(id),
    getComments(id),
  ]);

  if (!watchface) {
    notFound();
  }

  const userActions = await getUserActions(id, session?.user?.id);

  // 分类显示名称
  const categoryNames: Record<string, string> = {
    analog: "模拟",
    digital: "数字",
    hybrid: "混合",
    fitness: "运动",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Garmin 表盘社区
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/upload">
                <Button>上传表盘</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">个人中心</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/watchfaces">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
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
                  <span className="text-muted-foreground">表盘预览</span>
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
                  isAuthenticated={!!session?.user}
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
              {watchface.description || "暂无描述"}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">下载量</span>
                <span className="font-medium">{watchface.downloads}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">点赞数</span>
                <span className="font-medium">{watchface.likes}</span>
              </div>
              {watchface.fileSize && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">文件大小</span>
                  <span className="font-medium">{(watchface.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">发布时间</span>
                <span className="font-medium">
                  {watchface.createdAt ? new Date(watchface.createdAt).toLocaleDateString("zh-CN") : "-"}
                </span>
              </div>
            </div>

            {/* Author */}
            {watchface.author && (
              <AuthorCard
                author={watchface.author}
                currentUserId={session?.user?.id}
                isAuthenticated={!!session?.user}
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
                评论 ({commentList.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommentSection
                watchFaceId={id}
                comments={commentList}
                isAuthenticated={!!session?.user}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
