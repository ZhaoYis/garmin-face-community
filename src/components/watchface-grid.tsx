"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Download, Eye, ChevronDown } from "lucide-react";
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

// 静态模拟数据（当数据库无数据时使用）
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
    description: "简洁的数字时钟表盘，大字体显示时间，支持24小时制，夜间模式自动调节亮度。",
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
    description: "经典指针表盘设计，模拟传统手表外观，优雅大气，适合各种场合佩戴。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch4/400/400",
    downloads: 1567,
    likes: 456,
    createdAt: new Date(),
    author: { id: "4", name: "极简主义", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimal" },
  },
  {
    id: "5",
    name: "混合时尚",
    description: "结合模拟指针和数字显示的混合表盘，既保留传统美感又兼顾现代实用性。",
    category: "hybrid",
    thumbnailUrl: "https://picsum.photos/seed/watch5/400/400",
    downloads: 987,
    likes: 321,
    createdAt: new Date(),
    author: { id: "1", name: "设计师小王", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang" },
  },
  {
    id: "6",
    name: "户外探险",
    description: "专为户外探险设计的表盘，显示海拔、气压、指南针等户外信息，支持GPS轨迹记录。",
    category: "fitness",
    thumbnailUrl: "https://picsum.photos/seed/watch6/400/400",
    downloads: 765,
    likes: 234,
    createdAt: new Date(),
    author: { id: "2", name: "表盘达人", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=daren" },
  },
  {
    id: "7",
    name: "极简数字",
    description: "极简主义数字表盘，只显示最基本的时间信息，界面干净清爽，非常省电。",
    category: "digital",
    thumbnailUrl: "https://picsum.photos/seed/watch7/400/400",
    downloads: 4567,
    likes: 1567,
    createdAt: new Date(),
    author: { id: "3", name: "运动爱好者", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sports" },
  },
  {
    id: "8",
    name: "科技感",
    description: "充满科技感的表盘设计，动态效果炫酷，显示丰富的系统信息，适合科技爱好者。",
    category: "hybrid",
    thumbnailUrl: "https://picsum.photos/seed/watch8/400/400",
    downloads: 678,
    likes: 189,
    createdAt: new Date(),
    author: { id: "4", name: "极简主义", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimal" },
  },
  {
    id: "9",
    name: "复古经典",
    description: "复古风格的指针表盘，仿古铜色设计，带有岁月沉淀的质感，适合怀旧风格爱好者。",
    category: "analog",
    thumbnailUrl: "https://picsum.photos/seed/watch9/400/400",
    downloads: 543,
    likes: 167,
    createdAt: new Date(),
    author: { id: "1", name: "设计师小王", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang" },
  },
  {
    id: "10",
    name: "健身追踪",
    description: "健身追踪专用表盘，实时显示运动目标完成度，支持多种健身模式，激励你达成目标。",
    category: "fitness",
    thumbnailUrl: "https://picsum.photos/seed/watch10/400/400",
    downloads: 1890,
    likes: 567,
    createdAt: new Date(),
    author: { id: "2", name: "表盘达人", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=daren" },
  },
  {
    id: "11",
    name: "夜光数字",
    description: "夜间模式优化的数字表盘，支持自动亮度调节，清晰易读不刺眼。",
    category: "digital",
    thumbnailUrl: "https://picsum.photos/seed/watch11/400/400",
    downloads: 2341,
    likes: 789,
    createdAt: new Date(),
    author: { id: "3", name: "运动爱好者", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sports" },
  },
  {
    id: "12",
    name: "城市脉搏",
    description: "现代都市风格的混合表盘，结合天气、日程提醒等实用功能，是都市白领的理想选择。",
    category: "hybrid",
    thumbnailUrl: "https://picsum.photos/seed/watch12/400/400",
    downloads: 1122,
    likes: 345,
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
  // 如果没有数据库数据，使用模拟数据
  const [watchfaces] = useState(initialData.length > 0 ? initialData : mockWatchFaces);
  const [hasMore] = useState(initialData.length > 0 ? initialHasMore : false);

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
            disabled
          >
            加载更多
            <ChevronDown className="w-4 h-4 ml-2" />
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
