import { GARMIN_CONFIG, GarminTokenResponse } from "./types";

/**
 * 获取 Garmin OAuth 配置
 */
function getGarminCredentials() {
  const clientId = process.env.GARMIN_CLIENT_ID;
  const clientSecret = process.env.GARMIN_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId || !clientSecret || !appUrl) {
    throw new Error("Garmin OAuth credentials not configured");
  }

  return { clientId, clientSecret, appUrl };
}

/**
 * 生成随机 state 参数
 */
export function generateState(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString(
    "base64url"
  );
}

/**
 * 生成 Garmin OAuth 授权 URL
 * @param state 防 CSRF 的 state 参数
 */
export function generateGarminAuthUrl(state: string): string {
  const { clientId, appUrl } = getGarminCredentials();
  const redirectUri = `${appUrl}/api/auth/garmin/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
  });

  return `${GARMIN_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * 使用授权码交换 Token
 * @param code OAuth 授权码
 */
export async function exchangeCodeForToken(
  code: string
): Promise<GarminTokenResponse> {
  const { clientId, clientSecret, appUrl } = getGarminCredentials();
  const redirectUri = `${appUrl}/api/auth/garmin/callback`;

  const response = await fetch(GARMIN_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * 使用 refresh_token 刷新 access_token
 * @param refreshToken 刷新令牌
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<GarminTokenResponse> {
  const { clientId, clientSecret } = getGarminCredentials();

  const response = await fetch(GARMIN_CONFIG.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/**
 * 检查 Garmin OAuth 是否已配置
 */
export function isGarminConfigured(): boolean {
  return !!(
    process.env.GARMIN_CLIENT_ID &&
    process.env.GARMIN_CLIENT_SECRET &&
    process.env.NEXT_PUBLIC_APP_URL
  );
}
