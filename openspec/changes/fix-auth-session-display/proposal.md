## 为什么

当前项目存在两个认证相关问题：

1. **登录后跳转问题**：用户登录成功后，访问个人中心页面（/profile）仍然被重定向到 /auth/signin 页面。原因是 NextAuth.js v5 的 session callback 中 `user` 参数的使用方式与数据库适配器的配合存在问题。

2. **用户信息显示缺失**：登录成功后，页面右上角应该显示用户头像和基本信息，当前缺少此功能，用户无法直观看到自己的登录状态。

## 变更内容

1. **修复 NextAuth.js session callback**：调整 session callback 的实现，确保在使用 DrizzleAdapter 时正确获取用户信息

2. **添加 Header 组件**：创建全局 Header 组件，在右上角显示用户登录状态和信息

3. **更新布局结构**：将 Header 组件集成到 root layout 中

4. **添加登出功能**：在用户下拉菜单中添加登出按钮

## 功能 (Capabilities)

### 新增功能
- `user-header`: 全局 Header 组件，显示用户登录状态、头像、用户名，支持登出操作

### 修改功能
- `auth-session`: 修复 session callback，确保用户登录后 session 正确可用

## 影响

- **文件修改**：`src/auth.ts`、`src/app/layout.tsx`
- **文件新增**：`src/components/header.tsx`、`src/components/user-dropdown.tsx`
- **依赖**：无新增依赖
