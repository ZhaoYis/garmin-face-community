"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Download, Eye, Star, ChevronDown } from "lucide-react";
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
  const [watchfaces, setWatchfaces] = useState(initialData);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/watchfaces?page=${page + 1}`);
      const data = await res.json();

      if (data.data) {
        setWatchfaces([...watchfaces, ...data.data]);
        setHasMore(data.hasMore);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error loading more:", error);
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
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center py-8">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? (
              "加载中..."
            ) : (
              <>
                加载更多
                <ChevronDown className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {watchfaces.length === 0 && (
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
