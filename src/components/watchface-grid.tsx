"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

interface WatchFace {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnailUrl: string | null;
  downloads: number;
  likes: number;
  createdAt: Date | null;
  author: {
    id: string | null;
    name: string | null;
    image: string | null;
  } | null;
}

// 小红书风格配色
const categoryColors: Record<string, string> = {
  analog: "bg-amber-100 text-amber-700",
  digital: "bg-blue-100 text-blue-700",
  hybrid: "bg-purple-100 text-purple-700",
  fitness: "bg-green-100 text-green-700",
};

// 模拟不同高度的图片（小红书风格）
const getRandomHeight = (id: string) => {
  const heights = [280, 320, 360, 400, 440];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return heights[hash % heights.length];
};

interface WatchFaceGridProps {
  initialData: WatchFace[];
  initialHasMore: boolean;
  isAuthenticated: boolean;
}

export default function WatchFaceGrid({
  initialData,
  initialHasMore,
  isAuthenticated,
}: WatchFaceGridProps) {
  const t = useTranslations();
  const [watchfaces, setWatchfaces] = useState<WatchFace[]>(initialData);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);

  // 无限滚动加载
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/watchfaces?public=true&page=${page + 1}&limit=12`);
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setWatchfaces((prev) => [...prev, ...data.data]);
        setHasMore(data.hasMore);
        setPage((p) => p + 1);
      }
    } catch (error) {
      console.error("Error fetching watchfaces:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Intersection Observer 实现无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const handleLike = async (e: React.MouseEvent, watchFaceId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchFaceId }),
      });
      if (res.ok) {
        setWatchfaces((prev) =>
          prev.map((wf) =>
            wf.id === watchFaceId ? { ...wf, likes: wf.likes + 1 } : wf
          )
        );
      }
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  if (watchfaces.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t("home.noWorks")}</h3>
        <p className="text-muted-foreground">{t("home.noWorksDesc")}</p>
        <Link href="/upload">
          <Button className="mt-4 rounded-full">{t("home.uploadWatchface")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 小红书风格瀑布流布局 */}
      <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3">
        {watchfaces.map((wf, index) => {
          const imageHeight = getRandomHeight(wf.id);
          
          return (
            <Link
              key={wf.id}
              href={`/watchface/${wf.id}`}
              className="block mb-3 break-inside-avoid group"
            >
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl bg-white dark:bg-gray-900">
                {/* 图片区域 */}
                <div
                  className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                  style={{ height: `${imageHeight}px` }}
                >
                  {wf.thumbnailUrl ? (
                    <img
                      src={wf.thumbnailUrl}
                      alt={wf.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* 分类标签 - 右上角 */}
                  <Badge
                    className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full border-0 ${
                      categoryColors[wf.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t(`watchfaces.categories.${wf.category}`) || wf.category}
                  </Badge>
                </div>

                {/* 内容区域 */}
                <div className="p-3">
                  {/* 标题 */}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {wf.name}
                  </h3>

                  {/* 作者和互动 */}
                  <div className="flex items-center justify-between">
                    {/* 作者头像 */}
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        {wf.author?.image ? (
                          <img
                            src={wf.author.image}
                            alt={wf.author.name || ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            {wf.author?.name?.[0] || "U"}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {wf.author?.name || t("watchfaceDetail.anonymous")}
                      </span>
                    </div>

                    {/* 点赞数 */}
                    <button
                      onClick={(e) => handleLike(e, wf.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{wf.likes > 999 ? `${(wf.likes / 1000).toFixed(1)}k` : wf.likes}</span>
                    </button>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 加载状态 / 无限滚动触发器 */}
      <div ref={observerRef} className="py-8">
        {loading && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">{t("home.loading")}</span>
          </div>
        )}
        {!hasMore && watchfaces.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">{t("home.noMore")}</p>
        )}
      </div>
    </div>
  );
}
