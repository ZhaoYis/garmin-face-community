## 为什么

首页返回 500 Internal Server Error，原因是数据库连接失败。首页的 Header 组件调用 `auth()` 函数，该函数通过 `DrizzleAdapter` 连接数据库。如果 `POSTGRES_URL` 环境变量未配置或数据库服务不可用，整个页面会崩溃返回 500 错误。

## 变更内容

- 添加数据库连接错误处理，实现优雅降级
- 验证必需的环境变量配置
- 在数据库不可用时仍能显示基本页面

## 功能 (Capabilities)

### 新增功能
- `error-handling`: 数据库连接错误处理和优雅降级

### 修改功能
无

## 影响

- **受影响的文件**: `src/lib/db/index.ts`, `src/auth.ts`, `src/components/header.tsx`
- **环境变量**: 需要确保 `POSTGRES_URL` 正确配置
