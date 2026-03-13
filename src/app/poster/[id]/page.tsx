"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { renderPoster } from "@/lib/poster/renderers";
import { canvasToDataURL } from "@/lib/poster/canvas";

interface Poster {
  id: string;
  title: string;
  imageUrl: string;
  customText: string;
  template: {
    id: number;
    name: string;
    key: string;
  };
  activity: {
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
    polyline?: string;
  };
}

export default function PosterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poster, setPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await fetch(`/api/posters/${params.id}`);
        const data = await res.json();
        setPoster(data.poster);
      } catch (error) {
        console.error("Failed to fetch poster:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPoster();
    }
  }, [params.id]);

  // 渲染海报
  useEffect(() => {
    if (poster && poster.activity) {
      setRendering(true);

      // 使用 setTimeout 确保 DOM 已渲染
      setTimeout(() => {
        try {
          const canvas = renderPoster(poster.template.key, {
            activity: poster.activity as any,
            customText: poster.customText,
          });

          const url = canvasToDataURL(canvas);
          setImageUrl(url);

          // 更新数据库中的图片 URL
          fetch(`/api/posters/${poster.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: url }),
          });
        } catch (error) {
          console.error("Failed to render poster:", error);
        } finally {
          setRendering(false);
        }
      }, 100);
    }
  }, [poster]);

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.download = `poster-${poster?.id}.png`;
    link.href = imageUrl;
    link.click();
  };

  const handleShare = async () => {
    if (!poster) return;

    try {
      await fetch("/api/posters/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posterId: poster.id }),
      });
    } catch (error) {
      console.error("Failed to record share:", error);
    }

    // 使用 Web Share API
    if (navigator.share && imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "poster.png", { type: "image/png" });

        await navigator.share({
          title: poster.title || "运动海报",
          files: [file],
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      alert("已复制链接，可以分享给好友");
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这张海报吗？")) return;

    try {
      await fetch(`/api/posters/${poster?.id}`, { method: "DELETE" });
      router.push("/my-posters");
    } catch (error) {
      console.error("Failed to delete poster:", error);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">加载中...</div>;
  }

  if (!poster) {
    return (
      <div className="container mx-auto py-8">
        <p>海报不存在</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← 返回
        </Button>
      </div>

      {/* 海报预览 */}
      <div className="bg-muted rounded-lg overflow-hidden mb-6">
        {rendering ? (
          <div className="aspect-[9/16] flex items-center justify-center">
            渲染中...
          </div>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={poster.title || "海报"}
            className="w-full h-auto"
          />
        ) : (
          <div className="aspect-[9/16] flex items-center justify-center">
            渲染失败
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button onClick={handleDownload} disabled={!imageUrl}>
          下载图片
        </Button>
        <Button variant="outline" onClick={handleShare} disabled={!imageUrl}>
          分享
        </Button>
      </div>

      <Button
        variant="destructive"
        className="w-full"
        onClick={handleDelete}
      >
        删除海报
      </Button>

      {/* 海报信息 */}
      <div className="mt-6 text-sm text-muted-foreground">
        <p>模板：{poster.template?.name}</p>
        <p>运动：{poster.activity?.name}</p>
      </div>
    </div>
  );
}
