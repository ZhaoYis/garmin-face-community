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

    // 在实际生产环境中，state 应该存储在 session 或 cookie 中
    // 这里简化处理，返回 state 供前端验证
    return NextResponse.json({
      authUrl,
      state,
    });
  } catch (error) {
    console.error("Error generating Garmin auth URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
