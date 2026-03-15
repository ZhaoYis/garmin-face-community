import { db } from "@/lib/db";
import { watchFaces, users, comments, likes } from "@/lib/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";

export async function getWatchFaces(page = 1, limit = 12) {
  const offset = (page - 1) * limit;

  // 获取已审核通过的表盘
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
    .limit(limit)
    .offset(offset);

  // 获取总数
  const [totalResult] = await db
    .select({ count: count() })
    .from(watchFaces)
    .where(eq(watchFaces.status, "approved"));

  return {
    data: watchfaces,
    total: totalResult.count,
    hasMore: totalResult.count > offset + limit,
  };
}

export async function getWatchFaceComments(watchFaceId: string, limit = 3) {
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
    .limit(limit);
}

export async function checkUserLike(watchFaceId: string, userId: string | undefined) {
  if (!userId) return false;

  const like = await db.query.likes.findFirst({
    where: sql`${likes.watchFaceId} = ${watchFaceId} AND ${likes.userId} = ${userId}`,
  });

  return !!like;
}
