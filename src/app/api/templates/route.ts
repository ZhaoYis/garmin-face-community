import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posterTemplates } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { POSTER_TEMPLATES } from "@/lib/poster/templates";

// GET /api/templates - 获取模板列表
export async function GET() {
  try {
    // 尝试从数据库获取模板
    let templates = await db.query.posterTemplates.findMany({
      where: eq(posterTemplates.status, "active"),
      orderBy: [asc(posterTemplates.sortOrder)],
    });

    // 如果数据库没有模板，返回预设模板
    if (templates.length === 0) {
      templates = POSTER_TEMPLATES.map((t) => ({
        id: t.id,
        name: t.name,
        key: t.key,
        category: t.category,
        previewUrl: t.previewUrl || null,
        thumbnailUrl: t.thumbnailUrl || null,
        config: t.config,
        isFree: t.isFree,
        price: t.price || null,
        sortOrder: t.sortOrder,
        status: "active" as const,
        createdAt: new Date(),
      }));
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
