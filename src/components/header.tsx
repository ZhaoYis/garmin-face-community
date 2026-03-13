import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./user-dropdown";
import { Activity, LogIn } from "lucide-react";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Garmin 表盘社区</span>
        </Link>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/activities"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            运动记录
          </Link>
          <Link
            href="/poster/create"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            创建海报
          </Link>
          <Link
            href="/my-posters"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            我的海报
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session?.user ? (
            <UserDropdown user={session.user} />
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                登录
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
