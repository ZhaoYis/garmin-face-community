/**
 * 检查邮箱是否为超级管理员
 * 超级管理员邮箱列表通过环境变量 ADMIN_EMAILS 配置
 */

/**
 * 获取超级管理员邮箱列表
 */
export function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    return [];
  }
  return adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

/**
 * 检查邮箱是否为超级管理员
 * @param email 要检查的邮箱地址
 * @returns 是否为超级管理员
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}
