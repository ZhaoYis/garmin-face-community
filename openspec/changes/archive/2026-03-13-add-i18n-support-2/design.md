## 上下文

项目已配置 next-intl 实现国际化支持：
- `src/i18n/` 目录包含配置和翻译文件
- `LanguageSwitcher` 组件已实现语言切换
- Header 等部分组件已使用翻译

但以下页面仍使用硬编码文本：
- `upload/page.tsx` - 表单 placeholder
- `activities/page.tsx` - 活动类型、alert 消息
- `poster/create/page.tsx` - 模板描述、alert 消息
- `poster/[id]/page.tsx` - alert/confirm 消息
- `profile/page.tsx` - 部分文本
- `admin/` 目录下页面 - 角色标签、状态文本
- `watchfaces/` 目录下页面 - 分类标签、状态文本

## 目标 / 非目标

**目标：**
- 将所有硬编码的 UI 文本替换为翻译调用
- 在翻译文件中添加缺失的 key
- 确保语言切换后所有 UI 文本正确更新

**非目标：**
- API 路由的错误消息翻译（服务端响应保持中文）
- 数据库存储的内容翻译（如活动名称）
- SEO 元数据翻译（后续单独处理）

## 决策

### 1. 使用 next-intl 的 useTranslations hook
- **理由**: 项目已集成 next-intl，保持一致性
- **替代方案**: react-intl（需要额外配置）

### 2. 客户端组件使用 useTranslations，服务端组件使用 getTranslations
- **理由**: next-intl 提供两种 API，分别适用于不同场景
- **实现**: "use client" 组件用 useTranslations，Server Component 用 getTranslations

### 3. alert/confirm 消息使用翻译 key
- **理由**: 用户切换语言后，提示消息也应切换
- **实现**: 在调用 alert/confirm 前获取翻译文本

## 风险 / 权衡

- **翻译 key 命名冲突** → 使用层级结构（如 `upload.placeholder.name`）
- **遗漏翻译** → 通过 TypeScript 类型检查和代码审查发现
- **性能影响** → next-intl 已优化，无需担心
