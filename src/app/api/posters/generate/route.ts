import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posters, activities, posterTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// 请求体验证
const generatePosterSchema = z.object({
  activityId: z.string().uuid(),
  templateId: z.number(),
  title: z.string().optional(),
  customText: z.string().max(50).optional(),
  styleConfig: z
    .object({
      primaryColor: z.string().optional(),
      font: z.string().optional(),
    })
    .optional(),
});

// POST /api/posters/generate - 生成海报
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = generatePosterSchema.parse(body);

    // 获取运动记录
    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, validated.activityId),
    });

    if (!activity || activity.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    // 获取模板
    const template = await db.query.posterTemplates.findFirst({
      where: eq(posterTemplates.id, validated.templateId),
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 生成海报图片 URL（实际渲染在前端完成）
    // 这里只创建数据库记录，前端渲染后上传
    const poster = await db
      .insert(posters)
      .values({
        userId: session.user.id,
        activityId: validated.activityId,
        templateId: validated.templateId,
        title: validated.title || activity.name,
        imageUrl: "", // 前端渲染后更新
        customText: validated.customText,
        styleConfig: validated.styleConfig,
      })
      .returning();

    return NextResponse.json({
      success: true,
      poster: poster[0],
      renderData: {
        activity,
        template,
        customText: validated.customText,
        styleConfig: validated.styleConfig,
      },
    });
  } catch (error) {
    console.error("Error generating poster:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
