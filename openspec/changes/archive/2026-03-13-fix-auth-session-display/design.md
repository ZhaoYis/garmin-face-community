## 上下文

项目使用 NextAuth.js v5 配合 DrizzleAdapter 进行认证。当前存在以下问题：

1. Session callback 中的 `user` 参数在数据库适配器模式下可能为空
2. 缺少全局 Header 组件显示用户状态
3. 用户无法直观看到自己的登录状态

## 目标 / 非目标

**目标：**
- 修复 session callback 确保用户信息正确传递
- 创建全局 Header 组件显示用户状态
- 添加用户下拉菜单和登出功能

**非目标：**
- 修改 OAuth Provider 配置
- 添加新的认证方式

## 决策

### 1. Session Callback 修复

**决策：** 使用 `jwt` 和 `session` callbacks 组合

**理由：**
- NextAuth.js v5 使用数据库适配器时，session callback 的 `user` 参数来自数据库
- 需要确保 callbacks 正确配置

**修复方案：**
```typescript
callbacks: {
  async session({ session, user }) {
    if (session.user) {
      session.user.id = user.id;
      session.user.role = user.role;
    }
    return session;
  },
}
```

### 2. Header 组件架构

**决策：** 创建服务端 Header 组件 + 客户端用户下拉菜单

**理由：**
- 服务端组件可以调用 `auth()` 获取 session
- 客户端下拉菜单处理交互

**组件结构：**
```
src/components/
├── header.tsx          # 服务端 Header
└── user-dropdown.tsx   # 客户端用户下拉菜单
```

### 3. 布局集成

**决策：** 将 Header 集成到 root layout

**理由：**
- 所有页面统一显示导航和用户状态
- 保持一致性

## 风险 / 权衡

| 风险 | 缓解措施 |
|------|----------|
| Session 仍不可用 | 检查数据库连接和 cookies 配置 |
| Header 影响页面布局 | 使用 sticky 定位，不占用额外空间 |
