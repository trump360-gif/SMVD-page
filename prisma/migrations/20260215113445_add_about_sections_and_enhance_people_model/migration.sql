-- Add About page section types to SectionType enum
-- Migration created: 2026-02-15
-- Purpose: Enable CMS management for About page (Intro, Vision, History, People sections)

-- Step 1: Add new SectionType enum values
ALTER TYPE "SectionType" ADD VALUE IF NOT EXISTS 'ABOUT_INTRO';
ALTER TYPE "SectionType" ADD VALUE IF NOT EXISTS 'ABOUT_VISION';
ALTER TYPE "SectionType" ADD VALUE IF NOT EXISTS 'ABOUT_HISTORY';
ALTER TYPE "SectionType" ADD VALUE IF NOT EXISTS 'ABOUT_PEOPLE';

-- Step 2: Enhance People model for detailed professor/instructor information

-- Add new columns to people table
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "role" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "office" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "homepage" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "major" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "specialty" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "badge" TEXT;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "courses" JSONB;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "biography" JSONB;
ALTER TABLE "people" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMP(3);

-- Change email field from String to String[] (array)
-- First, check if email column exists and is not already an array
DO $$
BEGIN
  -- Drop the old email column if it exists and is not an array
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people'
    AND column_name = 'email'
    AND data_type != 'ARRAY'
  ) THEN
    ALTER TABLE "people" DROP COLUMN "email";
  END IF;

  -- Add email as TEXT[] if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'people'
    AND column_name = 'email'
  ) THEN
    ALTER TABLE "people" ADD COLUMN "email" TEXT[];
  END IF;
END $$;

-- Drop bio column (replaced by biography JSON field)
ALTER TABLE "people" DROP COLUMN IF EXISTS "bio";

-- Step 3: Add foreign key constraint for people.mediaId -> media.id
-- (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'people_media_id_fkey'
  ) THEN
    ALTER TABLE "people"
    ADD CONSTRAINT "people_media_id_fkey"
    FOREIGN KEY ("media_id")
    REFERENCES "media"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 4: Create index for better query performance
CREATE INDEX IF NOT EXISTS "people_role_idx" ON "people"("role");
CREATE INDEX IF NOT EXISTS "people_published_idx" ON "people"("published");
CREATE INDEX IF NOT EXISTS "people_archived_at_idx" ON "people"("archived_at");
