import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, Heart, Download, Activity, Image, User } from "lucide-react";

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
              <Link href="/activities">
                <Button variant="ghost" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  运动记录
                </Button>
              </Link>
              <Link href="/poster/create">
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  创建海报
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  上传表盘
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  个人中心
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          运动成就，值得铭记
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          绑定佳明账号，同步运动数据，生成精美海报，让每一次比赛都值得被铭记
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/activities">
            <Button size="lg">
              <Activity className="w-5 h-5 mr-2" />
              查看运动记录
            </Button>
          </Link>
          <Link href="/poster/create">
            <Button variant="outline" size="lg">
              <Image className="w-5 h-5 mr-2" />
              创建海报
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">运动数据同步</h3>
            <p className="text-muted-foreground">
              绑定佳明账号，自动同步跑步、骑行、游泳等运动数据
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">精美海报生成</h3>
            <p className="text-muted-foreground">
              4套核心模板，成就/极简/艺术/越野风格任选
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">一键分享</h3>
            <p className="text-muted-foreground">
              高清图片导出，轻松分享到社交媒体
            </p>
          </Card>
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
