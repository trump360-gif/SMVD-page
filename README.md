# 숙명여자대학교 시각영상디자인과 CMS

A full-stack Content Management System for Sookmyung Women's University Visual & Media Design Department website.

## Features

### 🌐 Public Website (6 Pages)
- **Home** - 홈페이지
- **About Major** - 학과소개
- **Curriculum** - 교과과정
- **People** - 교수진
- **Work** - 포트폴리오
- **News & Events** - 뉴스/이벤트

### 🔐 Admin Dashboard
- **Content Management**
  - Edit page text and sections
  - Upload images with automatic WebP conversion
  - Embed videos
  - Reorder sections with drag-and-drop

- **Header & Navigation Management**
  - Manage menu items
  - Reorder menu
  - Enable/disable menu items

- **Footer Management**
  - Edit footer information
  - Manage footer links
  - Add/remove footer items

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Image Processing**: Sharp (WebP conversion)
- **File Upload**: Multer (local storage)
- **Form Validation**: Zod + React Hook Form
- **State Management**: React Query + Context API
- **Drag-Drop**: @hello-pangea/dnd

## Quick Start

### Prerequisites
- Node.js 18+ (LTS)
- PostgreSQL 14+

### Installation

1. **Install dependencies** (already done)
```bash
npm install
```

2. **Setup database**
```bash
# Create local PostgreSQL database
createdb smvd_cms
```

3. **Configure environment** (.env.local already created)
```bash
# Update DATABASE_URL if needed
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

4. **Run migrations and seed data**
```bash
npm run db:migrate
npx prisma db seed
```

5. **Start development server**
```bash
npm run dev
```

Visit **http://localhost:3000**

### Admin Access
- Email: `admin@smvd.ac.kr`
- Password: `admin123`
- Dashboard: **http://localhost:3000/admin**

## Development

```bash
npm run dev                  # Start dev server
npm run db:studio          # View/edit data
npm run db:migrate         # Create migrations
npm run lint               # Run linter
npm run build              # Build for production
npm start                  # Start production
```

## Setup Guide

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Project Structure

```
src/
├── app/                    # Next.js pages & API routes
├── components/             # React components
├── lib/                    # Utilities & configurations
└── types/                  # TypeScript definitions

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Initial data
```

## Implementation Status

- ✅ Phase 1: Project Initialization
- 🔜 Phase 2: Authentication System
- ⬜ Phase 3: Backend API
- ⬜ Phase 4: Public Pages
- ⬜ Phase 5: Admin Interface
- ⬜ Phase 6: Optimization & Deployment

See `/Users/jeonminjun/.claude/plans/vast-zooming-bentley.md` for detailed plan.

## License

© 2026 Sookmyung Women's University. All rights reserved.
