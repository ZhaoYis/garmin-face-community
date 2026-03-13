import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posterTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { POSTER_TEMPLATES } from "@/lib/poster/templates";

// GET /api/templates/:id - 获取模板详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const templateId = parseInt(id);

    if (isNaN(templateId)) {
      return NextResponse.json({ error: "Invalid template ID" }, { status: 400 });
    }

    // 尝试从数据库获取
    let template = await db.query.posterTemplates.findFirst({
      where: eq(posterTemplates.id, templateId),
    });

    // 如果数据库没有，从预设模板获取
    if (!template) {
      const presetTemplate = POSTER_TEMPLATES.find((t) => t.id === templateId);
      if (presetTemplate) {
        template = {
          id: presetTemplate.id,
          name: presetTemplate.name,
          key: presetTemplate.key,
          category: presetTemplate.category,
          previewUrl: presetTemplate.previewUrl || null,
          thumbnailUrl: presetTemplate.thumbnailUrl || null,
          config: presetTemplate.config,
          isFree: presetTemplate.isFree,
          price: presetTemplate.price || null,
          sortOrder: presetTemplate.sortOrder,
          status: "active" as const,
          createdAt: new Date(),
        };
      }
    }

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
