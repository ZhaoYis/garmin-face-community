## 1. 修复认证 Session

- [x] 1.1 检查并修复 auth.ts 中的 session callback 配置
- [x] 1.2 确保 DrizzleAdapter 正确配置
- [x] 1.3 测试登录后 session 是否正确可用

## 2. 创建 Header 组件

- [x] 2.1 创建 Header 服务端组件 (src/components/header.tsx)
- [x] 2.2 创建用户下拉菜单客户端组件 (src/components/user-dropdown.tsx)
- [x] 2.3 添加登出功能

## 3. 集成到布局

- [x] 3.1 更新 root layout，集成 Header 组件
- [x] 3.2 调整页面样式，确保 Header 正确显示
- [x] 3.3 移除首页中的重复 Header 代码

## 4. 测试验证

- [x] 4.1 测试未登录用户看到登录按钮
- [x] 4.2 测试已登录用户看到用户信息
- [x] 4.3 测试用户下拉菜单功能
- [x] 4.4 测试个人中心页面访问
