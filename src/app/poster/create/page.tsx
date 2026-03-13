"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Template {
  id: number;
  name: string;
  key: string;
  category: string;
}

interface Activity {
  id: string;
  name: string;
  activityType: string;
  startTime: Date;
  distanceMeters: number;
  durationSeconds: number;
}

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  achievement: "深色背景 + 金色装饰，适合马拉松完赛纪念",
  minimal: "白底 + 黑字，简约风格，适合日常训练",
  art: "渐变背景，艺术风格，适合社交媒体分享",
  trail: "大地色系，突出爬升数据，适合越野赛",
};

function PosterCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activityId");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(activityId);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customText, setCustomText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [activitiesRes, templatesRes] = await Promise.all([
        fetch("/api/activities"),
        fetch("/api/templates"),
      ]);

      const activitiesData = await activitiesRes.json();
      const templatesData = await templatesRes.json();

      setActivities(activitiesData.activities || []);
      setTemplates(templatesData.templates || []);

      // 默认选中第一个模板
      if (templatesData.templates?.length > 0) {
        setSelectedTemplate(templatesData.templates[0].id);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!selectedActivity || !selectedTemplate) {
      alert("请选择运动记录和模板");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posters/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivity,
          templateId: selectedTemplate,
          customText: customText || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // 跳转到海报预览页
        router.push(`/poster/${data.poster.id}`);
      } else {
        alert(data.error || "创建失败");
      }
    } catch (error) {
      console.error("Failed to create poster:", error);
      alert("创建失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">创建海报</h1>

      {/* 步骤1：选择运动记录 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">1. 选择运动记录</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className={`cursor-pointer transition-all ${
                selectedActivity === activity.id
                  ? "ring-2 ring-primary"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedActivity(activity.id)}
            >
              <CardContent className="p-4">
                <p className="font-medium">{activity.name || "未命名活动"}</p>
                <p className="text-sm text-muted-foreground">
                  {(activity.distanceMeters / 1000).toFixed(2)} km ·{" "}
                  {new Date(activity.startTime).toLocaleDateString("zh-CN")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 步骤2：选择模板 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">2. 选择模板</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "ring-2 ring-primary"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardContent className="p-4">
                <p className="font-medium text-center">{template.name}</p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {TEMPLATE_DESCRIPTIONS[template.key]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 步骤3：自定义标语 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">3. 自定义标语（可选）</h2>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="例如：首马破4！"
          maxLength={50}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {customText.length}/50 字符
        </p>
      </div>

      {/* 创建按钮 */}
      <Button
        className="w-full"
        size="lg"
        disabled={!selectedActivity || !selectedTemplate || loading}
        onClick={handleCreate}
      >
        {loading ? "创建中..." : "生成海报"}
      </Button>
    </div>
  );
}

export default function PosterCreatePage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-8">加载中...</div>}>
      <PosterCreateContent />
    </Suspense>
  );
}
