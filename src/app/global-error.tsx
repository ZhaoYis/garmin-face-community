"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 将错误记录到错误报告服务
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">出错了</h1>
          <p className="text-muted-foreground mb-6">
            应用遇到了一个错误。请刷新页面重试。
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="text-left bg-muted p-4 rounded-lg mb-6 text-sm overflow-auto max-w-lg">
              {error.message}
            </pre>
          )}
          <Button onClick={reset}>
            刷新页面
          </Button>
        </div>
      </body>
    </html>
  );
}
