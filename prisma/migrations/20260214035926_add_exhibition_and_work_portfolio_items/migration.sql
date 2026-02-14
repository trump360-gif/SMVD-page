-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SectionType" ADD VALUE 'HOME_HERO';
ALTER TYPE "SectionType" ADD VALUE 'EXHIBITION_SECTION';
ALTER TYPE "SectionType" ADD VALUE 'HOME_ABOUT';

-- CreateTable
CREATE TABLE "exhibition_items" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibition_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_portfolios" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exhibition_items_section_id_idx" ON "exhibition_items"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "exhibition_items_section_id_order_key" ON "exhibition_items"("section_id", "order");

-- CreateIndex
CREATE INDEX "work_portfolios_section_id_idx" ON "work_portfolios"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_portfolios_section_id_order_key" ON "work_portfolios"("section_id", "order");

-- AddForeignKey
ALTER TABLE "exhibition_items" ADD CONSTRAINT "exhibition_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exhibition_items" ADD CONSTRAINT "exhibition_items_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_portfolios" ADD CONSTRAINT "work_portfolios_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_portfolios" ADD CONSTRAINT "work_portfolios_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
