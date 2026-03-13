import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default async function UploadPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              上传表盘
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">表盘名称</label>
                <Input placeholder="给你的表盘起个名字" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">表盘描述</label>
                <Textarea
                  placeholder="描述一下你的表盘设计..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">分类</label>
                <select className="w-full px-3 py-2 rounded-md border bg-background">
                  <option value="analog">模拟表盘</option>
                  <option value="digital">数字表盘</option>
                  <option value="hybrid">混合表盘</option>
                  <option value="fitness">运动表盘</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">标签</label>
                <Input placeholder="用逗号分隔多个标签，如：简约,运动,商务" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">缩略图</label>
                <Input type="file" accept="image/*" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">表盘文件</label>
                <Input type="file" accept=".watchface,.zip" required />
              </div>

              <Button type="submit" className="w-full">
                提交审核
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
