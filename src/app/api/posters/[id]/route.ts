import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posters } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/posters/:id - 获取海报详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const poster = await db.query.posters.findFirst({
      where: and(eq(posters.id, id), eq(posters.userId, session.user.id)),
      with: {
        activity: true,
        template: true,
      },
    });

    if (!poster) {
      return NextResponse.json({ error: "Poster not found" }, { status: 404 });
    }

    // 增加浏览次数
    await db
      .update(posters)
      .set({ viewCount: (poster.viewCount || 0) + 1 })
      .where(eq(posters.id, id));

    return NextResponse.json({ poster });
  } catch (error) {
    console.error("Error fetching poster:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/posters/:id - 删除海报
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // 验证所有权
    const poster = await db.query.posters.findFirst({
      where: and(eq(posters.id, id), eq(posters.userId, session.user.id)),
    });

    if (!poster) {
      return NextResponse.json({ error: "Poster not found" }, { status: 404 });
    }

    // 删除记录
    await db.delete(posters).where(eq(posters.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting poster:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/posters/:id - 更新海报（例如更新图片 URL）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // 验证所有权
    const poster = await db.query.posters.findFirst({
      where: and(eq(posters.id, id), eq(posters.userId, session.user.id)),
    });

    if (!poster) {
      return NextResponse.json({ error: "Poster not found" }, { status: 404 });
    }

    // 更新
    const updated = await db
      .update(posters)
      .set({
        imageUrl: body.imageUrl,
        title: body.title,
        customText: body.customText,
        styleConfig: body.styleConfig,
      })
      .where(eq(posters.id, id))
      .returning();

    return NextResponse.json({ poster: updated[0] });
  } catch (error) {
    console.error("Error updating poster:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
