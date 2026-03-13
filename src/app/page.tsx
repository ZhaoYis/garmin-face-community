import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Activity, Image } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
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
