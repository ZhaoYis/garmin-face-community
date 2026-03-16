/**
 * API 错误处理工具
 * P2 修复：统一错误处理
 */

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE";

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: unknown;
  statusCode: number;
}

export const API_ERRORS: Record<ErrorCode, Omit<ApiError, "details">> = {
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "未授权，请先登录",
    statusCode: 401,
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    message: "无权限执行此操作",
    statusCode: 403,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    message: "请求的资源不存在",
    statusCode: 404,
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "请求参数验证失败",
    statusCode: 400,
  },
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    message: "服务器内部错误",
    statusCode: 500,
  },
  RATE_LIMITED: {
    code: "RATE_LIMITED",
    message: "请求频率超限，请稍后再试",
    statusCode: 429,
  },
  SERVICE_UNAVAILABLE: {
    code: "SERVICE_UNAVAILABLE",
    message: "服务暂时不可用",
    statusCode: 503,
  },
};

/**
 * 创建 API 错误响应
 */
export function createErrorResponse(
  errorType: ErrorCode,
  customMessage?: string,
  details?: unknown
): Response {
  const error = API_ERRORS[errorType];
  const response = {
    error: {
      code: error.code,
      message: customMessage || error.message,
      ...(details && { details }),
    },
  };

  return new Response(JSON.stringify(response), {
    status: error.statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * 日志记录器
 */
export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: "info", message, ...context }));
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(JSON.stringify({
      level: "error",
      message,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    }));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: "warn", message, ...context }));
  },
};
