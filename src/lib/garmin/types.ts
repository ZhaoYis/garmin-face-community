// Garmin OAuth 配置
export const GARMIN_CONFIG = {
  // Garmin OAuth 端点
  authUrl: "https://connect.garmin.com/oauthConfirm",
  tokenUrl: "https://apis.garmin.com/oauth/oauth/token",
  apiBaseUrl: "https://apis.garmin.com",
} as const;

// Garmin 运动类型映射
export const ACTIVITY_TYPE_MAP: Record<string, string> = {
  running: "running",
  cycling: "cycling",
  mountain_biking: "cycling",
  swimming: "swimming",
  lap_swimming: "swimming",
  trail_running: "trail",
  hiking: "trail",
  walking: "running",
} as const;

// Garmin Token 响应
export interface GarminTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Garmin 运动活动
export interface GarminActivity {
  activityId: string;
  activityType: {
    typeKey: string;
    typeId: number;
  };
  activityName: string;
  startTimeLocal: string;
  startTimeGMT: string;
  durationSeconds: number;
  distanceMeters: number;
  averageSpeed: number;
  averageHeartRate: number;
  maxHeartRate: number;
  totalElevationGain: number;
  calories: number;
  geoPolylineDTO?: {
    polyline: string;
  };
}

// Garmin 用户信息
export interface GarminUserInfo {
  userId: string;
  displayName: string;
}

// 运动数据格式化结果
export interface FormattedActivityData {
  activityType: string;
  name: string;
  startTime: Date;
  durationSeconds: number;
  distanceMeters: number;
  avgPaceSeconds: number;
  avgHr: number;
  maxHr: number;
  elevationGain: number;
  calories: number;
  polyline?: string;
}
