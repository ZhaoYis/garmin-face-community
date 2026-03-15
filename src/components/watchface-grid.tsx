"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Download, Eye, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

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

// 静态模拟数据（作为后备）
const mockWatchFaces: WatchFace[] = [
  {
    id: "1",
    name: "极简商务",
    description: "简约风格的商务表盘，适合日常办公和正式场合佩戴。设计简洁大方，信息显示清晰易读。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch1/400/400",
    downloads: 1234,
    likes: 567,
    createdAt: new Date(),
    author: { id: "1", name: "设计师小王", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang" },
  },
  {
    id: "2",
    name: "运动数据面板",
    description: "专为运动爱好者设计的数字表盘，实时显示心率、步数、卡路里等运动数据。",
    category: "fitness",
    thumbnailUrl: "https://picsum.photos/seed/watch2/400/400",
    downloads: 2345,
    likes: 890,
    createdAt: new Date(),
    author: { id: "2", name: "表盘达人", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=daren" },
  },
  {
    id: "3",
    name: "数字时钟",
    description: "简洁的数字时钟表盘，大字体显示时间，支持24小时制。",
    category: "digital",
    thumbnailUrl: "https://picsum.photos/seed/watch3/400/400",
    downloads: 3456,
    likes: 1234,
    createdAt: new Date(),
    author: { id: "3", name: "运动爱好者", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sports" },
  },
  {
    id: "4",
    name: "经典指针",
    description: "经典指针表盘设计，模拟传统手表外观，优雅大气。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch4/400/400",
    downloads: 1567,
    likes: 456,
    createdAt: new Date(),
    author: { id: "4", name: "极简主义", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimal" },
  },
];

interface WatchFaceGridProps {
  initialData: WatchFace[];
  initialHasMore: boolean;
  isAuthenticated: boolean;
}

const categoryNames: Record<string, string> = {
  analog: "模拟",
  digital: "数字",
  hybrid: "混合",
  fitness: "运动",
};

export default function WatchFaceGrid({
  initialData,
  initialHasMore,
  isAuthenticated,
}: WatchFaceGridProps) {
  const router = useRouter();
  const [watchfaces, setWatchfaces] = useState<WatchFace[]>(initialData.length > 0 ? initialData : mockWatchFaces);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  // 如果没有初始数据，尝试从 API 获取
  useEffect(() => {
    if (initialData.length === 0) {
      fetchWatchfaces();
    }
  }, [initialData.length]);

  const fetchWatchfaces = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/watchfaces?public=true");
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setWatchfaces(data.data);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error fetching watchfaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, watchFaceId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ watchFaceId }),
      });
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {watchfaces.map((wf) => (
          <Link key={wf.id} href={`/watchface/${wf.id}`}>
            <Card className="break-inside-avoid group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-muted">
                {wf.thumbnailUrl ? (
                  <img
                    src={wf.thumbnailUrl}
                    alt={wf.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm line-clamp-2">
                      {wf.description || "暂无描述"}
                    </p>
                  </div>
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-2 left-2">
                  {categoryNames[wf.category] || wf.category}
                </Badge>
              </div>

              <CardContent className="p-4">
                {/* Title */}
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {wf.name}
                </h3>

                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-muted overflow-hidden">
                    {wf.author?.image ? (
                      <img
                        src={wf.author.image}
                        alt={wf.author.name || ""}
                        className="w-6 h-6 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center text-xs">
                        {wf.author?.name?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {wf.author?.name || "匿名用户"}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleLike(e, wf.id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {wf.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {wf.downloads}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-8">
          <Button variant="outline" size="lg" disabled={loading}>
            {loading ? "加载中..." : "加载更多"}
            {!loading && <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {watchfaces.length === 0 && !loading && (
        <div className="text-center py-16">
          <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">暂无作品</h3>
          <p className="text-muted-foreground">
            成为第一个上传表盘的创作者吧！
          </p>
          <Link href="/upload">
            <Button className="mt-4">上传表盘</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
