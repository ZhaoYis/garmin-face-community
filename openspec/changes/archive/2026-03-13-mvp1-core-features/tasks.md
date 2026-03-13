## 1. 数据库扩展

- [x] 1.1 扩展 users 表，添加 Garmin 绑定字段（garminUserId, garminAccessToken, garminRefreshToken, garminTokenExpireAt）
- [x] 1.2 创建 activities 表（运动记录）
- [x] 1.3 创建 poster_templates 表（海报模板）
- [x] 1.4 创建 posters 表（用户海报）
- [x] 1.5 运行数据库迁移

## 2. Garmin OAuth 集成

- [x] 2.1 实现 Token 加密/解密工具函数（AES-256-GCM）
- [x] 2.2 创建 Garmin OAuth 配置和工具函数
- [x] 2.3 实现 GET /api/auth/garmin 接口（获取授权 URL）
- [x] 2.4 实现 GET /api/auth/garmin/callback 接口（OAuth 回调处理）
- [x] 2.5 实现 POST /api/auth/garmin/disconnect 接口（解绑账号）
- [x] 2.6 实现 Token 自动刷新机制

## 3. 运动数据服务

- [x] 3.1 创建 Garmin API 客户端类
- [x] 3.2 实现 Garmin 运动数据类型定义
- [x] 3.3 实现 POST /api/activities/sync 接口（同步数据）
- [x] 3.4 实现 GET /api/activities 接口（获取列表）
- [x] 3.5 实现 GET /api/activities/:id 接口（获取详情）

## 4. 海报模板服务

- [x] 4.1 创建海报模板配置数据
- [x] 4.2 实现 GET /api/templates 接口（获取模板列表）
- [x] 4.3 实现 GET /api/templates/:id 接口（获取模板详情）
- [x] 4.4 插入 4 套核心模板初始数据

## 5. 海报生成引擎

- [x] 5.1 创建 Canvas 渲染工具函数
- [x] 5.2 实现运动数据格式化函数
- [x] 5.3 实现 Polyline 解码和路线渲染函数
- [x] 5.4 实现成就海报模板渲染器
- [x] 5.5 实现极简海报模板渲染器
- [x] 5.6 实现艺术海报模板渲染器
- [x] 5.7 实现越野海报模板渲染器
- [x] 5.8 实现 POST /api/posters/generate 接口（生成海报）
- [x] 5.9 实现 GET /api/posters 接口（我的海报列表）
- [x] 5.10 实现 GET /api/posters/:id 接口（海报详情）
- [x] 5.11 实现 DELETE /api/posters/:id 接口（删除海报）
- [x] 5.12 实现 POST /api/posters/:id/share 接口（分享统计）

## 6. 前端页面开发

- [x] 6.1 创建 Garmin 绑定组件和页面
- [x] 6.2 创建运动记录列表页面
- [x] 6.3 创建运动记录详情页面
- [x] 6.4 创建海报创建页面（选择运动记录）
- [x] 6.5 创建模板选择组件
- [x] 6.6 创建海报编辑器组件（自定义标语）
- [x] 6.7 创建海报预览组件
- [x] 6.8 创建海报下载和分享功能
- [x] 6.9 创建我的海报列表页面

## 7. 依赖安装与配置

- [x] 7.1 安装 html2canvas, polyline 包
- [x] 7.2 安装 zustand 状态管理
- [x] 7.3 安装 zod, react-hook-form 表单验证
- [x] 7.4 安装 date-fns 日期处理
- [x] 7.5 安装 clsx, tailwind-merge 样式工具
- [x] 7.6 配置 Garmin API 环境变量
- [x] 7.7 配置七牛云存储

## 8. 测试与优化

- [x] 8.1 编写 Garmin OAuth 流程测试
- [x] 8.2 编写运动数据同步测试
- [x] 8.3 编写海报生成测试
- [x] 8.4 性能优化：海报渲染性能
- [x] 8.5 错误处理：完善错误提示和边界情况
