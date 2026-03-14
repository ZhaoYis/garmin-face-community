# Garmin Face Community | Garmin 表盘社区

<div align="center">

[English](#english) | [中文](#中文)

---

**运动成就海报生成器** | **Sports Achievement Poster Generator**

绑定 Garmin 账号，同步运动数据，生成精美海报，让每一次比赛都值得被铭记

Bind your Garmin account, sync sports data, generate beautiful posters, and make every race memorable

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

<a name="中文"></a>

## 📖 中文文档

### 📝 项目简介

Garmin Face Community 是一个基于 Next.js 15 构建的 Garmin 表盘社区平台，集成了运动数据同步和海报生成功能。用户可以绑定 Garmin 账号，同步运动记录，并使用精美模板生成运动成就海报，分享到社交媒体。

### ✨ 核心功能

#### 1. 用户系统 👤
- 🔐 多种登录方式（Google OAuth、GitHub OAuth）
- 👤 用户个人中心
- 🎭 用户角色权限管理（游客、普通用户、创作者、管理员）
- 🔗 Garmin 账号绑定与解绑

#### 2. 运动数据同步 🏃
- 📊 自动同步 Garmin 运动记录
- 📈 支持多种运动类型（跑步、骑行、游泳、越野）
- 📝 详细运动数据展示（距离、时长、配速、心率、海拔等）

#### 3. 海报生成器 🎨
- 🖼️ 多种精美模板（成就风格、简约风格、艺术风格、越野风格）
- ⚙️ 自定义文字和样式配置
- 💾 一键下载高清海报
- 🔗 社交媒体分享

#### 4. 表盘社区 💎
- 📤 表盘上传与分享
- 🏷️ 分类与标签系统
- ⭐ 点赞与收藏功能
- 💬 评论与评分系统

#### 5. 后台管理 🛠️
- 📊 数据统计仪表盘
- 👥 用户管理
- 🎨 模板管理
- ✅ 表盘审核

#### 6. 国际化支持 🌍
- 🇨🇳 中文支持
- 🇺🇸 英文支持
- 🔄 一键切换语言

### 🛠️ 技术栈

#### 前端
- **框架**: Next.js 15 (App Router)
- **UI 库**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **组件库**: shadcn/ui
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod

#### 后端
- **运行时**: Next.js API Routes
- **数据库**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **认证**: NextAuth.js v5
- **国际化**: next-intl

#### 第三方集成
- **Garmin OAuth**: 运动数据同步
- **Google OAuth**: 用户登录
- **GitHub OAuth**: 用户登录

### 📂 项目结构

```
garmin-face-community/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── activities/         # 运动记录页面
│   │   ├── admin/              # 后台管理页面
│   │   ├── api/                # API 路由
│   │   ├── auth/               # 认证相关页面
│   │   ├── poster/             # 海报生成页面
│   │   ├── profile/            # 个人中心页面
│   │   └── watchfaces/         # 表盘相关页面
│   ├── components/             # React 组件
│   │   ├── ui/                 # UI 基础组件
│   │   ├── poster/             # 海报相关组件
│   │   └── activity/           # 运动相关组件
│   ├── lib/                    # 核心库
│   │   ├── db/                 # 数据库配置与 Schema
│   │   ├── garmin/             # Garmin API 集成
│   │   ├── poster/             # 海报生成逻辑
│   │   └── encryption/         # 加密工具
│   ├── i18n/                   # 国际化配置
│   │   ├── messages/           # 语言文件
│   │   │   ├── zh-CN.json      # 中文
│   │   │   └── en.json         # 英文
│   │   └── config.ts           # i18n 配置
│   └── middleware.ts           # Next.js 中间件
├── public/                     # 静态资源
├── drizzle/                    # 数据库迁移文件
└── doc/                        # 项目文档
```

### 🚀 快速开始

#### 前置要求
- Node.js >= 20
- PostgreSQL >= 15
- npm 或 pnpm

#### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/ZhaoYis/garmin-face-community.git
cd garmin-face-community
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入以下配置：

```env
# 数据库配置
POSTGRES_URL="postgresql://user:password@localhost:5432/garmin_face"

# NextAuth.js 配置
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Garmin OAuth
GARMIN_CONSUMER_KEY="your-garmin-consumer-key"
GARMIN_CONSUMER_SECRET="your-garmin-consumer-secret"

# 加密密钥
ENCRYPTION_KEY="your-32-char-encryption-key"
```

4. **初始化数据库**
```bash
# 生成迁移文件
npm run db:generate

# 运行迁移
npm run db:migrate

# (可选) 填充种子数据
npm run db:seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 📊 数据库设计

#### 核心数据表

| 表名 | 描述 |
|------|------|
| `user` | 用户信息表 |
| `watch_face` | 表盘信息表 |
| `activity` | 运动记录表 |
| `poster` | 用户海报表 |
| `poster_template` | 海报模板表 |
| `comment` | 评论表 |
| `favorite` | 收藏表 |
| `like` | 点赞表 |
| `follow` | 关注关系表 |

详细 Schema 定义请查看 [`src/lib/db/schema.ts`](src/lib/db/schema.ts)

### 🎨 海报模板

项目内置 4 种精美海报模板：

| 模板 | 风格 | 适用场景 |
|------|------|----------|
| **achievement** | 深色背景 + 金色装饰 | 马拉松完赛纪念 |
| **minimal** | 白底 + 黑字 | 日常训练记录 |
| **art** | 渐变背景 | 社交媒体分享 |
| **trail** | 大地色系 | 越野赛记录 |

### 📱 功能截图

> 截图待补充

### 🚢 部署

#### Vercel 部署（推荐）

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZhaoYis/garmin-face-community)

#### Docker 部署

```bash
# 构建镜像
docker build -t garmin-face-community .

# 运行容器
docker run -p 3000:3000 --env-file .env garmin-face-community
```

### 🤝 贡献指南

欢迎贡献代码！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

<a name="english"></a>

## 📖 English Documentation

### 📝 Project Overview

Garmin Face Community is a Garmin watch face community platform built with Next.js 15, featuring sports data synchronization and poster generation capabilities. Users can bind their Garmin accounts, sync activity records, and generate beautiful sports achievement posters to share on social media.

### ✨ Core Features

#### 1. User System 👤
- 🔐 Multiple login methods (Google OAuth, GitHub OAuth)
- 👤 User profile center
- 🎭 User role management (Guest, User, Creator, Admin)
- 🔗 Garmin account binding and unbinding

#### 2. Sports Data Sync 🏃
- 📊 Automatic Garmin activity synchronization
- 📈 Multiple activity types (Running, Cycling, Swimming, Trail)
- 📝 Detailed activity data display (Distance, Duration, Pace, Heart Rate, Elevation, etc.)

#### 3. Poster Generator 🎨
- 🖼️ Multiple beautiful templates (Achievement, Minimal, Art, Trail styles)
- ⚙️ Custom text and style configuration
- 💾 One-click high-quality poster download
- 🔗 Social media sharing

#### 4. Watch Face Community 💎
- 📤 Watch face upload and sharing
- 🏷️ Category and tag system
- ⭐ Like and favorite features
- 💬 Comment and rating system

#### 5. Admin Dashboard 🛠️
- 📊 Data statistics dashboard
- 👥 User management
- 🎨 Template management
- ✅ Watch face review

#### 6. Internationalization 🌍
- 🇨🇳 Chinese support
- 🇺🇸 English support
- 🔄 One-click language switching

### 🛠️ Tech Stack

#### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Component Library**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

#### Backend
- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js v5
- **Internationalization**: next-intl

#### Third-party Integrations
- **Garmin OAuth**: Sports data synchronization
- **Google OAuth**: User login
- **GitHub OAuth**: User login

### 📂 Project Structure

```
garmin-face-community/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── activities/         # Activity pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── poster/             # Poster generation pages
│   │   ├── profile/            # Profile pages
│   │   └── watchfaces/         # Watch face pages
│   ├── components/             # React components
│   │   ├── ui/                 # UI base components
│   │   ├── poster/             # Poster components
│   │   └── activity/           # Activity components
│   ├── lib/                    # Core libraries
│   │   ├── db/                 # Database config & schema
│   │   ├── garmin/             # Garmin API integration
│   │   ├── poster/             # Poster generation logic
│   │   └── encryption/         # Encryption utilities
│   ├── i18n/                   # Internationalization config
│   │   ├── messages/           # Language files
│   │   │   ├── zh-CN.json      # Chinese
│   │   │   └── en.json         # English
│   │   └── config.ts           # i18n configuration
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── drizzle/                    # Database migration files
└── doc/                        # Project documentation
```

### 🚀 Quick Start

#### Prerequisites
- Node.js >= 20
- PostgreSQL >= 15
- npm or pnpm

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ZhaoYis/garmin-face-community.git
cd garmin-face-community
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database configuration
POSTGRES_URL="postgresql://user:password@localhost:5432/garmin_face"

# NextAuth.js configuration
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Garmin OAuth
GARMIN_CONSUMER_KEY="your-garmin-consumer-key"
GARMIN_CONSUMER_SECRET="your-garmin-consumer-secret"

# Encryption key
ENCRYPTION_KEY="your-32-char-encryption-key"
```

4. **Initialize database**
```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed data
npm run db:seed
```

5. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 📊 Database Design

#### Core Tables

| Table | Description |
|-------|-------------|
| `user` | User information |
| `watch_face` | Watch face data |
| `activity` | Activity records |
| `poster` | User posters |
| `poster_template` | Poster templates |
| `comment` | Comments |
| `favorite` | Favorites |
| `like` | Likes |
| `follow` | Follow relationships |

See [`src/lib/db/schema.ts`](src/lib/db/schema.ts) for detailed schema definitions.

### 🎨 Poster Templates

The project includes 4 beautiful poster templates:

| Template | Style | Use Case |
|----------|-------|----------|
| **achievement** | Dark background + gold accents | Marathon finish commemoration |
| **minimal** | White background + black text | Daily training records |
| **art** | Gradient background | Social media sharing |
| **trail** | Earth tones | Trail running records |

### 📱 Screenshots

> Screenshots coming soon

### 🚢 Deployment

#### Vercel Deployment (Recommended)

1. Fork this repository
2. Import project on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy complete

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZhaoYis/garmin-face-community)

#### Docker Deployment

```bash
# Build image
docker build -t garmin-face-community .

# Run container
docker run -p 3000:3000 --env-file .env garmin-face-community
```

### 🤝 Contributing

Contributions are welcome! Please check the [Contributing Guide](CONTRIBUTING.md) for details.

### 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by [ZhaoYis](https://github.com/ZhaoYis)**

**如有问题或建议，欢迎提 Issue 或 PR | Feel free to open an issue or PR**

</div>
