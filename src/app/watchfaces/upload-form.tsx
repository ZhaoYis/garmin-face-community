"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";

interface WatchfaceUploadFormProps {
  userId: string;
}

export function WatchfaceUploadForm({ userId: _userId }: WatchfaceUploadFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    file: null as File | null,
  });

  const categories = [
    { value: "analog", label: t("watchfaces.categories.analog") },
    { value: "digital", label: t("watchfaces.categories.digital") },
    { value: "hybrid", label: t("watchfaces.categories.hybrid") },
    { value: "fitness", label: t("watchfaces.categories.fitness") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.name || !formData.category) {
      alert(t("watchfaces.fillRequired"));
      return;
    }

    // 文件格式验证
    const validExtensions = [".garmin", ".prg"];
    const fileName = formData.file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));
    if (!isValid) {
      alert(t("watchfaces.invalidFormat"));
      return;
    }

    // 文件大小验证 (10MB)
    if (formData.file.size > 10 * 1024 * 1024) {
      alert(t("watchfaces.fileTooLarge"));
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("file", formData.file);

      const response = await fetch("/api/watchfaces", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert(t("watchfaces.uploadSuccess"));
        router.push("/watchfaces/my");
      } else {
        const error = await response.json();
        alert(error.message || t("watchfaces.uploadFailed"));
      }
    } catch {
      alert(t("watchfaces.uploadFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">{t("watchfaces.name")} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t("watchfaces.namePlaceholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t("watchfaces.category")} *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("watchfaces.categoryPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("watchfaces.description")}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={t("watchfaces.descriptionPlaceholder")}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">{t("watchfaces.file")} *</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Input
            id="file"
            type="file"
            accept=".garmin,.prg"
            onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
            className="hidden"
          />
          <label htmlFor="file" className="cursor-pointer">
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t("watchfaces.uploadHint")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("watchfaces.uploadFormat")}
            </p>
          </label>
          {formData.file && (
            <p className="text-sm text-primary mt-2">
              已选择: {formData.file.name}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("watchfaces.uploading")}
          </>
        ) : (
          t("watchfaces.submit")
        )}
      </Button>
    </form>
  );
}
