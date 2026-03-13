"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Poster {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
  viewCount: number;
  shareCount: number;
  activity?: {
    id: string;
    name: string;
    activityType: string;
  };
  template?: {
    id: number;
    name: string;
    key: string;
  };
}

export default function MyPostersPage() {
  const router = useRouter();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch("/api/posters");
        const data = await res.json();
        setPosters(data.posters || []);
      } catch (error) {
        console.error("Failed to fetch posters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

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
        <h1 className="text-2xl font-bold">我的海报</h1>
        <Button onClick={() => router.push("/poster/create")}>
          创建新海报
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">加载中...</div>
      ) : posters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">暂无海报</p>
          <Button onClick={() => router.push("/poster/create")}>
            创建第一张海报
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posters.map((poster) => (
            <Card
              key={poster.id}
              className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
              onClick={() => router.push(`/poster/${poster.id}`)}
            >
              <div className="aspect-[9/16] bg-muted relative">
                {poster.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poster.imageUrl}
                    alt={poster.title || "海报"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    无预览
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-medium truncate">
                  {poster.title || poster.activity?.name || "未命名海报"}
                </p>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatDate(poster.createdAt)}</span>
                  <span>分享 {poster.shareCount || 0}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
