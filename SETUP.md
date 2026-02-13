# SMVD CMS - Setup Guide

## Prerequisites

- Node.js 18+ (LTS)
- PostgreSQL 14+
- npm or yarn

## Phase 1: 프로젝트 초기화 (Project Initialization)

### Step 1: Setup PostgreSQL

#### Option A: Using Homebrew (macOS)

```bash
# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create database
createdb smvd_cms

# Verify connection
psql -d smvd_cms -c "\dt"
```

#### Option B: Using Docker

```bash
docker run --name postgres-smvd \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smvd_cms \
  -p 5432:5432 \
  -d postgres:16-alpine

# Verify connection
docker exec postgres-smvd psql -U postgres -d smvd_cms -c "\dt"
```

#### Option C: Using Prisma Dev (Recommended for Local Development)

```bash
# Automatically starts a local PostgreSQL instance
npx prisma dev
```

### Step 2: Setup Environment Variables

```bash
# .env.local is already created with default values
# Update DATABASE_URL if needed based on your PostgreSQL setup

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
# Copy the output and update NEXTAUTH_SECRET in .env.local
```

### Step 3: Run Database Migrations

```bash
# This creates all tables in PostgreSQL
npm run db:migrate

# Or for just pushing schema without migrations
npm run db:push
```

### Step 4: Seed Initial Data

```bash
# Populates initial data (pages, navigation, footer, admin account)
npx prisma db seed

# Or use the npm script
npm run db:seed
```

**Default Admin Account:**
- Email: `admin@smvd.ac.kr`
- Password: `admin123`

### Step 5: Generate Prisma Client

```bash
# This happens automatically during build, but you can run manually
npx prisma generate
```

### Step 6: Start Development Server

```bash
npm run dev

# Visit http://localhost:3000
```

### Step 7: View Database (Optional)

```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

---

## Project Structure After Phase 1

```
smvd-cms/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Initial data seeding
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router (to be filled in Phase 2-4)
│   ├── components/            # React components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth/              # Auth utilities (Phase 2)
│   │   ├── image/             # Image processing (Phase 3)
│   │   └── validation/        # Zod schemas
│   └── types/                 # TypeScript types
├── public/
│   └── uploads/               # Image uploads directory
├── .env.local                 # Local environment variables
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies

Generated:
├── src/generated/prisma/      # Generated Prisma types
└── .next/                     # Next.js build output
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d smvd_cms

# Check DATABASE_URL format
echo $DATABASE_URL

# Reset migrations (⚠️ WARNING: Deletes all data)
npx prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Update Prisma
npm update prisma @prisma/client
```

### Port Already in Use

```bash
# Change dev port
npm run dev -- -p 3001

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## Next Phase: Phase 2 - Authentication System

Once Phase 1 is complete, proceed to:

1. **NextAuth Configuration** - `src/lib/auth/auth.ts`
2. **Login API** - `src/app/api/auth/[...nextauth]/route.ts`
3. **Middleware** - `src/middleware.ts`
4. **Login Page** - `src/app/admin/login/page.tsx`

See the main plan at: `/Users/jeonminjun/.claude/plans/vast-zooming-bentley.md`

---

## Useful Commands

```bash
# Development
npm run dev                   # Start dev server
npm run build                 # Build for production
npm start                     # Start production server

# Database
npm run db:migrate            # Run migrations
npm run db:push               # Push schema to database
npm run db:seed               # Run seed script
npm run db:studio             # Open Prisma Studio

# Linting
npm run lint                  # Run ESLint

# Prisma
npx prisma migrate dev        # Create and apply migration
npx prisma migrate status     # Check migration status
npx prisma db pull            # Introspect existing database
```

---

## Progress Checklist

- ✅ Next.js 15 project created
- ✅ Dependencies installed (Prisma, NextAuth, Sharp, Zod, etc.)
- ✅ Prisma initialized with PostgreSQL
- ✅ Database schema defined (8 models)
- ✅ Environment variables configured
- ✅ Seed script created (6 pages, navigation, footer, admin)
- ⬜ (NEXT) Database migration
- ⬜ Run seed script
- ⬜ Start development server
- ⬜ Phase 2: NextAuth authentication

---

Created: 2026-02-12
Plan: `/Users/jeonminjun/.claude/plans/vast-zooming-bentley.md`
