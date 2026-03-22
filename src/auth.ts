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

// 检查必要的环境变量
function checkRequiredEnvVars() {
  const missing: string[] = [];

  if (!process.env.AUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }
  if (!process.env.POSTGRES_URL) {
    missing.push("POSTGRES_URL");
  }

  return missing;
}

const missingEnvVars = checkRequiredEnvVars();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 检查环境变量是否配置
      if (missingEnvVars.length > 0) {
        console.error("Missing required environment variables:", missingEnvVars);
        return false;
      }

      try {
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
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
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
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, ...message) {
      console.error("NextAuth Error:", code, ...message);
    },
    warn(code, ...message) {
      console.warn("NextAuth Warning:", code, ...message);
    },
    debug(code, ...message) {
      if (process.env.NODE_ENV === "development") {
        console.debug("NextAuth Debug:", code, ...message);
      }
    },
  },
});
