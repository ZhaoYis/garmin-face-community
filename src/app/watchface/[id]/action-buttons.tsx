"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  watchFaceId: string;
  liked: boolean;
  favorited: boolean;
  likes: number;
  downloads: number;
  fileUrl: string;
  isAuthenticated: boolean;
}

export default function ActionButtons({
  watchFaceId,
  liked: initialLiked,
  favorited: initialFavorited,
  likes: initialLikes,
  downloads,
  fileUrl,
  isAuthenticated,
}: ActionButtonsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      if (liked) {
        const res = await fetch(`/api/likes?watchFaceId=${watchFaceId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setLiked(false);
          setLikes((prev) => prev - 1);
        }
      } else {
        const res = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ watchFaceId }),
        });
        if (res.ok) {
          setLiked(true);
          setLikes((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);
    try {
      if (favorited) {
        const res = await fetch(`/api/favorites?watchFaceId=${watchFaceId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setFavorited(false);
        }
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ watchFaceId }),
        });
        if (res.ok) {
          setFavorited(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "分享表盘",
          url,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("链接已复制到剪贴板");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button className="flex-1">
          <a href={fileUrl} download className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            下载 ({downloads})
          </a>
        </Button>
        <Button
          variant={liked ? "default" : "outline"}
          onClick={handleLike}
          disabled={isLoading}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`}
          />
          {likes}
        </Button>
        <Button
          variant={favorited ? "default" : "outline"}
          onClick={handleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`w-4 h-4 mr-2 ${favorited ? "fill-current text-red-500" : ""}`}
          />
          {favorited ? "已收藏" : "收藏"}
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={handleShare}>
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
