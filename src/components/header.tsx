import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./user-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Activity, LogIn } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const t = await getTranslations();

  // 尝试获取用户会话，如果数据库不可用则优雅降级
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    // 数据库不可用时，session 为 null，用户显示为未登录状态
    console.error("Failed to get session:", error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">{t("home.title")}</span>
        </Link>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/activities"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("nav.activities")}
          </Link>
          <Link
            href="/poster/create"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("nav.createPoster")}
          </Link>
          <Link
            href="/my-posters"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("nav.myPosters")}
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                {t("auth.signIn")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
