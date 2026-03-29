"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
}

interface AuthorCardProps {
  author: Author;
  currentUserId: string | undefined;
  isAuthenticated: boolean;
}

export default function AuthorCard({
  author,
  currentUserId,
}: AuthorCardProps) {
  const t = useTranslations("watchfaceDetail");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 不能关注自己
  const isSelf = currentUserId === author.id;

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        const res = await fetch(`/api/follows?followingId=${author.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsFollowing(false);
        }
      } else {
        const res = await fetch("/api/follows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followingId: author.id }),
        });
        if (res.ok) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {author.image ? (
            <img
              src={author.image}
              alt={author.name || ""}
              className="w-12 h-12 object-cover"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium">{author.name || t("anonymous")}</p>
          {author.bio && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {author.bio}
            </p>
          )}
        </div>
        {!isSelf && (
          <Button
            variant={isFollowing ? "outline" : "default"}
            onClick={handleFollow}
            disabled={isLoading}
          >
            {isFollowing ? (
              <>
                <Users className="w-4 h-4 mr-2" />
                {t("following")}
              </>
            ) : (
              t("follow")
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
