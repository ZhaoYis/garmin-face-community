import type { UserRole } from "@/lib/db/schema";

// 权限定义
export const PERMISSIONS = {
  // 游客权限
  VIEW_TEMPLATES: "view_templates",
  VIEW_PUBLIC_POSTERS: "view_public_posters",

  // 普通用户权限
  BIND_GARMIN: "bind_garmin",
  SYNC_ACTIVITIES: "sync_activities",
  GENERATE_POSTER: "generate_poster",
  SHARE_POSTER: "share_poster",
  VIEW_MY_POSTERS: "view_my_posters",

  // 创作者权限
  UPLOAD_WATCHFACE: "upload_watchface",
  MANAGE_MY_WATCHFACES: "manage_my_watchfaces",

  // 管理员权限
  MANAGE_USERS: "manage_users",
  MANAGE_TEMPLATES: "manage_templates",
  REVIEW_WATCHFACES: "review_watchfaces",
  ACCESS_ADMIN: "access_admin",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// 角色权限映射
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.VIEW_PUBLIC_POSTERS,
  ],
  user: [
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.VIEW_PUBLIC_POSTERS,
    PERMISSIONS.BIND_GARMIN,
    PERMISSIONS.SYNC_ACTIVITIES,
    PERMISSIONS.GENERATE_POSTER,
    PERMISSIONS.SHARE_POSTER,
    PERMISSIONS.VIEW_MY_POSTERS,
  ],
  creator: [
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.VIEW_PUBLIC_POSTERS,
    PERMISSIONS.BIND_GARMIN,
    PERMISSIONS.SYNC_ACTIVITIES,
    PERMISSIONS.GENERATE_POSTER,
    PERMISSIONS.SHARE_POSTER,
    PERMISSIONS.VIEW_MY_POSTERS,
    PERMISSIONS.UPLOAD_WATCHFACE,
    PERMISSIONS.MANAGE_MY_WATCHFACES,
  ],
  admin: [
    PERMISSIONS.VIEW_TEMPLATES,
    PERMISSIONS.VIEW_PUBLIC_POSTERS,
    PERMISSIONS.BIND_GARMIN,
    PERMISSIONS.SYNC_ACTIVITIES,
    PERMISSIONS.GENERATE_POSTER,
    PERMISSIONS.SHARE_POSTER,
    PERMISSIONS.VIEW_MY_POSTERS,
    PERMISSIONS.UPLOAD_WATCHFACE,
    PERMISSIONS.MANAGE_MY_WATCHFACES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.REVIEW_WATCHFACES,
    PERMISSIONS.ACCESS_ADMIN,
  ],
};

/**
 * 检查角色是否拥有指定权限
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) {
    return ROLE_PERMISSIONS.guest.includes(permission);
  }
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * 检查角色是否拥有所有指定权限
 */
export function hasAllPermissions(role: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * 检查角色是否拥有任意指定权限
 */
export function hasAnyPermission(role: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * 获取角色的所有权限
 */
export function getRolePermissions(role: UserRole | undefined): Permission[] {
  if (!role) {
    return ROLE_PERMISSIONS.guest;
  }
  return ROLE_PERMISSIONS[role];
}
