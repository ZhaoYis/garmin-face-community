# Garmin Face Community

<div align="center">

**Sports Achievement Poster Generator**

Bind your Garmin account, sync sports data, generate beautiful posters, and make every race memorable

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.en.md) | [中文](README.md)

</div>

---

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

**Feel free to open an issue or PR**

</div>
