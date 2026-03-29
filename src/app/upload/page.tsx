"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UploadPage() {
  const t = useTranslations();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData();

      const name = (form.elements.namedItem("name") as HTMLInputElement).value;
      const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
      const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
      const fileInput = form.elements.namedItem("file") as HTMLInputElement;

      if (!name || !category || !fileInput.files?.[0]) {
        setError(t("watchfaces.fillRequired"));
        setIsSubmitting(false);
        return;
      }

      const file = fileInput.files[0];

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("file", file);

      const res = await fetch("/api/watchfaces", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/watchfaces");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || t("watchfaces.uploadFailed"));
      }
    } catch {
      setError(t("watchfaces.uploadFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t("watchfaces.uploadSuccess")}</h2>
              <p className="text-muted-foreground">{t("common.loading")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.name")}</label>
                <Input name="name" placeholder={t("upload.namePlaceholder")} required />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.description")}</label>
                <Textarea
                  name="description"
                  placeholder={t("upload.descriptionPlaceholder")}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.category")}</label>
                <select name="category" className="w-full px-3 py-2 rounded-md border bg-background">
                  <option value="analog">{t("watchfaces.categories.analog")}</option>
                  <option value="digital">{t("watchfaces.categories.digital")}</option>
                  <option value="hybrid">{t("watchfaces.categories.hybrid")}</option>
                  <option value="fitness">{t("watchfaces.categories.fitness")}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("watchfaces.file")}</label>
                <Input name="file" type="file" accept=".garmin,.prg,.zip" required />
                <p className="text-xs text-muted-foreground mt-1">{t("watchfaces.uploadFormat")}</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("watchfaces.uploading") : t("watchfaces.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
