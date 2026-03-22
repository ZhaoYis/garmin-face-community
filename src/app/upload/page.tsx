import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function UploadPage() {
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {t("upload.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.name")}</label>
                <Input placeholder={t("upload.namePlaceholder")} required />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.description")}</label>
                <Textarea
                  placeholder={t("upload.descriptionPlaceholder")}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.category")}</label>
                <select className="w-full px-3 py-2 rounded-md border bg-background">
                  <option value="analog">{t("watchfaces.categories.analog")}</option>
                  <option value="digital">{t("watchfaces.categories.digital")}</option>
                  <option value="hybrid">{t("watchfaces.categories.hybrid")}</option>
                  <option value="fitness">{t("watchfaces.categories.fitness")}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">标签</label>
                <Input placeholder={t("upload.tagsPlaceholder")} />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">缩略图</label>
                <Input type="file" accept="image/*" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.file")}</label>
                <Input type="file" accept=".watchface,.zip" required />
              </div>

              <Button type="submit" className="w-full">
                {t("common.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
