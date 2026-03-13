import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ForbiddenPage() {
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <ShieldX className="h-24 w-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">{t("forbidden.title")}</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          {t("forbidden.description")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button>{t("forbidden.backHome")}</Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline">{t("forbidden.changeAccount")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
