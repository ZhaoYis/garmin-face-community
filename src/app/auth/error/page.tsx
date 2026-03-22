"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "认证配置错误，请联系管理员",
    AccessDenied: "访问被拒绝，您没有权限登录",
    Verification: "验证链接已过期或已使用",
    Default: "登录时发生错误，请重试",
    OAuthSignin: "OAuth 登录失败，请重试",
    OAuthCallback: "OAuth 回调处理失败，请重试",
    OAuthCreateAccount: "创建账户失败，请重试",
    EmailCreateAccount: "创建账户失败，请重试",
    Callback: "回调处理失败，请重试",
    OAuthAccountNotLinked: "该账户已与其他用户关联",
    EmailSignin: "发送登录邮件失败，请重试",
    CredentialsSignin: "用户名或密码错误",
    SessionRequired: "请先登录以访问此页面",
  };

  const errorMessage = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl">登录失败</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-gray-100 rounded text-sm text-gray-600 font-mono break-all">
              错误代码: {error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/signin">返回登录页面</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
