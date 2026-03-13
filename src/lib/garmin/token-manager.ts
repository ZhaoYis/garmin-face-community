import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt, encrypt } from "@/lib/encryption";
import { refreshAccessToken } from "./oauth";

// Token 刷新提前时间（5 分钟）
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

/**
 * 检查 Token 是否需要刷新
 */
function shouldRefreshToken(expireAt: Date | null): boolean {
  if (!expireAt) return false;
  return expireAt.getTime() - Date.now() < TOKEN_REFRESH_BUFFER_MS;
}

/**
 * 获取有效的 access_token（自动刷新）
 * @param userId 用户 ID
 * @returns 有效的 access_token 或 null
 */
export async function getValidAccessToken(
  userId: string
): Promise<string | null> {
  try {
    // 获取用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user?.garminAccessToken || !user?.garminRefreshToken) {
      return null;
    }

    // 解密 token
    const accessToken = decrypt(user.garminAccessToken);
    const refreshToken = decrypt(user.garminRefreshToken);

    // 检查是否需要刷新
    if (shouldRefreshToken(user.garminTokenExpireAt)) {
      try {
        // 刷新 token
        const newTokens = await refreshAccessToken(refreshToken);
        const newExpireAt = new Date(
          Date.now() + newTokens.expires_in * 1000
        );

        // 更新数据库
        await db
          .update(users)
          .set({
            garminAccessToken: encrypt(newTokens.access_token),
            garminRefreshToken: encrypt(newTokens.refresh_token),
            garminTokenExpireAt: newExpireAt,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        return newTokens.access_token;
      } catch (error) {
        console.error("Failed to refresh Garmin token:", error);
        // Token 刷新失败，可能需要用户重新授权
        return null;
      }
    }

    return accessToken;
  } catch (error) {
    console.error("Error getting valid access token:", error);
    return null;
  }
}

/**
 * 检查用户是否已绑定 Garmin
 */
export async function isGarminConnected(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      garminUserId: true,
      garminAccessToken: true,
    },
  });

  return !!(user?.garminUserId && user?.garminAccessToken);
}
