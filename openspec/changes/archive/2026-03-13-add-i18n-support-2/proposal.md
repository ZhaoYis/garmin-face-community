## 为什么

系统已配置 next-intl 并有语言切换组件，但多个页面仍使用硬编码的中文文本。用户切换到英文后，部分页面内容不会切换语言，导致体验不一致。需要完成剩余页面的国际化工作。

## 变更内容

- 将所有硬编码的中文文本替换为 `useTranslations` 调用
- 确保所有 UI 文本都能响应语言切换
- 为 alert/confirm 等客户端提示添加翻译支持

## 功能 (Capabilities)

### 新增功能
无

### 修改功能
- `i18n-support`: 扩展现有国际化功能，完成剩余页面的翻译集成

## 影响

- **受影响的页面**: upload, activities, poster/create, poster/[id], profile, admin, watchfaces 等
- **翻译文件**: 需要在 zh-CN.json 和 en.json 中添加缺失的翻译 key
- **API 路由**: 错误消息可保持中文（服务端响应），或后续单独处理
