# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Garmin Face Community is a Next.js 15 application for Garmin watch face sharing and sports achievement poster generation. It features user authentication, Garmin OAuth integration for syncing activity data, poster generation with customizable templates, and a watch face community with likes, comments, and favorites.

## Common Commands

```bash
# Development
npm run dev              # Start development server on localhost:3000

# Build
npm run build            # Production build (requires 3GB+ memory)
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint

# Database (Drizzle ORM)
npm run db:generate      # Generate migration files from schema
npm run db:migrate       # Run pending migrations
npm run db:push          # Push schema changes directly (dev only)
npm run db:studio        # Open Drizzle Studio GUI
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI based)
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth.js v5 (Auth.js)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **i18n**: next-intl (Chinese default, English supported)

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (RESTful endpoints)
│   ├── auth/signin/       # Custom signin page
│   ├── admin/             # Admin dashboard (role-protected)
│   ├── activities/        # Garmin activity display
│   ├── poster/            # Poster generation pages
│   ├── profile/           # User profile
│   └── watchface/         # Watch face community pages
├── components/
│   ├── ui/                # shadcn/ui base components
│   └── *.tsx              # Feature components
├── lib/
│   ├── db/                # Database schema & connection
│   ├── garmin/            # Garmin API integration
│   ├── poster/            # Poster generation logic
│   └── encryption/        # Token encryption utilities
├── i18n/                  # Internationalization config & messages
│   ├── messages/zh-CN.json
│   └── messages/en.json
├── auth.ts                # NextAuth.js configuration
└── middleware.ts          # Route protection (lightweight, non-blocking)
```

### Authentication System

**NextAuth.js v5** with the following providers:
- Google OAuth
- GitHub OAuth

**Key files:**
- `src/auth.ts` - Main auth configuration, providers, callbacks
- `src/app/api/auth/[...nextauth]/route.ts` - API route handlers
- `src/middleware.ts` - Route matching only (auth handled at page level)

**Role-based access control:**
Roles are defined in `src/lib/db/schema.ts`: `guest` | `user` | `creator` | `admin`

Permissions are defined in `src/lib/permissions.ts`. Check permissions using:
```typescript
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { auth } from "@/auth";

const session = await auth();
if (hasPermission(session?.user?.role, PERMISSIONS.GENERATE_POSTER)) {
  // allow action
}
```

**Admin configuration:** Set `ADMIN_EMAILS` env variable with comma-separated admin emails. Admins get auto-promoted on login.

### Database Schema

**Core tables** (defined in `src/lib/db/schema.ts`):
- `users` - User accounts with role, Garmin tokens (encrypted)
- `watchFaces` - Watch face uploads with status (pending/approved/rejected)
- `activities` - Synced Garmin activities
- `posters` - Generated poster records
- `posterTemplates` - Template definitions with config JSON
- `comments`, `favorites`, `likes`, `follows` - Social features

**Database connection:**
```typescript
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const user = await db.query.users.findFirst({
  where: eq(users.id, userId)
});
```

### Garmin Integration

Garmin OAuth and API integration is in `src/lib/garmin/`:
- `oauth.ts` - OAuth flow handlers
- `client.ts` - API client for fetching activities
- `token-manager.ts` - Token refresh logic
- `types.ts` - TypeScript definitions

OAuth callback: `/api/auth/garmin/callback`
Disconnect: `/api/auth/garmin/disconnect`

### Internationalization

Default locale is Chinese (`zh-CN`). English (`en`) is also supported.

**Configuration:**
- `src/i18n/config.ts` - Locale definitions
- `src/i18n/request.ts` - Locale resolution (reads from cookie)
- `src/i18n/messages/*.json` - Translation files

**Usage in components:**
```typescript
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');
```

**Usage in API routes:**
```typescript
import { getTranslations } from 'next-intl/server';
const t = await getTranslations('namespace');
```

### Protected Routes Pattern

Auth is handled at the page level (not middleware). Example pattern:

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  // ...
}
```

For layout-level protection (admin pages):
```typescript
// app/admin/layout.tsx
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

if (!hasPermission(session?.user?.role, PERMISSIONS.ACCESS_ADMIN)) {
  redirect("/forbidden");
}
```

### Environment Variables

Required in `.env`:
```
POSTGRES_URL              # PostgreSQL connection string
AUTH_SECRET               # NextAuth.js secret
AUTH_GOOGLE_ID            # Google OAuth client ID
AUTH_GOOGLE_SECRET        # Google OAuth client secret
AUTH_GITHUB_ID            # GitHub OAuth client ID
AUTH_GITHUB_SECRET        # GitHub OAuth client secret
ENCRYPTION_KEY            # 32-byte hex string for token encryption
GARMIN_CLIENT_ID          # Garmin API key
GARMIN_CLIENT_SECRET      # Garmin API secret
ADMIN_EMAILS              # Comma-separated admin emails
```

Optional:
```
QINIU_ACCESS_KEY          # Qiniu cloud storage (for image uploads)
QINIU_SECRET_KEY
QINIU_BUCKET
QINIU_DOMAIN
```

## Key Conventions

1. **Database**: Use Drizzle ORM with `drizzle-orm` imports. Schema changes require `db:generate` then `db:migrate`.

2. **API Routes**: Use standard Next.js App Router pattern with `Request`/`Response` objects. Error handling uses `src/lib/api-errors.ts`.

3. **Styling**: Use Tailwind CSS with shadcn/ui components. Custom components should follow shadcn patterns.

4. **Type Safety**: Use Drizzle's inferred types: `type User = typeof users.$inferSelect`

5. **Server Components**: Default to Server Components. Mark `'use client'` only when needed for interactivity.

6. **File Uploads**: Images are uploaded to Qiniu Cloud via `/api/upload` endpoint.
