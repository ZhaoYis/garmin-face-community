## 上下文

项目使用 Tailwind CSS v4 和 CSS 变量定义主题颜色。当前已有的 Light/Dark 样式定义仅通过 `prefers-color-scheme` 媒体查询自动切换，缺少用户手动控制能力。

## 目标 / 非目标

**目标：**
- 实现手动主题切换（Light / Dark / System）
- 用户选择持久化到 localStorage
- 在 Header 中提供便捷的切换入口
- 确保所有页面正确响应主题变化

**非目标：**
- 自定义主题色（仅支持预设的 Light/Dark）
- 每个用户独立的主题设置（存储在本地而非服务器）

## 决策

### 1. 主题管理方案

**决策：** 使用 `next-themes` 库

**理由：**
- 成熟稳定，专为 Next.js 设计
- 支持 SSR，避免水合不匹配
- 自动处理 localStorage 持久化
- 支持 System 偏好跟随

**替代方案：** 自定义 React Context + localStorage，但需要处理 SSR 边界情况

### 2. 组件架构

**决策：** 服务端 ThemeProvider + 客户端 ThemeToggle

```
src/components/
├── theme-provider.tsx    # 服务端 Provider
└── theme-toggle.tsx      # 客户端切换按钮
```

### 3. Tailwind Dark Mode 配置

**决策：** 使用 `class` 策略

**理由：**
- 与 next-themes 配合良好
- 通过 `<html class="dark">` 控制

## 风险 / 权衡

| 风险 | 缓解措施 |
|------|----------|
| SSR 水合闪烁 | next-themes 内置处理，使用 suppressHydrationWarning |
| 部分 UI 未适配 | 全面检查 CSS 变量使用 |
| 切换动画影响性能 | 禁用或简化过渡动画 |
