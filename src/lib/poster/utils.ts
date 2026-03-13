import { Activity } from "@/lib/db/schema";

/**
 * 格式化运动数据用于海报展示
 */
export function formatActivityData(activity: Activity) {
  // 格式化完赛时间 (HH:MM:SS)
  const hours = Math.floor((activity.durationSeconds || 0) / 3600);
  const minutes = Math.floor(((activity.durationSeconds || 0) % 3600) / 60);
  const seconds = (activity.durationSeconds || 0) % 60;

  const finishTime =
    hours > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // 格式化配速 (M:SS /km)
  const paceMinutes = Math.floor((activity.avgPaceSeconds || 0) / 60);
  const paceSeconds = (activity.avgPaceSeconds || 0) % 60;
  const avgPace = activity.avgPaceSeconds
    ? `${paceMinutes}:${paceSeconds.toString().padStart(2, "0")} /km`
    : "-";

  // 格式化距离
  const distance = activity.distanceMeters
    ? `${(activity.distanceMeters / 1000).toFixed(2)} km`
    : "-";

  // 格式化日期
  const date = activity.startTime
    ? activity.startTime.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).replace(/\//g, ".")
    : "-";

  return {
    raceName: activity.name || "运动记录",
    finishTime,
    avgPace,
    distance,
    avgHr: activity.avgHr || 0,
    maxHr: activity.maxHr || 0,
    elevationGain: activity.elevationGain || 0,
    calories: activity.calories || 0,
    date,
    polyline: activity.polyline,
    activityType: activity.activityType,
  };
}

/**
 * 格式化持续时间（用于显示）
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`;
}

/**
 * 格式化距离（用于显示）
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(2)}km`;
}

/**
 * 格式化海拔增益
 */
export function formatElevation(meters: number): string {
  return `${meters}m`;
}
