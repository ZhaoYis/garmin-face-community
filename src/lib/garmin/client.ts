import { GARMIN_CONFIG, GarminActivity } from "./types";

/**
 * Garmin API 客户端
 */
export class GarminClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * 获取运动记录列表
   * @param limit 返回记录数量限制
   * @param startDay 开始日期 (YYYY-MM-DD)
   * @param endDay 结束日期 (YYYY-MM-DD)
   */
  async getActivities(
    limit: number = 50,
    startDay?: string,
    endDay?: string
  ): Promise<GarminActivity[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    if (startDay) params.set("startDate", startDay);
    if (endDay) params.set("endDate", endDay);

    const response = await fetch(
      `${GARMIN_CONFIG.apiBaseUrl}/wellness/wellness-api/rest/activities?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token expired or invalid");
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded");
      }
      const error = await response.text();
      throw new Error(`Failed to fetch activities: ${error}`);
    }

    return response.json();
  }

  /**
   * 获取单条运动记录详情
   * @param activityId 运动记录 ID
   */
  async getActivityById(activityId: string): Promise<GarminActivity> {
    const response = await fetch(
      `${GARMIN_CONFIG.apiBaseUrl}/wellness/wellness-api/rest/activities/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token expired or invalid");
      }
      const error = await response.text();
      throw new Error(`Failed to fetch activity: ${error}`);
    }

    return response.json();
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<{ userId: string }> {
    const response = await fetch(
      `${GARMIN_CONFIG.apiBaseUrl}/wellness/wellness-api/rest/user`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return response.json();
  }
}

/**
 * 格式化 Garmin 运动数据为本地存储格式
 */
export function formatGarminActivity(activity: GarminActivity) {
  // 计算平均配速（秒/公里）
  let avgPaceSeconds = 0;
  if (activity.distanceMeters > 0 && activity.averageSpeed > 0) {
    // averageSpeed 是 m/s，配速是秒/公里
    avgPaceSeconds = Math.round(1000 / activity.averageSpeed);
  }

  return {
    garminActivityId: activity.activityId,
    activityType: activity.activityType?.typeKey || "unknown",
    name: activity.activityName || "未命名活动",
    startTime: new Date(activity.startTimeLocal || activity.startTimeGMT),
    durationSeconds: Math.round(activity.durationSeconds),
    distanceMeters: Math.round(activity.distanceMeters),
    avgPaceSeconds,
    avgHr: Math.round(activity.averageHeartRate) || null,
    maxHr: Math.round(activity.maxHeartRate) || null,
    elevationGain: Math.round(activity.totalElevationGain) || null,
    calories: Math.round(activity.calories) || null,
    polyline: activity.geoPolylineDTO?.polyline || null,
  };
}
