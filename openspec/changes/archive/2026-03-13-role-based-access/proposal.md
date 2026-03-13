## 为什么

当前系统只有简单的 `admin` 和 `user` 角色，无法满足产品需求中定义的四层权限体系。需要实现完整的基于角色的访问控制（RBAC），让不同用户拥有不同的功能权限。

## 变更内容

- 扩展用户角色枚举：`guest` | `user` | `creator` | `admin`
- 创建权限检查中间件和工具函数
- 创建管理员后台页面
- 实现创作者表盘上传和管理功能
- 为 API 路由添加权限保护

## 功能 (Capabilities)

### 新增功能

- `role-permissions`: 基于角色的权限控制系统，定义每个角色的权限范围
- `admin-dashboard`: 管理员后台，包括用户管理、模板管理、表盘审核
- `creator-watchfaces`: 创作者表盘上传和管理功能

### 修改功能

- `garmin-auth`: 增加权限检查，仅登录用户可绑定 Garmin
- `poster-generation`: 增加权限检查，仅登录用户可生成海报
- `activity-sync`: 增加权限检查，仅登录用户可同步活动

## 影响

- `src/lib/db/schema.ts` - 用户角色枚举扩展
- `src/auth.ts` - Session 中包含完整角色信息
- `src/middleware.ts` - 路由权限保护
- `src/app/admin/*` - 管理员后台页面
- `src/app/watchfaces/*` - 创作者表盘管理页面
- API 路由 - 添加权限检查
