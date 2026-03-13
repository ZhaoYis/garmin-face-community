## 为什么

当前用户下拉菜单虽然有头像显示逻辑，但存在以下问题：
1. 默认头像只是一个简单的 User 图标，视觉效果不够专业
2. 需要确保 OAuth 登录时头像能正确获取并存储
3. 用户体验需要优化，头像显示应该更加美观和一致

## 变更内容

- 优化 UserDropdown 组件的头像显示逻辑
- 创建美观的默认头像占位图（使用用户名首字母或专业设计的默认头像）
- 确保 Google/GitHub OAuth 登录时正确获取用户头像
- 添加头像加载失败时的 fallback 处理

## 功能 (Capabilities)

### 新增功能

- `user-avatar`: 用户头像显示功能，支持 OAuth 头像和默认头像

### 修改功能

（无现有功能需要修改）

## 影响

- `src/components/user-dropdown.tsx` - 头像显示组件
- `src/auth.ts` - OAuth 回调确保头像传递
