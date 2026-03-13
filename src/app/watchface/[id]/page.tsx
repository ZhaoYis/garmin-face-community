import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Heart, Share2, User } from "lucide-react";

// 模拟数据
const mockWatchFace = {
  id: "1",
  name: "极简商务",
  description: "这是一款简约风格的商务表盘，适合日常办公和正式场合佩戴。设计简洁大方，信息显示清晰易读。",
  category: "analog",
  tags: ["简约", "商务", "经典"],
  thumbnail: "/placeholder-watchface.jpg",
  downloads: 1234,
  likes: 567,
  author: {
    name: "设计师A",
    avatar: "/placeholder-avatar.jpg",
  },
  createdAt: "2026-03-13",
  fileSize: "2.5 MB",
  rating: 4.5,
};

export default function WatchFaceDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Garmin 表盘社区
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/upload">
                <Button>上传表盘</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">个人中心</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Preview */}
          <div>
            <Card>
              <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                <span className="text-muted-foreground">表盘预览</span>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                    <Button variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      收藏
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Info */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{mockWatchFace.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <Badge>{mockWatchFace.category}</Badge>
              {mockWatchFace.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-6">
              {mockWatchFace.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">下载量</span>
                <span className="font-medium">{mockWatchFace.downloads}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">点赞数</span>
                <span className="font-medium">{mockWatchFace.likes}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">文件大小</span>
                <span className="font-medium">{mockWatchFace.fileSize}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">发布时间</span>
                <span className="font-medium">{mockWatchFace.createdAt}</span>
              </div>
            </div>

            {/* Author */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">{mockWatchFace.author.name}</p>
                    <p className="text-sm text-muted-foreground">创作者</p>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    关注
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
