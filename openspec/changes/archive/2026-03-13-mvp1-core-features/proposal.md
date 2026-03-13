## 为什么

佳明手表用户需要一个平台来展示运动成就、生成精美的赛事纪念海报。当前项目已有基础框架（NextAuth + Drizzle + UI组件），但缺少 MVP1 核心功能：Garmin 账号绑定、运动数据同步、海报生成与分享。这是产品核心价值所在，也是后续 MVP2（表盘）和 MVP3（社区）的基础。

## 变更内容

1. **Garmin OAuth 集成**：实现 Garmin Health API 的 OAuth 授权流程，允许用户绑定佳明账号并同步运动数据

2. **运动记录模块**：
   - 数据库新增 `activities` 表存储运动记录
   - 新增运动记录 API（列表、详情、同步）
   - 新增运动记录展示页面

3. **海报生成模块**：
   - 数据库新增 `posters` 和 `poster_templates` 表
   - 实现 Canvas 海报渲染引擎
   - 支持 4 套核心模板（成就、极简、艺术、越野）
   - 新增海报创建、预览、下载、分享功能

4. **新增依赖**：html2canvas, polyline, zustand, zod, react-hook-form, date-fns, clsx, tailwind-merge

## 功能 (Capabilities)

### 新增功能
- `garmin-auth`: Garmin OAuth 授权流程，包括获取授权 URL、回调处理、Token 管理、账号解绑
- `activity-sync`: 运动数据同步，从 Garmin API 获取运动记录并存储到本地数据库
- `activity-display`: 运动记录展示，列表和详情页展示用户的跑步、骑行、游泳等运动记录
- `poster-templates`: 海报模板系统，管理 4 套核心模板（成就、极简、艺术、越野）的配置和预览
- `poster-generation`: 海报生成引擎，基于 Canvas 渲染运动数据到精美海报，支持下载和分享

### 修改功能
- `user-schema`: 用户表新增 Garmin 绑定字段（garminUserId, garminAccessToken, garminRefreshToken, garminTokenExpireAt）

## 影响

- **数据库**：新增 `activities`, `posters`, `poster_templates` 表，修改 `users` 表
- **API**：新增 `/api/auth/garmin/*`, `/api/activities/*`, `/api/posters/*`, `/api/templates/*` 接口
- **前端**：新增运动记录页面、海报创建页面、海报详情页面
- **依赖**：新增 html2canvas, polyline, zustand, zod 等包
