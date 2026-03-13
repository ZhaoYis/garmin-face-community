"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
}

export default function ActivitiesPage() {
  const router = useRouter();
  const t = useTranslations();
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
        alert(t("activities.bindGarminFirst"));
        router.push("/profile");
        return;
      }

      if (data.success) {
        alert(t("activities.syncSuccess"));
        fetchActivities();
      }
    } catch (error) {
      console.error("Failed to sync:", error);
      alert(t("activities.syncFailed"));
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

  const getActivityTypeLabel = (type: string) => {
    const key = `activities.activityTypes.${type}` as const;
    try {
      return t(key);
    } catch {
      return type;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t("activities.title")}</h1>
        <Button onClick={handleSync} disabled={syncing}>
          {syncing ? t("activities.syncing") : t("activities.syncData")}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">{t("common.loading")}</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t("activities.noActivities")}</p>
          <Button onClick={handleSync} disabled={syncing}>
            {t("activities.syncData")}
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
                    {activity.name || t("activities.unnamedActivity")}
                  </CardTitle>
                  <Badge>
                    {getActivityTypeLabel(activity.activityType)}
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
                    <p className="text-muted-foreground">{t("activities.distance")}</p>
                    <p className="font-medium">
                      {formatDistance(activity.distanceMeters)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("activities.duration")}</p>
                    <p className="font-medium">
                      {formatDuration(activity.durationSeconds)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("activities.pace")}</p>
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
