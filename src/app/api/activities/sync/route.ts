import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { activities, users } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import {
  getValidAccessToken,
  isGarminConnected,
} from "@/lib/garmin/token-manager";
import { GarminClient, formatGarminActivity } from "@/lib/garmin/client";

// POST /api/activities/sync - 同步 Garmin 运动数据
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 检查是否已绑定 Garmin
    const connected = await isGarminConnected(session.user.id);
    if (!connected) {
      return NextResponse.json(
        { error: "Garmin not connected" },
        { status: 400 }
      );
    }

    // 获取有效的 access token
    const accessToken = await getValidAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to get valid access token" },
        { status: 401 }
      );
    }

    // 获取用户信息以确定上次同步时间
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { updatedAt: true },
    });

    // 调用 Garmin API 获取运动数据
    const client = new GarminClient(accessToken);
    const garminActivities = await client.getActivities(50);

    // 获取已存在的 Garmin 活动 ID
    const existingActivities = await db.query.activities.findMany({
      where: eq(activities.userId, session.user.id),
      columns: { garminActivityId: true },
    });
    const existingIds = new Set(
      existingActivities
        .map((a) => a.garminActivityId)
        .filter((id): id is string => !!id)
    );

    // 过滤出新活动
    const newActivities = garminActivities.filter(
      (a) => !existingIds.has(a.activityId)
    );

    // 批量插入新活动
    if (newActivities.length > 0) {
      const records = newActivities.map((activity) => ({
        userId: session.user.id,
        ...formatGarminActivity(activity),
      }));

      await db.insert(activities).values(records);
    }

    return NextResponse.json({
      success: true,
      synced: newActivities.length,
      total: garminActivities.length,
    });
  } catch (error) {
    console.error("Error syncing activities:", error);

    if (error instanceof Error) {
      if (error.message === "Token expired or invalid") {
        return NextResponse.json(
          { error: "Token expired, please reconnect Garmin" },
          { status: 401 }
        );
      }
      if (error.message === "Rate limit exceeded") {
        return NextResponse.json(
          { error: "Rate limit exceeded, please try again later" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
