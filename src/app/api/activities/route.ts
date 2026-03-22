import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const MOCK_USER_ID = "anonymous";

// GET /api/activities - 获取运动记录列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const activityType = searchParams.get("type");

    // 构建查询条件
    let query = db.query.activities.findMany({
      where: eq(activities.userId, MOCK_USER_ID),
      limit,
      offset: (page - 1) * limit,
      orderBy: [desc(activities.startTime)],
    });

    // 如果有类型筛选
    if (activityType) {
      query = db.query.activities.findMany({
        where: eq(activities.userId, MOCK_USER_ID),
        limit,
        offset: (page - 1) * limit,
        orderBy: [desc(activities.startTime)],
      });
    }

    const data = await query;

    return NextResponse.json({
      activities: data,
      pagination: { page, limit },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
