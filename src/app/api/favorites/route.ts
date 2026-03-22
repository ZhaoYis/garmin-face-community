import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favorites, watchFaces } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

const MOCK_USER_ID = "anonymous";

// POST /api/favorites - 添加收藏
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

    // 检查是否已收藏
    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, MOCK_USER_ID),
        eq(favorites.watchFaceId, watchFaceId)
      ),
    });

    if (existingFavorite) {
      return NextResponse.json({ error: "已收藏" }, { status: 400 });
    }

    // 添加收藏
    const [favorite] = await db
      .insert(favorites)
      .values({
        userId: MOCK_USER_ID,
        watchFaceId,
      })
      .returning();

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// GET /api/favorites - 获取用户收藏列表
export async function GET() {
  try {
    // 使用 JOIN 查询获取收藏和表盘信息
    const favoriteList = await db
      .select({
        id: favorites.id,
        createdAt: favorites.createdAt,
        watchface: {
          id: watchFaces.id,
          name: watchFaces.name,
          description: watchFaces.description,
          thumbnailUrl: watchFaces.thumbnailUrl,
          category: watchFaces.category,
          downloads: watchFaces.downloads,
          likes: watchFaces.likes,
        },
      })
      .from(favorites)
      .leftJoin(watchFaces, eq(favorites.watchFaceId, watchFaces.id))
      .where(eq(favorites.userId, MOCK_USER_ID))
      .orderBy(desc(favorites.createdAt));

    return NextResponse.json(favoriteList);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// DELETE /api/favorites - 取消收藏
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const watchFaceId = searchParams.get("watchFaceId");

    if (!watchFaceId) {
      return NextResponse.json({ error: "缺少表盘ID" }, { status: 400 });
    }

    // 删除收藏
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, MOCK_USER_ID),
          eq(favorites.watchFaceId, watchFaceId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
