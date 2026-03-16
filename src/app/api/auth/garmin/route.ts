import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateGarminAuthUrl, generateState } from "@/lib/garmin/oauth";
import { isGarminConfigured } from "@/lib/garmin/oauth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

// GET /api/auth/garmin - 获取 Garmin 授权 URL
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, PERMISSIONS.BIND_GARMIN)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!isGarminConfigured()) {
      return NextResponse.json(
        { error: "Garmin OAuth not configured" },
        { status: 500 }
      );
    }

    // 生成 state 参数（用于防 CSRF）
    const state = generateState();

    // 生成授权 URL
    const authUrl = generateGarminAuthUrl(state);

    // P1 修复：将 state 存储到 httpOnly cookie 中
    const response = NextResponse.json({
      authUrl,
    });

    // 设置 state cookie，有效期 10 分钟
    response.cookies.set("garmin_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 分钟
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error generating Garmin auth URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
