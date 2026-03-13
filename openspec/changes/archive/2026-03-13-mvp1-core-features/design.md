## 上下文

项目已有基础框架：Next.js 16 + React 19、NextAuth.js v5（Google/GitHub 登录）、Drizzle ORM + PostgreSQL、基础 UI 组件。本次变更需要在此基础上实现 MVP1 核心功能：Garmin 账号绑定、运动数据同步、海报生成与分享。

**约束条件：**
- Garmin Health API 需要申请开发者账号并审核
- 海报渲染使用 Canvas 2D API，需要处理高分辨率输出
- Token 需要加密存储，确保用户数据安全

## 目标 / 非目标

**目标：**
- 实现完整的 Garmin OAuth 流程，支持账号绑定和解绑
- 实现运动数据同步，支持跑步、骑行、游泳等主要运动类型
- 实现 4 套核心海报模板，支持自定义标语和样式配置
- 实现海报 Canvas 渲染，支持高分辨率图片导出

**非目标：**
- MVP2（Connect IQ 表盘）和 MVP3（社区功能）不在本次范围
- 海报模板编辑器（仅使用预设模板）
- 实时运动数据推送（仅支持手动同步）

## 决策

### 1. Garmin OAuth 实现
**决策：** 使用自定义 OAuth Provider 集成到 NextAuth.js，而非独立实现

**理由：**
- NextAuth.js 已处理 Session 管理，保持一致性
- 可以复用现有的 Drizzle Adapter
- 便于后续扩展其他 OAuth Provider

**替代方案：** 独立实现 OAuth 流程，但需要额外处理 Session 同步

### 2. Token 加密存储
**决策：** 使用 Node.js 内置 crypto 模块的 AES-256-GCM 加密

**理由：**
- 无需额外依赖
- 安全性高，符合最佳实践
- 便于密钥管理

### 3. 海报渲染架构
**决策：** 纯 Canvas 2D API + 服务端渲染

**理由：**
- 保证跨平台一致性
- 支持高分辨率输出（2x/3x）
- 便于实现路线图渲染

**替代方案：** html2canvas 截图方式，但精度和性能不稳定

### 4. 状态管理
**决策：** 使用 Zustand 管理客户端状态

**理由：**
- 轻量级，无 Provider 包裹
- TypeScript 友好
- 适合海报编辑器的复杂状态

## 风险 / 权衡

| 风险 | 缓解措施 |
|------|----------|
| Garmin API 审核周期长（可能 2-4 周） | 先用 Mock 数据开发，API 就绪后切换 |
| Token 过期处理复杂 | 实现自动刷新机制，提前 5 分钟刷新 |
| Canvas 渲染性能 | 使用 Web Worker 处理复杂渲染，避免阻塞主线程 |
| 海报图片存储成本 | 使用七牛云 CDN，设置图片压缩和缓存策略 |

## 迁移计划

1. **数据库迁移**：运行 `db:generate` 和 `db:migrate` 创建新表
2. **环境变量**：添加 Garmin API 相关环境变量
3. **依赖安装**：安装新增的 npm 包
4. **回滚**：如果出现问题，可删除新增表和 API 路由
