import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { likes, watchFaces } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

const MOCK_USER_ID = "anonymous";

// POST /api/likes - 点赞
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { watchFaceId } = body;

    if (!watchFaceId) {
      return NextResponse.json({ error: "缺少表盘ID" }, { status: 400 });
    }

    // 检查表盘是否存在
    const watchface = await db.query.watchFaces.findFirst({
      where: eq(watchFaces.id, watchFaceId),
    });

    if (!watchface) {
      return NextResponse.json({ error: "表盘不存在" }, { status: 404 });
    }

    // 检查是否已点赞
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, MOCK_USER_ID),
        eq(likes.watchFaceId, watchFaceId)
      ),
    });

    if (existingLike) {
      return NextResponse.json({ error: "已点赞" }, { status: 400 });
    }

    // 添加点赞
    await db.insert(likes).values({
      userId: MOCK_USER_ID,
      watchFaceId,
    });

    // 更新表盘点赞数
    await db
      .update(watchFaces)
      .set({
        likes: sql`${watchFaces.likes} + 1`,
      })
      .where(eq(watchFaces.id, watchFaceId));

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// DELETE /api/likes - 取消点赞
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const watchFaceId = searchParams.get("watchFaceId");

    if (!watchFaceId) {
      return NextResponse.json({ error: "缺少表盘ID" }, { status: 400 });
    }

    // 检查是否已点赞
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, MOCK_USER_ID),
        eq(likes.watchFaceId, watchFaceId)
      ),
    });

    if (!existingLike) {
      return NextResponse.json({ error: "未点赞" }, { status: 400 });
    }

    // 删除点赞
    await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, MOCK_USER_ID),
          eq(likes.watchFaceId, watchFaceId)
        )
      );

    // 更新表盘点赞数
    await db
      .update(watchFaces)
      .set({
        likes: sql`${watchFaces.likes} - 1`,
      })
      .where(eq(watchFaces.id, watchFaceId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// GET /api/likes?watchFaceId=xxx - 检查点赞状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const watchFaceId = searchParams.get("watchFaceId");

    if (!watchFaceId) {
      return NextResponse.json({ error: "缺少表盘ID" }, { status: 400 });
    }

    const like = await db.query.likes.findFirst({
      where: and(
        eq(likes.userId, MOCK_USER_ID),
        eq(likes.watchFaceId, watchFaceId)
      ),
    });

    return NextResponse.json({ liked: !!like });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
