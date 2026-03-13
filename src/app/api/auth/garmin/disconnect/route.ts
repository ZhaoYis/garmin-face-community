import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// POST /api/auth/garmin/disconnect - 解绑 Garmin 账号
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 清除 Garmin 绑定信息
    await db
      .update(users)
      .set({
        garminUserId: null,
        garminAccessToken: null,
        garminRefreshToken: null,
        garminTokenExpireAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Garmin account disconnected",
    });
  } catch (error) {
    console.error("Error disconnecting Garmin account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
