"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  activityType: string;
  name: string;
  startTime: Date;
  durationSeconds: number;
  distanceMeters: number;
  avgPaceSeconds: number;
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  running: "跑步",
  cycling: "骑行",
  swimming: "游泳",
  trail: "越野",
};

export default function ActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/activities/sync", { method: "POST" });
      const data = await res.json();

      if (data.error === "Garmin not connected") {
        alert("请先绑定佳明账号");
        router.push("/profile");
        return;
      }

      if (data.success) {
        alert(`同步成功！新增 ${data.synced} 条记录`);
        fetchActivities();
      }
    } catch (error) {
      console.error("Failed to sync:", error);
      alert("同步失败，请稍后重试");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + " km";
  };

  const formatPace = (seconds: number) => {
    if (!seconds) return "-";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}/km`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">运动记录</h1>
        <Button onClick={handleSync} disabled={syncing}>
          {syncing ? "同步中..." : "同步数据"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">加载中...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">暂无运动记录</p>
          <Button onClick={handleSync} disabled={syncing}>
            同步 Garmin 数据
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/activities/${activity.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {activity.name || "未命名活动"}
                  </CardTitle>
                  <Badge>
                    {ACTIVITY_TYPE_LABELS[activity.activityType] ||
                      activity.activityType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">日期</p>
                    <p className="font-medium">{formatDate(activity.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">距离</p>
                    <p className="font-medium">
                      {formatDistance(activity.distanceMeters)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">时长</p>
                    <p className="font-medium">
                      {formatDuration(activity.durationSeconds)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">配速</p>
                    <p className="font-medium">
                      {formatPace(activity.avgPaceSeconds)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
