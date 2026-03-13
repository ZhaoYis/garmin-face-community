import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <ShieldX className="h-24 w-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">403 禁止访问</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          您没有权限访问此页面。如果您认为这是一个错误，请联系管理员。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline">更换账号登录</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
