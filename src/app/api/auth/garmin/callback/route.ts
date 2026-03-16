import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { exchangeCodeForToken } from "@/lib/garmin/oauth";
import { encrypt } from "@/lib/encryption";

// GET /api/auth/garmin/callback - Garmin OAuth 回调
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=unauthorized", request.url)
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // 处理用户拒绝授权
    if (error) {
      return NextResponse.redirect(
        new URL("/profile?error=garmin_auth_denied", request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/profile?error=no_code", request.url)
      );
    }

    // P1 修复：验证 state 参数防止 CSRF 攻击
    const storedState = request.cookies.get("garmin_oauth_state")?.value;
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(
        new URL("/profile?error=invalid_state", request.url)
      );
    }

    // 交换 code 获取 token
    const tokenResponse = await exchangeCodeForToken(code);

    // 计算过期时间
    const expireAt = new Date(
      Date.now() + tokenResponse.expires_in * 1000
    );

    // 加密存储 token
    const encryptedAccessToken = encrypt(tokenResponse.access_token);
    const encryptedRefreshToken = encrypt(tokenResponse.refresh_token);

    // 更新用户记录
    await db
      .update(users)
      .set({
        garminUserId: tokenResponse.access_token, // 暂时用 access_token 作为标识
        garminAccessToken: encryptedAccessToken,
        garminRefreshToken: encryptedRefreshToken,
        garminTokenExpireAt: expireAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    // 创建响应并清除 state cookie
    const response = NextResponse.redirect(
      new URL("/profile?garmin=connected", request.url)
    );
    response.cookies.delete("garmin_oauth_state");

    return response;
  } catch (error) {
    console.error("Error in Garmin OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/profile?error=garmin_auth_failed", request.url)
    );
  }
}
