import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Activity } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Header() {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">{t("home.title")}</span>
        </Link>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/watchfaces"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("watchfaces.title")}
          </Link>
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
          <Link
            href="/upload"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("upload.title")}
          </Link>
          <Link
            href="/profile"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("nav.profile")}
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
