## 上下文

当前系统使用 Next.js App Router，所有 UI 文本都是硬编码的中文。需要实现完整的国际化支持，使用 next-intl 库作为解决方案。

## 目标 / 非目标

**目标：**
- 支持中文（zh-CN）和英文（en）两种语言
- 默认使用中文
- 提供语言切换组件
- 语言偏好持久化到 localStorage
- 所有 UI 文本支持翻译

**非目标：**
- 不支持更多语言（可后续扩展）
- 不实现用户配置文件中的语言偏好存储
- 不翻译用户生成的内容（如海报标题、描述等）

## 决策

### 1. 国际化库选择

选择 **next-intl**，理由：
- 专为 Next.js App Router 设计
- 支持服务端和客户端组件
- 内置路由国际化
- 活跃维护，文档完善

**替代方案：**
- next-i18next - 主要支持 Pages Router
- react-intl - 需要额外配置 Next.js 集成

### 2. 语言资源文件结构

```
src/i18n/
├── config.ts          # 国际化配置
├── messages/
│   ├── zh-CN.json     # 中文翻译
│   └── en.json        # 英文翻译
└── request.ts         # 服务端获取翻译
```

### 3. 语言检测策略

1. 检查 localStorage 中存储的语言偏好
2. 检查浏览器语言设置（Accept-Language）
3. 默认使用中文

### 4. URL 结构

不改变现有 URL 结构，语言通过 cookie/localStorage 存储，而非 URL 路径。

## 风险 / 权衡

- **翻译不完整**：部分文本可能遗漏翻译 → 使用 key 作为 fallback
- **SEO 影响**：不使用 URL 区分语言 → 通过 hreflang 标签解决
- **性能影响**：加载额外语言文件 → 按需加载，不影响首屏性能
