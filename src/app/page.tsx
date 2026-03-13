import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Activity, Image } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t("home.subtitle")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("home.description")}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/activities">
            <Button size="lg">
              <Activity className="w-5 h-5 mr-2" />
              {t("nav.activities")}
            </Button>
          </Link>
          <Link href="/poster/create">
            <Button variant="outline" size="lg">
              <Image className="w-5 h-5 mr-2" />
              {t("nav.createPoster")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">{t("home.features.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.features.syncData")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.syncDataDesc")}
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.features.generatePoster")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.generatePosterDesc")}
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("home.features.sharePoster")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.sharePosterDesc")}
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Garmin Face Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
