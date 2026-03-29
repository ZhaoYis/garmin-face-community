"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface Comment {
  id: string;
  content: string;
  rating: number | null;
  createdAt: Date | null;
  user: {
    id: string | null;
    name: string | null;
    image: string | null;
  } | null;
}

interface CommentSectionProps {
  watchFaceId: string;
  comments: Comment[];
  isAuthenticated: boolean;
}

export default function CommentSection({
  watchFaceId,
  comments: initialComments,
}: CommentSectionProps) {
  const t = useTranslations("watchfaceDetail");
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watchFaceId,
          content: content.trim(),
          rating,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([{ ...newComment, user: { id: null, name: t("anonymous"), image: null } }, ...comments]);
        setContent("");
        setRating(5);
      } else {
        const error = await res.json();
        alert(error.error || t("commentFailed"));
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert(t("commentFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t("rating")}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t("commentContent")}</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("commentPlaceholder")}
            rows={3}
          />
        </div>

        <Button type="submit" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? t("submitting") : t("postComment")}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {t("noComments")}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border rounded-lg bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {comment.user?.image ? (
                    <img
                      src={comment.user.image}
                      alt={comment.user.name || ""}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {comment.user?.name || t("anonymous")}
                    </span>
                    {comment.rating && (
                      <div className="flex gap-0.5">
                        {[...Array(comment.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </p>
                  <p className="mt-2">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
