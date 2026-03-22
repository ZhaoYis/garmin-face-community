import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments, watchFaces, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const MOCK_USER_ID = "anonymous";

// 创建评论验证
const createCommentSchema = z.object({
  watchFaceId: z.string().uuid(),
  content: z.string().min(1).max(500),
  rating: z.number().min(1).max(5).optional(),
});

// POST /api/comments - 创建评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createCommentSchema.parse(body);

    // 检查表盘是否存在
    const watchface = await db.query.watchFaces.findFirst({
      where: eq(watchFaces.id, validated.watchFaceId),
    });

    if (!watchface) {
      return NextResponse.json({ error: "表盘不存在" }, { status: 404 });
    }

    // 检查是否已评论
    const existingComment = await db.query.comments.findFirst({
      where: and(
        eq(comments.userId, MOCK_USER_ID),
        eq(comments.watchFaceId, validated.watchFaceId)
      ),
    });

    if (existingComment) {
      return NextResponse.json({ error: "您已评论过此表盘" }, { status: 400 });
    }

    // 创建评论
    const [comment] = await db
      .insert(comments)
      .values({
        userId: MOCK_USER_ID,
        watchFaceId: validated.watchFaceId,
        content: validated.content,
        rating: validated.rating,
      })
      .returning();

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "验证错误", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// GET /api/comments?watchFaceId=xxx - 获取表盘评论
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const watchFaceId = searchParams.get("watchFaceId");

    if (!watchFaceId) {
      return NextResponse.json({ error: "缺少表盘ID" }, { status: 400 });
    }

    // 使用 JOIN 查询获取评论和用户信息
    const commentList = await db
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
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(commentList);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
