import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posters } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// POST /api/posters/share - 记录分享
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { posterId } = body;

    if (!posterId) {
      return NextResponse.json({ error: "Poster ID required" }, { status: 400 });
    }

    // 获取海报
    const poster = await db.query.posters.findFirst({
      where: eq(posters.id, posterId),
    });

    if (!poster) {
      return NextResponse.json({ error: "Poster not found" }, { status: 404 });
    }

    // 增加分享次数
    const updated = await db
      .update(posters)
      .set({ shareCount: (poster.shareCount || 0) + 1 })
      .where(eq(posters.id, posterId))
      .returning();

    return NextResponse.json({
      success: true,
      shareCount: updated[0].shareCount,
    });
  } catch (error) {
    console.error("Error recording share:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
