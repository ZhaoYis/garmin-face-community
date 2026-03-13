"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const categories = [
  { value: "analog", label: "模拟表盘" },
  { value: "digital", label: "数字表盘" },
  { value: "hybrid", label: "混合表盘" },
  { value: "fitness", label: "运动表盘" },
];

interface WatchfaceUploadFormProps {
  userId: string;
}

export function WatchfaceUploadForm({ userId }: WatchfaceUploadFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.name || !formData.category) {
      alert("请填写所有必填项");
      return;
    }

    // 文件格式验证
    const validExtensions = [".garmin", ".prg"];
    const fileName = formData.file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));
    if (!isValid) {
      alert("只支持 .garmin 或 .prg 格式的文件");
      return;
    }

    // 文件大小验证 (10MB)
    if (formData.file.size > 10 * 1024 * 1024) {
      alert("文件大小不能超过 10MB");
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
        alert("上传成功，等待审核");
        router.push("/watchfaces/my");
      } else {
        const error = await response.json();
        alert(error.message || "上传失败");
      }
    } catch {
      alert("上传失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">表盘名称 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="请输入表盘名称"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">分类 *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
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
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="描述你的表盘特点..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">表盘文件 *</Label>
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
              点击上传或拖拽文件到此处
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              支持 .garmin, .prg 格式，最大 10MB
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
            上传中...
          </>
        ) : (
          "提交上传"
        )}
      </Button>
    </form>
  );
}
