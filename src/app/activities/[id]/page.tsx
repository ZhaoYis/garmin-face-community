"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  avgHr: number;
  maxHr: number;
  elevationGain: number;
  calories: number;
  polyline?: string;
}

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`/api/activities/${params.id}`);
        const data = await res.json();
        setActivity(data.activity);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchActivity();
    }
  }, [params.id]);

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
    return `${m}:${s.toString().padStart(2, "0")} /km`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const getActivityTypeLabel = (type: string) => {
    const key = `activities.activityTypes.${type}` as const;
    try {
      return t(key);
    } catch {
      return type;
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">{t("common.loading")}</div>;
  }

  if (!activity) {
    return (
      <div className="container mx-auto py-8">
        <p>{t("activities.unnamedActivity")}</p>
        <Button className="mt-4" onClick={() => router.push("/activities")}>
          {t("common.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          ← {t("common.back")}
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {activity.name || t("activities.unnamedActivity")}
            </CardTitle>
            <Badge className="text-base px-4 py-1">
              {getActivityTypeLabel(activity.activityType)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{formatDate(activity.startTime)}</p>
        </CardHeader>
        <CardContent>
          {/* 核心数据 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-4xl font-bold text-primary">
                {formatDistance(activity.distanceMeters)}
              </p>
              <p className="text-muted-foreground mt-1">{t("activities.distance")}</p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-4xl font-bold text-primary">
                {formatDuration(activity.durationSeconds)}
              </p>
              <p className="text-muted-foreground mt-1">{t("activities.duration")}</p>
            </div>
          </div>

          {/* 详细数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground text-sm">{t("activities.pace")}</p>
              <p className="text-xl font-semibold">
                {formatPace(activity.avgPaceSeconds)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground text-sm">{t("activities.heartRate")}</p>
              <p className="text-xl font-semibold">
                {activity.avgHr ? `${activity.avgHr} bpm` : "-"}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground text-sm">最大心率</p>
              <p className="text-xl font-semibold">
                {activity.maxHr ? `${activity.maxHr} bpm` : "-"}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground text-sm">{t("activities.elevation")}</p>
              <p className="text-xl font-semibold">
                {activity.elevationGain ? `${activity.elevationGain} m` : "-"}
              </p>
            </div>
          </div>

          {activity.calories && (
            <div className="mt-4 p-4 border rounded-lg">
              <p className="text-muted-foreground text-sm">消耗卡路里</p>
              <p className="text-xl font-semibold">{activity.calories} kcal</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={() => router.push(`/poster/create?activityId=${activity.id}`)}
      >
        {t("poster.generate")}
      </Button>
    </div>
  );
}
