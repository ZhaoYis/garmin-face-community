import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Heart, Download } from "lucide-react";

// 模拟数据（实际应从数据库获取）
const mockWatchFaces = [
  {
    id: "1",
    name: "极简商务",
    thumbnail: "/placeholder-watchface.jpg",
    category: "analog",
    downloads: 1234,
    likes: 567,
    author: "设计师A",
  },
  {
    id: "2",
    name: "运动达人",
    thumbnail: "/placeholder-watchface.jpg",
    category: "fitness",
    downloads: 2345,
    likes: 890,
    author: "设计师B",
  },
  {
    id: "3",
    name: "数字时钟",
    thumbnail: "/placeholder-watchface.jpg",
    category: "digital",
    downloads: 3456,
    likes: 1234,
    author: "设计师C",
  },
];

const categories = [
  { value: "all", label: "全部" },
  { value: "analog", label: "模拟表盘" },
  { value: "digital", label: "数字表盘" },
  { value: "hybrid", label: "混合表盘" },
  { value: "fitness", label: "运动表盘" },
];

export default function HomePage() {
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
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  上传表盘
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">个人中心</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          发现精美的 Garmin 表盘
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          上传、下载、分享你喜爱的表盘设计
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="搜索表盘..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={cat.value === "all" ? "default" : "outline"}
              className="cursor-pointer"
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Watch Faces Grid */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">热门表盘</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWatchFaces.map((face) => (
            <Link key={face.id} href={`/watchface/${face.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                  <span className="text-muted-foreground">表盘预览</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{face.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {face.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {face.likes}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Garmin Face Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
