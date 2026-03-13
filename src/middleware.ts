import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // 保护 /profile 路由
  if (nextUrl.pathname.startsWith("/profile") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  // 保护 /upload 路由
  if (nextUrl.pathname.startsWith("/upload") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  // 保护 /admin 路由
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    // 检查是否是管理员
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/profile/:path*", "/upload/:path*", "/admin/:path*"],
};
