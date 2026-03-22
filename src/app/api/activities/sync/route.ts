import { NextResponse } from "next/server";

// POST /api/activities/sync - 同步 Garmin 运动数据（已禁用认证）
export async function POST() {
  try {
    // 返回模拟数据，无需认证
    return NextResponse.json({
      success: true,
      synced: 0,
      total: 0,
      message: "Garmin sync disabled in anonymous mode",
    });
  } catch (error) {
    console.error("Error syncing activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
