import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { type DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/admin";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 检查是否为超级管理员
      if (isAdminEmail(user.email)) {
        // 超级管理员自动更新角色为 admin
        if (user.id) {
          await db
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.id, user.id));
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = user.role || "user";
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 获取当前用户会话
      const session = await auth();

      // 如果是超级管理员，登录后重定向到管理后台
      if (session?.user && isAdminEmail(session.user.email)) {
        // 如果 url 是登录页面或根路径，重定向到管理后台
        if (url === baseUrl || url === `${baseUrl}/auth/signin`) {
          return `${baseUrl}/admin`;
        }
      }

      // 默认重定向逻辑
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
