import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { posters } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/posters - 获取我的海报列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const userPosters = await db.query.posters.findMany({
      where: eq(posters.userId, session.user.id),
      limit,
      offset: (page - 1) * limit,
      orderBy: [desc(posters.createdAt)],
      with: {
        activity: {
          columns: {
            id: true,
            name: true,
            activityType: true,
            startTime: true,
          },
        },
        template: {
          columns: {
            id: true,
            name: true,
            key: true,
          },
        },
      },
    });

    return NextResponse.json({
      posters: userPosters,
      pagination: { page, limit },
    });
  } catch (error) {
    console.error("Error fetching posters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
