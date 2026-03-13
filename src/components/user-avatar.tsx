"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  className?: string;
}

/**
 * 获取用户名首字母作为 fallback
 */
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    // 取用户名的前两个字符作为首字母
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  if (email) {
    // 使用邮箱前缀的首字母
    return email[0].toUpperCase();
  }

  return "U";
}

export function UserAvatar({ image, name, email, className }: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <Avatar className={className}>
      <AvatarImage src={image || undefined} alt={name || "用户头像"} />
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
