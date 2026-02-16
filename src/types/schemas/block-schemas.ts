/**
 * Block Content Zod Validation Schemas
 *
 * Provides type-safe validation for all 15 block types used in the
 * BlockEditor. Used in API routes to validate incoming content payloads.
 *
 * These schemas mirror the TypeScript interfaces in
 * src/components/admin/shared/BlockEditor/types.ts
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

const FontWeightSchema = z.enum(['400', '500', '700']);

const ImageDataSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().optional(),
});

const GalleryImageEntrySchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string().optional(),
});

const ImageGridRowSchema = z.object({
  id: z.string(),
  columns: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  imageCount: z.number().int().min(0),
});

// ---------------------------------------------------------------------------
// Base block fields (present on every block)
// ---------------------------------------------------------------------------

const BaseBlockSchema = z.object({
  id: z.string(),
  order: z.number().int().min(0),
});

// ---------------------------------------------------------------------------
// Individual block type schemas
// ---------------------------------------------------------------------------

export const TextBlockSchema = BaseBlockSchema.extend({
  type: z.literal('text'),
  content: z.string(),
  fontSize: z.number().optional(),
  fontWeight: FontWeightSchema.optional(),
  color: z.string().optional(),
  lineHeight: z.number().optional(),
});

export const HeadingBlockSchema = BaseBlockSchema.extend({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  content: z.string(),
});

export const ImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('image'),
  url: z.string(),
  alt: z.string(),
  caption: z.string(),
  size: z.enum(['small', 'medium', 'large', 'full']),
  align: z.enum(['left', 'center', 'right']),
});

export const GalleryBlockSchema = BaseBlockSchema.extend({
  type: z.literal('gallery'),
  images: z.array(GalleryImageEntrySchema),
  layout: z.enum(['1+2+3', 'grid', 'auto']).optional(),
  imageLayout: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export const SpacerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('spacer'),
  height: z.enum(['small', 'medium', 'large']),
});

export const DividerBlockSchema = BaseBlockSchema.extend({
  type: z.literal('divider'),
  style: z.enum(['solid', 'dashed', 'dotted']).optional(),
});

export const HeroImageBlockSchema = BaseBlockSchema.extend({
  type: z.literal('hero-image'),
  url: z.string(),
  alt: z.string(),
});

export const HeroSectionBlockSchema = BaseBlockSchema.extend({
  type: z.literal('hero-section'),
  url: z.string(),
  alt: z.string(),
  title: z.string(),
  author: z.string(),
  email: z.string(),
  titleFontSize: z.number().optional(),
  authorFontSize: z.number().optional(),
  gap: z.number().optional(),
  titleFontWeight: FontWeightSchema.optional(),
  authorFontWeight: FontWeightSchema.optional(),
  emailFontWeight: FontWeightSchema.optional(),
  titleColor: z.string().optional(),
  authorColor: z.string().optional(),
  emailColor: z.string().optional(),
  overlayPosition: z.enum(['bottom-left', 'bottom-right', 'center', 'none']).optional(),
  overlayOpacity: z.number().optional(),
  overlayBackground: z.string().optional(),
});

export const WorkTitleBlockSchema = BaseBlockSchema.extend({
  type: z.literal('work-title'),
  title: z.string(),
  author: z.string(),
  email: z.string(),
  titleFontSize: z.number().optional(),
  authorFontSize: z.number().optional(),
  gap: z.number().optional(),
  titleFontWeight: FontWeightSchema.optional(),
  authorFontWeight: FontWeightSchema.optional(),
  emailFontWeight: FontWeightSchema.optional(),
  titleColor: z.string().optional(),
  authorColor: z.string().optional(),
  emailColor: z.string().optional(),
});

export const WorkMetadataBlockSchema = BaseBlockSchema.extend({
  type: z.literal('work-metadata'),
  author: z.string(),
  email: z.string(),
});

export const WorkLayoutConfigBlockSchema = BaseBlockSchema.extend({
  type: z.literal('work-layout-config'),
  columnLayout: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  columnGap: z.number().optional(),
  textColumnWidth: z.enum(['auto', 'narrow', 'wide']).optional(),
});

export const ImageRowBlockSchema = BaseBlockSchema.extend({
  type: z.literal('image-row'),
  images: z.array(ImageDataSchema),
  distribution: z.enum(['equal', 'golden-left', 'golden-center', 'golden-right']).optional(),
  imageHeight: z.number().optional(),
  gap: z.number().optional(),
});

export const ImageGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('image-grid'),
  images: z.array(ImageDataSchema),
  rows: z.array(ImageGridRowSchema),
  gap: z.number().optional(),
  aspectRatio: z.union([z.literal(1), z.literal(1.5), z.literal(2)]).optional(),
});

// Layout container blocks use z.lazy() because they contain nested blocks.
// We use z.any() for children to avoid infinite recursion in Zod schemas;
// the TypeScript types already enforce correct nesting, and validateBlockTree()
// provides runtime depth/nesting validation.

export const LayoutRowBlockSchema = BaseBlockSchema.extend({
  type: z.literal('layout-row'),
  columns: z.union([z.literal(2), z.literal(3)]),
  children: z.array(z.array(z.any())),
  columnGap: z.number().optional(),
  distribution: z.enum(['equal', 'golden-left', 'golden-center', 'golden-right', 'custom']).optional(),
  customWidths: z.array(z.number()).optional(),
});

export const LayoutGridBlockSchema = BaseBlockSchema.extend({
  type: z.literal('layout-grid'),
  template: z.enum(['2x2', '3x1', '1x3', '2x3', 'auto']),
  children: z.array(z.array(z.any())),
  gap: z.number().optional(),
  minCellHeight: z.number().optional(),
});

// ---------------------------------------------------------------------------
// Unified block schema (discriminated union)
// ---------------------------------------------------------------------------

/**
 * Validates any single block against its type-specific schema.
 * Uses passthrough() to allow forward-compatible fields that newer
 * versions of the editor may add.
 */
export const BlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema.passthrough(),
  HeadingBlockSchema.passthrough(),
  ImageBlockSchema.passthrough(),
  GalleryBlockSchema.passthrough(),
  SpacerBlockSchema.passthrough(),
  DividerBlockSchema.passthrough(),
  HeroImageBlockSchema.passthrough(),
  HeroSectionBlockSchema.passthrough(),
  WorkTitleBlockSchema.passthrough(),
  WorkMetadataBlockSchema.passthrough(),
  WorkLayoutConfigBlockSchema.passthrough(),
  LayoutRowBlockSchema.passthrough(),
  LayoutGridBlockSchema.passthrough(),
  ImageRowBlockSchema.passthrough(),
  ImageGridBlockSchema.passthrough(),
]);

// ---------------------------------------------------------------------------
// Row config schema
// ---------------------------------------------------------------------------

export const RowConfigSchema = z.object({
  layout: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  blockCount: z.number().int().min(0),
});

// ---------------------------------------------------------------------------
// Top-level blog content schema
// ---------------------------------------------------------------------------

/**
 * Validates the complete BlogContent structure stored in DB content fields.
 * This is the primary schema used in API route validation.
 */
export const BlogContentSchema = z.object({
  blocks: z.array(BlockSchema),
  version: z.string(),
  rowConfig: z.array(RowConfigSchema).optional(),
});

export type ValidatedBlogContent = z.infer<typeof BlogContentSchema>;
