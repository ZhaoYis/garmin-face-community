import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import type { UserRole } from "@/lib/db/schema";

// 路由权限配置
const ROUTE_PERMISSIONS: Record<string, { permission?: keyof typeof PERMISSIONS; requireLogin?: boolean }> = {
  // 需要登录的路由
  "/profile": { requireLogin: true },
  "/activities": { requireLogin: true },
  "/my-posters": { requireLogin: true },
  "/poster/create": { requireLogin: true },

  // 创作者路由
  "/watchfaces": { permission: "UPLOAD_WATCHFACE" },

  // 管理员路由
  "/admin": { permission: "ACCESS_ADMIN" },
};

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole: UserRole = req.auth?.user?.role || "guest";
  const { nextUrl } = req;

  // 检查每个路由配置
  for (const [route, config] of Object.entries(ROUTE_PERMISSIONS)) {
    if (nextUrl.pathname.startsWith(route)) {
      // 需要登录
      if (config.requireLogin && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/signin", nextUrl));
      }

      // 需要特定权限
      if (config.permission && !hasPermission(userRole, PERMISSIONS[config.permission])) {
        return NextResponse.redirect(new URL("/forbidden", nextUrl));
      }

      break;
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/activities/:path*",
    "/my-posters/:path*",
    "/poster/create/:path*",
    "/watchfaces/:path*",
    "/admin/:path*",
  ],
};
