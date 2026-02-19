# Tiptap WYSIWYG Editor Migration Guide

## SMVD CMS - MarkdownEditor -> Tiptap WYSIWYG Editor

**Date:** 2026-02-19
**Status:** Analysis Complete / Implementation Pending
**Estimated Total Effort:** 40-50 hours (6 working days)

---

## Table of Contents

1. [Current System Analysis](#1-current-system-analysis)
2. [Migration Strategy](#2-migration-strategy)
3. [Implementation Plan (Phase-by-Phase)](#3-implementation-plan)
4. [Component Architecture](#4-component-architecture)
5. [Data Compatibility & Migration](#5-data-compatibility--migration)
6. [Risk Assessment & Mitigation](#6-risk-assessment--mitigation)
7. [Phase Checklists](#7-phase-checklists)
8. [Code Samples](#8-code-samples)
9. [Additional Features: Draft & Template](#9-additional-features-draft--template)
10. [Integrated Timeline](#10-integrated-timeline)

---

## 1. Current System Analysis

### 1.1 Backend: Image Upload System

**File:** `/src/app/api/admin/upload/route.ts` (159 lines)

| Feature | Current State | Notes |
|---------|--------------|-------|
| Max file size | 10MB | Sufficient for Tiptap image drops |
| Allowed types | JPEG, PNG, WebP, GIF, SVG | Standard image formats covered |
| WebP conversion | sharp library (80% quality) | Already implemented |
| Original backup | `/uploads/originals/{year}/{month}/` | Already saving originals |
| Thumbnail | 300x300 WebP (70% quality) | Already generating thumbnails |
| Magic byte validation | Custom file-validation.ts | Content-Type spoofing protection |
| DB record | Media model (Prisma) | filename, filepath, mimeType, size, width, height, altText, formats |

**Current API Response (POST /api/admin/upload):**
```json
{
  "success": true,
  "data": {
    "id": "cuid_xxx",
    "filename": "abc123.webp",
    "path": "/uploads/2026/02/abc123.webp",
    "width": 1200,
    "height": 800,
    "altText": "Description"
  },
  "message": "Image uploaded"
}
```

**Gap for Tiptap:** The API response is missing `originalPath` and `thumbnailPath`. The `saveProcessedImage` function returns them but the API route does not expose them. For Tiptap image resize we need `width` and `height` which are already returned.

### 1.2 Backend: Image Processing Pipeline

**File:** `/src/lib/image/process.ts` (189 lines)

| Step | Implementation | Output |
|------|---------------|--------|
| 1. Metadata extraction | sharp(buffer).metadata() | width, height, format |
| 2. WebP conversion | sharp(buffer).webp({ quality: 80 }) | webp buffer |
| 3. Thumbnail generation | sharp(buffer).resize(300, 300, fit:'cover').webp(70) | thumbnail buffer |
| 4. File storage | fs.writeFile to 3 paths | original + webp + thumbnail |
| 5. Path generation | `/uploads/{year}/{month}/{hash}.webp` | public URL path |

**File Storage Structure:**
```
public/uploads/
  2026/02/
    abc123.webp           # WebP converted (served to users)
    abc123-thumb.webp     # Thumbnail (300x300)
  originals/
    2026/02/
      abc123.png          # Original file preserved
```

**Assessment:** The backend image processing is already well-designed for Tiptap. No major changes needed except expanding the API response.

### 1.3 Frontend: Block Editor System

**Architecture Overview:**

```
BlockEditor System (Current)
|
+-- types.ts (617 lines) - 15 block types defined
|     TextBlock, HeadingBlock, ImageBlock, GalleryBlock,
|     SpacerBlock, DividerBlock, HeroImageBlock, HeroSectionBlock,
|     WorkTitleBlock, WorkMetadataBlock, WorkLayoutConfigBlock,
|     LayoutRowBlock, LayoutGridBlock, ImageRowBlock, ImageGridBlock
|
+-- useBlockEditor.ts (186 lines) - State management hook
|     blocks[], selectedId, addBlock, updateBlock, deleteBlock,
|     reorderBlocks, resetBlocks, undo/redo (50 step history)
|
+-- index.tsx (265 lines) - Main BlockEditor component
|     Split-view: Editor (60%) | Preview (40%)
|     Debounced sync (300ms), memoized preview
|
+-- BlockList.tsx (154 lines) - DnD sortable list
|     @dnd-kit/core + @dnd-kit/sortable
|
+-- BlockToolbar.tsx (157 lines) - Block type selector
|     15 block types in dropdown menu
|
+-- BlockEditorPanel.tsx (221 lines) - Selected block editor
|     Renders specific editor per block type (15 editors)
|
+-- blocks/
|     TextBlockEditor.tsx (136 lines) - textarea + styling controls
|     ImageBlockEditor.tsx (174 lines) - URL/upload + size/align
|     HeadingBlockEditor.tsx
|     GalleryBlockEditor.tsx
|     ... (15 editor components total)
|
+-- renderers/
|     TextBlockRenderer.tsx (106 lines) - ReactMarkdown rendering
|     BlockRenderer.tsx (397 lines) - All block type rendering
|     WorkDetailPreviewRenderer.tsx
|     NewsDetailPreviewRenderer.tsx
```

### 1.4 Frontend: Current Text Editing Experience

**TextBlockEditor.tsx** (the primary target for Tiptap replacement):
- Plain `<textarea>` for markdown input
- 4 styling controls: fontSize, fontWeight, color, lineHeight
- Live preview (text truncated to 100 chars)
- No formatting toolbar
- No WYSIWYG (users must write raw markdown)

**MarkdownEditor.tsx** (standalone, used less frequently):
- `<textarea>` with 9 toolbar buttons (Bold, Italic, H1-H3, UL, OL, HR, Link)
- 3 view modes: Edit, Preview, Split
- ReactMarkdown preview with remarkGfm
- DOMPurify sanitization
- Not directly integrated with BlockEditor

**TextBlockRenderer.tsx** (preview rendering):
- Detects markdown syntax via regex
- Uses ReactMarkdown + remarkGfm if markdown detected
- Falls back to plain `<p>` with pre-wrap for non-markdown
- Applies font styling (size, weight, color, lineHeight)

### 1.5 Frontend: Modal/Panel Architecture

**BlogEditorModal system:**
```
ModalShell.tsx        - Full-screen overlay, tabs, footer, keyboard
ThreePanelLayout.tsx  - Left 25% (visualizer) | Center 40% (editor) | Right 35% (preview)
TwoPanelLayout.tsx    - Left 37.5% (visualizer) | Right 62.5% (editor)
```

**Usage:**
- `WorkBlogModal.tsx` uses `TwoPanelLayout` (2 tabs: info + content)
- `NewsBlogModal.tsx` uses ThreePanelLayout/TwoPanelLayout

### 1.6 Data Storage Format

**BlogContent structure (types.ts):**
```typescript
interface BlogContent {
  blocks: Block[];
  version: string;        // Currently "1.0"
  rowConfig?: RowConfig[]; // Row-based layout
}
```

**TextBlock (the primary migration target):**
```typescript
interface TextBlock extends ContentBlock {
  type: 'text';
  content: string;          // Raw markdown string
  fontSize?: number;        // Default: 18
  fontWeight?: '400' | '500' | '700';
  color?: string;           // Default: '#1b1d1f'
  lineHeight?: number;      // Default: 1.8
}
```

**DB Storage:** `WorkProject.content` and `NewsEvent.content` are Prisma `Json?` fields storing the BlogContent object. The `WorkProject.description` field stores serialized JSON string of BlogContent (via `serializeContent()`).

### 1.7 Legacy Content Parser

**File:** `/src/lib/content-parser.ts` (263 lines)

Three parsers exist:
1. `parseContentFromDescription()` - Generic markdown-to-blocks
2. `parseWorkProjectContent()` - Work: markdown + galleryImages + heroImage -> blocks
3. `parseNewsContent()` - News: introTitle + introText + gallery -> blocks

All produce `BlogContent { blocks, version }` output.

### 1.8 ReactMarkdown Usage (8 files)

| File | Context | Replacement Impact |
|------|---------|-------------------|
| `TextBlockRenderer.tsx` | Block preview rendering | Must render Tiptap JSON |
| `BlockRenderer.tsx` | Generic preview | Must render Tiptap JSON |
| `MarkdownEditor.tsx` | Standalone editor (preview pane) | Replaced entirely by Tiptap |
| `WorkDetailContent.tsx` | Public work detail page | Must handle both formats |
| `NewsEventDetailContent.tsx` | Public news detail page | Must handle both formats |
| `NewsBlockRenderer.tsx` | Public news block rendering | Must handle both formats |
| `ColumnLayoutPreview.tsx` | Work preview column layout | Must render Tiptap JSON |
| `NewsDetailPreviewRenderer.tsx` | News preview rendering | Must render Tiptap JSON |

---

## 2. Migration Strategy

### 2.1 Core Principle: TextBlock Content Format Change

**Before (Markdown string):**
```typescript
interface TextBlock {
  type: 'text';
  content: string;  // "# Hello\n**Bold** text"
}
```

**After (Tiptap JSON):**
```typescript
interface TextBlock {
  type: 'text';
  content: string | TiptapContent;  // Tiptap JSON or legacy string
  contentFormat?: 'markdown' | 'tiptap';  // New field for format detection
  fontSize?: number;
  fontWeight?: '400' | '500' | '700';
  color?: string;
  lineHeight?: number;
}

interface TiptapContent {
  type: 'doc';
  content: TiptapNode[];
}

interface TiptapNode {
  type: string;  // 'paragraph', 'heading', 'image', etc.
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

interface TiptapMark {
  type: string;  // 'bold', 'italic', 'link', etc.
  attrs?: Record<string, unknown>;
}
```

### 2.2 Backward Compatibility Strategy

1. **Dual-format rendering:** TextBlockRenderer detects `contentFormat` field:
   - `'tiptap'` or object with `type: 'doc'` -> render via Tiptap's `generateHTML()`
   - `'markdown'` or plain string -> render via ReactMarkdown (existing logic)
2. **No forced migration:** Existing content stays as markdown until user edits it
3. **Auto-upgrade on edit:** When user opens a TextBlock with markdown content in the editor, Tiptap loads it via markdown-to-Tiptap conversion. On save, it writes Tiptap JSON with `contentFormat: 'tiptap'`
4. **Version bump:** BlogContent version changes from "1.0" to "1.1" when Tiptap content is present

### 2.3 Scope of Tiptap Integration

| Component | Change | Complexity |
|-----------|--------|------------|
| **TextBlockEditor** | Replace textarea with TiptapEditor | High |
| **TextBlockRenderer** | Add Tiptap JSON rendering | Medium |
| **BlockRenderer** | Update text rendering | Low |
| **MarkdownEditor** | Deprecated (keep as fallback) | Low |
| **ImageBlockEditor** | Add drag-drop upload | Medium |
| **Upload API** | Expand response format | Low |
| **WorkDetailContent** | Dual-format rendering | Medium |
| **NewsEventDetailContent** | Dual-format rendering | Medium |
| **types.ts** | Add TiptapContent type, contentFormat field | Low |
| **content-parser.ts** | Add Tiptap<->Markdown conversion | Medium |

### 2.4 Not in Scope (Phase 1)

- Replacing HeadingBlock with Tiptap headings (keep as separate block)
- Replacing ImageBlock with inline Tiptap images (keep as separate block)
- Removing the block-based architecture (Tiptap augments, doesn't replace)
- Full removal of ReactMarkdown (still needed for legacy rendering)

---

## 3. Implementation Plan

### Phase 1: Backend Preparation (4 hours)

#### 1.1 Expand Upload API Response

**File:** `/src/app/api/admin/upload/route.ts`

**Changes:**
- Include `originalPath` and `thumbnailPath` in response
- Add `mimeType` and `size` fields for client-side use

**Target Response:**
```json
{
  "success": true,
  "data": {
    "id": "cuid_xxx",
    "filename": "abc123.webp",
    "path": "/uploads/2026/02/abc123.webp",
    "originalPath": "/uploads/originals/2026/02/abc123.png",
    "thumbnailPath": "/uploads/2026/02/abc123-thumb.webp",
    "width": 1200,
    "height": 800,
    "size": 45678,
    "mimeType": "image/webp",
    "altText": "Description"
  }
}
```

#### 1.2 Add Tiptap Content Types

**File:** `/src/components/admin/shared/BlockEditor/types.ts`

**Changes:**
- Add `TiptapContent`, `TiptapNode`, `TiptapMark` interfaces
- Add `contentFormat?: 'markdown' | 'tiptap'` to TextBlock
- Export new types

#### 1.3 Add Markdown-to-Tiptap Conversion Utility

**New File:** `/src/lib/tiptap/markdown-converter.ts`

**Functions:**
- `markdownToTiptapJSON(markdown: string): TiptapContent` - Convert legacy markdown to Tiptap JSON
- `tiptapJSONToHTML(json: TiptapContent, extensions: Extensions[]): string` - Render Tiptap JSON to HTML
- `isLegacyMarkdown(content: string | TiptapContent): boolean` - Detect content format

#### 1.4 Tests

- Verify upload API returns expanded response
- Verify markdown conversion produces valid Tiptap JSON
- Verify backward compatibility with existing content

---

### Phase 2: Tiptap Editor Component (16 hours)

#### 2.1 Install Dependencies

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm
npm install @tiptap/extension-image @tiptap/extension-link
npm install @tiptap/extension-underline @tiptap/extension-placeholder
npm install @tiptap/extension-text-align @tiptap/extension-color
npm install @tiptap/extension-text-style @tiptap/extension-highlight
npm install @tiptap/extension-code-block-lowlight
```

**Estimated bundle size impact:** ~120KB gzipped (Tiptap core + extensions). Acceptable for admin-only pages.

#### 2.2 Core TiptapEditor Component

**New File:** `/src/components/admin/shared/TiptapEditor/TiptapEditor.tsx`

```
src/components/admin/shared/TiptapEditor/
  index.ts                    # Re-exports
  TiptapEditor.tsx            # Main editor component (~200 lines)
  TiptapToolbar.tsx           # Formatting toolbar (~150 lines)
  TiptapImageExtension.ts     # Custom image extension (~100 lines)
  TiptapImageResizer.tsx      # Image resize handles (~120 lines)
  TiptapImageUploadHandler.ts # Drag & drop upload logic (~80 lines)
  types.ts                    # Tiptap-specific types (~30 lines)
  styles.css                  # Editor styles (~50 lines)
```

**TiptapEditor Props:**
```typescript
interface TiptapEditorProps {
  content: string | TiptapContent;    // Markdown string or Tiptap JSON
  contentFormat?: 'markdown' | 'tiptap';
  onChange: (content: TiptapContent) => void;
  onImageUpload?: (file: File) => Promise<ImageUploadResult>;
  placeholder?: string;
  // Styling props (passed through from TextBlock)
  fontSize?: number;
  fontWeight?: '400' | '500' | '700';
  color?: string;
  lineHeight?: number;
}
```

#### 2.3 Tiptap Extensions Configuration

```typescript
const extensions = [
  // Core
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: false, // Use lowlight version instead
  }),
  // Typography
  Underline,
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  // Code
  CodeBlockLowlight.configure({ lowlight }),
  // Media
  Link.configure({ openOnClick: false }),
  CustomImage.configure({ // Custom extension
    inline: false,
    allowBase64: false,
    HTMLAttributes: { class: 'tiptap-image' },
  }),
  // UX
  Placeholder.configure({ placeholder: 'Start writing...' }),
];
```

#### 2.4 Toolbar Design

**15 buttons organized in groups:**

```
[B] [I] [U] [S] | [H1] [H2] [H3] | [UL] [OL] [Quote] | [Code] [CodeBlock] | [Link] [Image] [Align]
```

| Group | Buttons | Description |
|-------|---------|-------------|
| Text Format | Bold, Italic, Underline, Strikethrough | Inline formatting |
| Headings | H1, H2, H3 | Block-level headings |
| Lists | Bullet List, Ordered List, Blockquote | Block-level lists |
| Code | Inline Code, Code Block | Code formatting |
| Media | Link, Image | Insert media |
| Alignment | Left, Center, Right | Text alignment |

#### 2.5 Custom Image Extension

**Features:**
- Drag & drop file upload (auto WebP conversion via existing API)
- Click to upload (file picker)
- Paste from clipboard
- Image resize via drag handles (4 corners)
- Alignment options: left, center, right, full-width
- Caption input field
- Loading indicator during upload
- Error handling (file size, format)

**Image Node Schema:**
```typescript
{
  type: 'image',
  attrs: {
    src: '/uploads/2026/02/abc123.webp',
    alt: 'Description',
    title: 'Caption text',
    width: 600,
    height: 400,
    align: 'center',  // 'left' | 'center' | 'right' | 'full'
    originalSrc: '/uploads/originals/2026/02/abc123.png',
  }
}
```

#### 2.6 Image Upload Handler

```typescript
async function handleImageUpload(file: File): Promise<ImageUploadResult> {
  // 1. Validate client-side (size < 10MB, type check)
  // 2. Create FormData
  // 3. POST to /api/admin/upload
  // 4. Return { src, originalSrc, width, height }
}
```

**Integration points:**
- `editor.commands.setImage()` after upload completes
- Placeholder during upload (blur + loading spinner)
- Error toast on failure

---

### Phase 3: Integration with Block Editor (8 hours)

#### 3.1 Replace TextBlockEditor

**File:** `/src/components/admin/shared/BlockEditor/blocks/TextBlockEditor.tsx`

**Before:** `<textarea>` + styling controls
**After:** `<TiptapEditor>` + styling controls (fontSize, fontWeight, color, lineHeight remain)

**Key changes:**
- Replace `<textarea>` with `<TiptapEditor>`
- Pass `content` and `contentFormat` props
- On change: update block with Tiptap JSON + set `contentFormat: 'tiptap'`
- Keep styling controls (they apply as CSS wrapper around Tiptap output)

#### 3.2 Update TextBlockRenderer (Preview)

**File:** `/src/components/admin/shared/BlockEditor/renderers/TextBlockRenderer.tsx`

**Before:** ReactMarkdown for all content
**After:** Dual rendering:

```typescript
function TextBlockRenderer({ block }: { block: TextBlock }) {
  const isTiptap = block.contentFormat === 'tiptap' ||
    (typeof block.content === 'object' && block.content?.type === 'doc');

  if (isTiptap) {
    // Use Tiptap's generateHTML() for rendering
    const html = generateHTML(block.content as TiptapContent, extensions);
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Legacy: ReactMarkdown rendering (unchanged)
  return <ReactMarkdown ...>{sanitizeContent(block.content)}</ReactMarkdown>;
}
```

#### 3.3 Update BlockRenderer

**File:** `/src/components/admin/shared/BlockEditor/renderers/BlockRenderer.tsx`

- Update the text block case to use the updated TextBlockRenderer
- No other block types affected in Phase 1

#### 3.4 Update Public Page Renderers

**Files:**
- `/src/components/public/work/WorkDetailContent.tsx`
- `/src/components/public/news/NewsEventDetailContent.tsx`
- `/src/components/public/news/NewsBlockRenderer.tsx`

Each must detect Tiptap content and use `generateHTML()` instead of ReactMarkdown.

#### 3.5 Update Content Parser

**File:** `/src/lib/content-parser.ts`

- `parseContentFromDescription()`: Preserve `contentFormat` field if present
- `parseWorkProjectContent()`: Same
- `parseNewsContent()`: Same
- New: `upgradeLegacyTextBlock()`: Convert markdown TextBlock to Tiptap on load

---

### Phase 4: Data Migration Script (4 hours)

#### 4.1 Migration Approach: Lazy Migration

**No bulk migration.** Content is converted on first edit:

1. User opens TextBlock in admin editor
2. If `contentFormat` is missing or `'markdown'`, convert to Tiptap JSON
3. On save, write Tiptap JSON with `contentFormat: 'tiptap'`
4. Old content is preserved in `description` field as backup

#### 4.2 Optional Bulk Migration Script

**New File:** `/scripts/migrate-markdown-to-tiptap.ts`

For pre-converting all existing content (optional, can run after Phase 3):

```typescript
// 1. Read all WorkProject records
// 2. For each: parse content -> find TextBlocks -> convert markdown to Tiptap JSON
// 3. Save with contentFormat: 'tiptap'
// Same for NewsEvent records
```

**Safety measures:**
- `--dry-run` flag for preview
- Backup original content in separate JSON field
- Transaction-based (all or nothing per record)
- Verification step: compare markdown output vs Tiptap output

#### 4.3 Rollback Plan

If Tiptap migration causes issues:
1. `contentFormat` field makes rollback trivial
2. Set `contentFormat: 'markdown'` to force legacy rendering
3. Original markdown preserved in DB
4. Bulk rollback script can be written if needed

---

### Phase 5: Testing & Validation (6 hours)

#### 5.1 Functional Tests

| Test | Description |
|------|-------------|
| New TextBlock creation | Create text via Tiptap, verify JSON saved |
| Edit existing markdown | Open markdown block, verify conversion |
| Image drag & drop | Drop image into editor, verify upload + insert |
| Image resize | Drag resize handle, verify width/height saved |
| Image alignment | Set left/center/right/full, verify rendering |
| Undo/Redo | Verify Ctrl+Z/Y works within Tiptap |
| Copy/Paste | Paste from Word/Google Docs, verify clean conversion |
| Link insertion | Add link, verify href and text |
| Code blocks | Add code block, verify syntax highlighting |
| Preview rendering | Verify preview matches editor content |
| Public page | Verify Tiptap content renders on public pages |
| Legacy content | Verify old markdown content still renders |

#### 5.2 Performance Tests

| Metric | Target | Method |
|--------|--------|--------|
| Editor load time | < 500ms | Chrome DevTools |
| Typing latency | < 50ms | requestAnimationFrame profiling |
| Image upload time | < 3s for 5MB | Network timing |
| Preview update | < 200ms | Debounce measurement |
| Bundle size increase | < 150KB gzipped | webpack-bundle-analyzer |

#### 5.3 Browser Compatibility

- Chrome 100+ (primary)
- Safari 16+ (secondary)
- Firefox 110+ (secondary)

---

### Phase 6: Deployment (2 hours)

1. Deploy to staging/preview environment
2. Test with real admin users
3. Monitor error logs
4. Deploy to production
5. Monitor for 48 hours

---

## 4. Component Architecture

### 4.1 New Component Tree

```
TiptapEditor/
  index.ts                          # Re-exports
  TiptapEditor.tsx                  # Main wrapper (~200 lines)
  |
  +-- TiptapToolbar.tsx             # Formatting toolbar (~150 lines)
  |     +-- ToolbarButton.tsx       # Single toolbar button
  |     +-- ToolbarDivider.tsx      # Visual separator
  |     +-- AlignmentMenu.tsx       # Alignment dropdown
  |     +-- LinkDialog.tsx          # Link insertion dialog
  |
  +-- extensions/
  |     +-- CustomImage.ts          # Image node extension (~100 lines)
  |     +-- ImageResizer.tsx        # Resize handles component (~120 lines)
  |     +-- ImageUploadPlugin.ts    # ProseMirror plugin for upload (~80 lines)
  |
  +-- hooks/
  |     +-- useImageUpload.ts       # Upload logic hook (~60 lines)
  |
  +-- styles/
  |     +-- tiptap-editor.css       # Editor-specific styles (~50 lines)
  |
  +-- types.ts                      # TiptapContent, TiptapNode, etc.
```

### 4.2 Integration Points

```
WorkBlogModal
  +-- TwoPanelLayout
        +-- BlockLayoutVisualizer (unchanged)
        +-- BlockEditorPanel
              +-- TextBlockEditor (MODIFIED)
              |     +-- TiptapEditor (NEW)  <-- Tiptap replaces textarea
              |     +-- Styling controls (unchanged)
              |
              +-- ImageBlockEditor (ENHANCED)
              |     +-- Drag & drop upload (NEW)
              |
              +-- [Other block editors unchanged]
```

### 4.3 Data Flow

```
User types in Tiptap
    |
    v
Tiptap editor.getJSON()  -->  TiptapContent (JSON)
    |
    v
TextBlockEditor.onChange({ content: tiptapJSON, contentFormat: 'tiptap' })
    |
    v
useBlockEditor.updateBlock()  -->  blocks state update
    |
    v
Debounced sync (300ms)  -->  BlogContent update
    |
    v
Save to DB (WorkProject.content / NewsEvent.content)
    |
    v
Public page loads  -->  detect contentFormat
    |
    v
contentFormat === 'tiptap'
    ? generateHTML(content, extensions)    // Tiptap rendering
    : ReactMarkdown(sanitize(content))     // Legacy rendering
```

---

## 5. Data Compatibility & Migration

### 5.1 Content Format Detection Logic

```typescript
function detectContentFormat(block: TextBlock): 'tiptap' | 'markdown' {
  // Explicit format field
  if (block.contentFormat === 'tiptap') return 'tiptap';
  if (block.contentFormat === 'markdown') return 'markdown';

  // Auto-detect from content structure
  if (typeof block.content === 'object' && block.content !== null) {
    if ('type' in block.content && block.content.type === 'doc') {
      return 'tiptap';
    }
  }

  // Default: markdown (backward compatible)
  return 'markdown';
}
```

### 5.2 Markdown to Tiptap Conversion Rules

| Markdown | Tiptap Node | Notes |
|----------|-------------|-------|
| `# Heading` | `{ type: 'heading', attrs: { level: 1 } }` | H1-H3 |
| `**bold**` | `{ marks: [{ type: 'bold' }] }` | Inline mark |
| `*italic*` | `{ marks: [{ type: 'italic' }] }` | Inline mark |
| `- item` | `{ type: 'bulletList' > 'listItem' }` | Nested structure |
| `1. item` | `{ type: 'orderedList' > 'listItem' }` | Nested structure |
| `> quote` | `{ type: 'blockquote' }` | Block level |
| `[text](url)` | `{ marks: [{ type: 'link', attrs: { href } }] }` | With href attr |
| `` `code` `` | `{ marks: [{ type: 'code' }] }` | Inline code |
| `---` | `{ type: 'horizontalRule' }` | Block level |
| `![alt](url)` | `{ type: 'image', attrs: { src, alt } }` | Image node |
| Plain text | `{ type: 'paragraph' }` | Default wrapper |

### 5.3 Version Strategy

| Version | Format | Description |
|---------|--------|-------------|
| 1.0 | Markdown | Current format (all existing content) |
| 1.1 | Mixed | Tiptap content possible, markdown still supported |
| 2.0 | Tiptap-only | Future: after all content migrated (Phase 2 of project) |

### 5.4 Affected Database Records

| Model | Field | Count (est.) | Migration |
|-------|-------|-------------|-----------|
| WorkProject | content (Json?) | ~12 projects | Lazy (on edit) |
| WorkProject | description (String) | ~12 projects | Lazy (on edit) |
| NewsEvent | content (Json?) | ~10 articles | Lazy (on edit) |

**Total records to migrate:** ~22 records. Very manageable for lazy migration.

---

## 6. Risk Assessment & Mitigation

### 6.1 Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Bundle size increase | High | Medium | Tree-shake unused extensions; dynamic import for admin pages only |
| Markdown conversion lossy | Medium | High | Keep original markdown in DB; dual rendering; manual review |
| Tiptap version conflicts | Low | High | Pin exact versions; test before upgrade |
| Image upload failures | Low | Medium | Retry logic; error toast; fallback to URL input |
| Mobile admin editing | Medium | Medium | Tiptap has mobile support; test on iPad |
| ProseMirror learning curve | Medium | Low | Admin users are tech-savvy; provide tooltip help |
| XSS via Tiptap HTML output | Low | High | Sanitize with DOMPurify before `dangerouslySetInnerHTML` |
| Performance with large content | Low | Medium | Virtual scrolling for very long documents |
| Undo/Redo conflict | Medium | Low | Tiptap has built-in history; coordinate with BlockEditor undo |

### 6.2 Critical Decisions

1. **Keep block-based architecture:** Tiptap replaces TextBlock's textarea only. Other block types (Image, Gallery, Layout) remain unchanged. This minimizes risk.

2. **Dual rendering forever (or until explicit migration):** Never silently convert markdown to Tiptap in the DB without user action. This ensures no data corruption.

3. **Admin-only Tiptap bundle:** Use `next/dynamic` to load Tiptap only on admin pages. Public pages use `generateHTML()` (server-side, no Tiptap client bundle).

4. **DOMPurify on Tiptap HTML output:** Even though Tiptap sanitizes input, always sanitize output with the existing `isomorphic-dompurify` before rendering.

---

## 7. Phase Checklists

### Phase 1: Backend Preparation (4 hours)

```
[ ] 1.1 Expand upload API response
    [ ] Add originalPath to response
    [ ] Add thumbnailPath to response
    [ ] Add mimeType and size to response
    [ ] Test: verify expanded response format

[ ] 1.2 Add Tiptap content types
    [ ] Add TiptapContent interface to types.ts
    [ ] Add TiptapNode interface
    [ ] Add TiptapMark interface
    [ ] Add contentFormat field to TextBlock
    [ ] Update createDefaultBlock() for text type
    [ ] Export new types from index.ts

[ ] 1.3 Add markdown-to-Tiptap converter
    [ ] Create /src/lib/tiptap/markdown-converter.ts
    [ ] Implement markdownToTiptapJSON()
    [ ] Implement isLegacyMarkdown()
    [ ] Test: convert sample markdown strings
    [ ] Test: handle edge cases (empty, code blocks, nested lists)

[ ] 1.4 Verify TypeScript
    [ ] npx tsc --noEmit (0 errors)
    [ ] npm run build (all pages)
```

### Phase 2: Tiptap Editor Component (16 hours)

```
[ ] 2.1 Install dependencies
    [ ] npm install @tiptap/react @tiptap/starter-kit @tiptap/pm
    [ ] npm install @tiptap/extension-image @tiptap/extension-link
    [ ] npm install @tiptap/extension-underline @tiptap/extension-placeholder
    [ ] npm install @tiptap/extension-text-align @tiptap/extension-color
    [ ] npm install @tiptap/extension-text-style
    [ ] Verify: no peer dependency conflicts

[ ] 2.2 Create TiptapEditor component
    [ ] Create folder structure: /src/components/admin/shared/TiptapEditor/
    [ ] Implement TiptapEditor.tsx (main component)
    [ ] Implement extensions configuration
    [ ] Implement content loading (markdown auto-convert)
    [ ] Implement onChange handler (emit Tiptap JSON)
    [ ] Test: basic text editing works

[ ] 2.3 Create TiptapToolbar
    [ ] Implement TiptapToolbar.tsx
    [ ] Add text formatting buttons (B, I, U, S)
    [ ] Add heading buttons (H1, H2, H3)
    [ ] Add list buttons (UL, OL, Blockquote)
    [ ] Add code buttons (Code, CodeBlock)
    [ ] Add link button with dialog
    [ ] Add image button
    [ ] Add alignment buttons
    [ ] Test: all toolbar buttons work correctly

[ ] 2.4 Create Custom Image Extension
    [ ] Implement CustomImage.ts (Tiptap node extension)
    [ ] Add attrs: src, alt, title, width, height, align, originalSrc
    [ ] Implement image node view (rendering)
    [ ] Test: image insertion works

[ ] 2.5 Implement Image Resize
    [ ] Create ImageResizer.tsx
    [ ] Add 4-corner resize handles
    [ ] Implement drag-to-resize logic
    [ ] Update image attrs on resize
    [ ] Maintain aspect ratio during resize
    [ ] Test: resize works smoothly

[ ] 2.6 Implement Image Upload Handler
    [ ] Create useImageUpload.ts hook
    [ ] Implement drag & drop detection
    [ ] Implement file validation (size, type)
    [ ] Implement upload to /api/admin/upload
    [ ] Show loading placeholder during upload
    [ ] Insert image node after upload completes
    [ ] Handle upload errors with toast
    [ ] Test: drag & drop upload works
    [ ] Test: clipboard paste works

[ ] 2.7 Editor styles
    [ ] Create tiptap-editor.css
    [ ] Style editor container
    [ ] Style toolbar (active states, hover)
    [ ] Style image resize handles
    [ ] Style placeholder text
    [ ] Match existing admin design language

[ ] 2.8 Verify
    [ ] npx tsc --noEmit (0 errors)
    [ ] Storybook or standalone test page
```

### Phase 3: Block Editor Integration (8 hours)

```
[ ] 3.1 Replace TextBlockEditor
    [ ] Import TiptapEditor into TextBlockEditor
    [ ] Replace <textarea> with <TiptapEditor>
    [ ] Pass content + contentFormat props
    [ ] Wire onChange to updateBlock
    [ ] Keep fontSize, fontWeight, color, lineHeight controls
    [ ] Test: editing text blocks in BlockEditorPanel

[ ] 3.2 Update TextBlockRenderer
    [ ] Add Tiptap JSON detection
    [ ] Add generateHTML() rendering path
    [ ] Keep ReactMarkdown rendering path for legacy
    [ ] Add DOMPurify sanitization for HTML output
    [ ] Test: preview works for both formats

[ ] 3.3 Update BlockRenderer
    [ ] Ensure TextBlockRenderer changes propagate
    [ ] Test: generic preview renders Tiptap content

[ ] 3.4 Update public page renderers
    [ ] WorkDetailContent.tsx: add Tiptap rendering
    [ ] NewsEventDetailContent.tsx: add Tiptap rendering
    [ ] NewsBlockRenderer.tsx: add Tiptap rendering
    [ ] ColumnLayoutPreview.tsx: add Tiptap rendering
    [ ] NewsDetailPreviewRenderer.tsx: add Tiptap rendering
    [ ] Test: public pages render both formats

[ ] 3.5 Update content parser
    [ ] Preserve contentFormat in parseContentFromDescription()
    [ ] Preserve contentFormat in parseWorkProjectContent()
    [ ] Preserve contentFormat in parseNewsContent()
    [ ] Test: legacy content parsing unchanged

[ ] 3.6 Verify full integration
    [ ] Open WorkBlogModal -> create new project -> edit text block
    [ ] Open WorkBlogModal -> edit existing project -> text renders in Tiptap
    [ ] Open NewsBlogModal -> same tests
    [ ] Preview: admin preview matches
    [ ] Public page: content renders correctly
    [ ] npx tsc --noEmit (0 errors)
    [ ] npm run build (all pages)
```

### Phase 4: Data Migration Script (4 hours)

```
[ ] 4.1 Create migration script
    [ ] Create /scripts/migrate-markdown-to-tiptap.ts
    [ ] Read all WorkProject records
    [ ] Parse TextBlocks, convert markdown to Tiptap JSON
    [ ] Add contentFormat: 'tiptap' to converted blocks
    [ ] Update version to '1.1'
    [ ] Add --dry-run flag
    [ ] Add --verify flag (compare output)
    [ ] Same for NewsEvent records

[ ] 4.2 Test migration
    [ ] Run with --dry-run on dev DB
    [ ] Compare markdown rendering vs Tiptap rendering
    [ ] Verify no content loss
    [ ] Run actual migration on dev DB
    [ ] Verify admin editor loads migrated content
    [ ] Verify public pages render correctly

[ ] 4.3 Document rollback
    [ ] Write rollback procedure
    [ ] Test rollback on dev DB
```

### Phase 5: Testing & Validation (6 hours)

```
[ ] 5.1 Functional tests
    [ ] Create new text block with Tiptap
    [ ] Edit existing markdown block
    [ ] Image drag & drop upload
    [ ] Image resize
    [ ] Image alignment
    [ ] Undo/Redo
    [ ] Copy/Paste from external sources
    [ ] Link insertion and editing
    [ ] Code block creation
    [ ] Bold, italic, underline, strikethrough
    [ ] Headings H1-H3
    [ ] Bullet and ordered lists
    [ ] Blockquotes
    [ ] Preview synchronization
    [ ] Public page rendering
    [ ] Legacy content backward compatibility

[ ] 5.2 Performance tests
    [ ] Editor load time < 500ms
    [ ] Typing latency < 50ms
    [ ] Image upload < 3s (5MB file)
    [ ] Preview update < 200ms
    [ ] Bundle size impact < 150KB gzipped

[ ] 5.3 Cross-browser
    [ ] Chrome (primary)
    [ ] Safari
    [ ] Firefox

[ ] 5.4 Edge cases
    [ ] Empty content
    [ ] Very large content (10,000+ words)
    [ ] Multiple images in sequence
    [ ] Nested lists (3+ levels)
    [ ] Special characters (Korean, emoji)
    [ ] Concurrent editing (open same block in 2 tabs)
```

### Phase 6: Deployment (2 hours)

```
[ ] 6.1 Pre-deployment
    [ ] npx tsc --noEmit (0 errors)
    [ ] npm run build (all pages)
    [ ] Test on staging

[ ] 6.2 Deploy
    [ ] Deploy to production
    [ ] Verify admin pages load
    [ ] Verify public pages render

[ ] 6.3 Post-deployment
    [ ] Monitor error logs for 48 hours
    [ ] Check performance metrics
    [ ] Collect admin user feedback
```

---

## 8. Code Samples

### 8.1 TiptapEditor Component (Skeleton)

```tsx
// /src/components/admin/shared/TiptapEditor/TiptapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TiptapToolbar from './TiptapToolbar';
import { useImageUpload } from './hooks/useImageUpload';
import type { TiptapContent } from './types';
import './styles/tiptap-editor.css';

interface TiptapEditorProps {
  content: string | TiptapContent;
  contentFormat?: 'markdown' | 'tiptap';
  onChange: (content: TiptapContent) => void;
  placeholder?: string;
  fontSize?: number;
  fontWeight?: '400' | '500' | '700';
  color?: string;
  lineHeight?: number;
}

export default function TiptapEditor({
  content,
  contentFormat,
  onChange,
  placeholder = 'Start writing...',
  fontSize = 18,
  fontWeight = '400',
  color = '#1b1d1f',
  lineHeight = 1.8,
}: TiptapEditorProps) {
  const { handleImageUpload, isUploading } = useImageUpload();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'tiptap-link' },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'tiptap-image' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: resolveInitialContent(content, contentFormat),
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as TiptapContent);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        style: `font-size: ${fontSize}px; font-weight: ${fontWeight}; color: ${color}; line-height: ${lineHeight};`,
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            handleImageUpload(file, editor);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                handleImageUpload(file, editor);
                return true;
              }
            }
          }
        }
        return false;
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="tiptap-editor-wrapper border border-gray-300 rounded-lg overflow-hidden">
      <TiptapToolbar editor={editor} isUploading={isUploading} />
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4"
      />
    </div>
  );
}

function resolveInitialContent(
  content: string | TiptapContent,
  format?: 'markdown' | 'tiptap'
): TiptapContent | string {
  if (format === 'tiptap' || (typeof content === 'object' && content?.type === 'doc')) {
    return content as TiptapContent;
  }
  // For markdown: Tiptap can parse HTML, so convert markdown to HTML first
  // Or return as string and let Tiptap try to parse it
  if (typeof content === 'string' && content.trim()) {
    // Tiptap will attempt to parse plain text as paragraphs
    return content;
  }
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}
```

### 8.2 useImageUpload Hook (Skeleton)

```typescript
// /src/components/admin/shared/TiptapEditor/hooks/useImageUpload.ts
'use client';

import { useState, useCallback } from 'react';
import type { Editor } from '@tiptap/react';

interface ImageUploadResult {
  src: string;
  originalSrc: string;
  width: number;
  height: number;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = useCallback(async (file: File, editor: Editor | null) => {
    if (!editor || !file) return;

    // Client-side validation
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const { path, width, height, originalPath } = result.data;

      editor.chain().focus().setImage({
        src: path,
        alt: file.name,
        // Custom attrs from our extension:
        // width, height, originalSrc handled by CustomImage extension
      }).run();
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { handleImageUpload, isUploading };
}
```

### 8.3 TiptapToolbar Component (Skeleton)

```tsx
// /src/components/admin/shared/TiptapEditor/TiptapToolbar.tsx
'use client';

import { useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, TextQuote,
  Code, FileCode,
  Link2, ImageIcon,
  AlignLeft, AlignCenter, AlignRight,
} from 'lucide-react';

interface TiptapToolbarProps {
  editor: Editor;
  isUploading?: boolean;
}

export default function TiptapToolbar({ editor, isUploading }: TiptapToolbarProps) {
  const handleImageClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Trigger upload via the editor's drop handler or direct API call
        // This will be wired to useImageUpload
      }
    };
    input.click();
  }, []);

  const handleLinkClick = useCallback(() => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <TextQuote size={16} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Code */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline Code"
      >
        <Code size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <FileCode size={16} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Media */}
      <ToolbarButton
        onClick={handleLinkClick}
        isActive={editor.isActive('link')}
        title="Insert Link"
      >
        <Link2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={handleImageClick}
        disabled={isUploading}
        title="Insert Image"
      >
        <ImageIcon size={16} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight size={16} />
      </ToolbarButton>

      {/* Upload status */}
      {isUploading && (
        <span className="text-xs text-blue-600 ml-2 animate-pulse">
          Uploading image...
        </span>
      )}
    </div>
  );
}
```

### 8.4 Updated TextBlockEditor (Skeleton)

```tsx
// Modified: /src/components/admin/shared/BlockEditor/blocks/TextBlockEditor.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { TextBlock } from '../types';
import type { TiptapContent } from '@/components/admin/shared/TiptapEditor/types';

// Dynamic import: Tiptap only loaded on admin pages
const TiptapEditor = dynamic(
  () => import('@/components/admin/shared/TiptapEditor/TiptapEditor'),
  { ssr: false, loading: () => <div className="h-48 bg-gray-50 animate-pulse rounded" /> }
);

interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (data: Partial<TextBlock>) => void;
}

export default function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  const fontSize = block.fontSize ?? 18;
  const fontWeight = block.fontWeight ?? '400';
  const color = block.color ?? '#1b1d1f';
  const lineHeight = block.lineHeight ?? 1.8;

  const handleContentChange = (tiptapContent: TiptapContent) => {
    onChange({
      content: tiptapContent as unknown as string, // Store as JSON in content field
      contentFormat: 'tiptap',
    });
  };

  return (
    <div className="space-y-4">
      {/* Tiptap Editor (replaces textarea) */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Content</h3>
        <TiptapEditor
          content={block.content}
          contentFormat={block.contentFormat}
          onChange={handleContentChange}
          placeholder="Enter text content..."
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
          lineHeight={lineHeight}
        />
      </div>

      {/* Styling Section (unchanged) */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Text Styling</h3>
        {/* ... existing styling controls remain identical ... */}
      </div>
    </div>
  );
}
```

### 8.5 Updated TextBlockRenderer (Dual Format)

```tsx
// Modified: /src/components/admin/shared/BlockEditor/renderers/TextBlockRenderer.tsx
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import DOMPurify from 'isomorphic-dompurify';
import { sanitizeContent } from '@/lib/sanitize';
import type { TextBlock } from '../types';
import type { TiptapContent } from '@/components/admin/shared/TiptapEditor/types';

// Extensions for server-side HTML generation (subset of editor extensions)
const renderExtensions = [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link,
  Image,
];

function isTiptapContent(content: unknown): content is TiptapContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'type' in content &&
    (content as Record<string, unknown>).type === 'doc'
  );
}

export default function TextBlockRenderer({ block }: { block: TextBlock }) {
  if (!block.content) {
    return <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>Empty text block</p>;
  }

  const fontSize = block.fontSize ?? 18;
  const fontWeight = block.fontWeight ?? '400';
  const color = block.color ?? '#1b1d1f';
  const lineHeight = block.lineHeight ?? 1.8;

  const wrapperStyle = {
    fontSize: `${fontSize}px`,
    fontWeight,
    color,
    lineHeight: `${lineHeight}`,
    fontFamily: 'Pretendard, sans-serif',
  };

  // Detect Tiptap content
  const isTiptap = block.contentFormat === 'tiptap' || isTiptapContent(block.content);

  if (isTiptap) {
    const tiptapJSON = isTiptapContent(block.content)
      ? block.content
      : (typeof block.content === 'string' ? JSON.parse(block.content) : block.content);

    const html = generateHTML(tiptapJSON, renderExtensions);
    const sanitizedHTML = DOMPurify.sanitize(html);

    return (
      <div style={wrapperStyle} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
    );
  }

  // Legacy: Markdown rendering (unchanged from current implementation)
  const content = typeof block.content === 'string' ? block.content : '';

  return (
    <div style={wrapperStyle}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sanitizeContent(content)}
      </ReactMarkdown>
    </div>
  );
}
```

---

## 9. Additional Features: Draft & Template

### 9.1 Phase 7: Auto-Save Draft Feature (3-5 hours)

#### Requirement
- Auto-save editor content to browser localStorage every 30 seconds
- Show "Last auto-saved" timestamp
- On modal reopen, offer to recover draft
- Clear draft after successful publish

#### Implementation

**7.1 Create useAutoSave Hook**

**File:** `/src/hooks/useAutoSave.ts`

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';

interface DraftData {
  title: string;
  category: string;
  excerpt: string;
  editorContent: any;
  blocks: any[];
  savedAt: string;
}

export function useAutoSave(
  key: string,
  data: Omit<DraftData, 'savedAt'>,
  enabled: boolean = true
) {
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Auto-save every 30 seconds
    const interval = setInterval(() => {
      const draft: DraftData = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(`draft-${key}`, JSON.stringify(draft));
        setLastSavedTime(new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }));
      } catch (e) {
        console.error('Draft save failed:', e);
      }
    }, 30000); // 30 seconds

    // Save on page unload
    const handleBeforeUnload = () => {
      const draft: DraftData = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(`draft-${key}`, JSON.stringify(draft));
      } catch (e) {
        console.error('Draft save on unload failed:', e);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key, data, enabled]);

  const recoverDraft = useCallback((): DraftData | null => {
    try {
      const draft = localStorage.getItem(`draft-${key}`);
      return draft ? JSON.parse(draft) : null;
    } catch (e) {
      console.error('Draft recovery failed:', e);
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft-${key}`);
      setLastSavedTime(null);
    } catch (e) {
      console.error('Draft clear failed:', e);
    }
  }, [key]);

  return { lastSavedTime, recoverDraft, clearDraft };
}
```

**7.2 Integrate into NewsBlogModal / WorkBlogModal**

```typescript
// In NewsBlogModal.tsx
const { lastSavedTime, recoverDraft, clearDraft } = useAutoSave(
  `news-article-${article?.id || 'new'}`,
  { title, category, excerpt, editorContent, blocks },
  true // enabled
);

// On mount: offer draft recovery
useEffect(() => {
  const draft = recoverDraft();
  if (draft && draft.savedAt) {
    const shouldRecover = confirm(
      `Found auto-saved draft from ${new Date(draft.savedAt).toLocaleTimeString()}. Recover it?`
    );
    if (shouldRecover) {
      setTitle(draft.title);
      setCategory(draft.category);
      setExcerpt(draft.excerpt);
      setEditorContent(draft.editorContent);
      // ...
    }
  }
}, []);

// In modal header: show last saved time
{lastSavedTime && (
  <span className="text-xs text-gray-500 ml-4">
    Auto-saved: {lastSavedTime}
  </span>
)}

// On successful save: clear draft
const handleSuccessSave = async () => {
  // ... save logic
  clearDraft(); // Clear after successful publish
};
```

**7.3 Database Migration (Optional - for persistent drafts)**

```prisma
model Draft {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  articleId String?   // For news
  projectId String?   // For work
  category  String    // 'news' | 'work'

  // Content
  title     String?
  content   Json      // Full editor content
  blocks    Json?

  // Metadata
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, articleId, projectId])
  @@map("drafts")
}
```

API Endpoints:
```
POST /api/admin/drafts          # Save draft
GET /api/admin/drafts/:id       # Load draft
DELETE /api/admin/drafts/:id    # Clear draft
```

---

### 9.2 Phase 8: Template Save Feature (6-8 hours)

#### Requirement
- Save current block configuration as reusable template
- Load templates to pre-fill new articles/projects
- Set default template for category
- Manage templates (edit, delete, share)

#### Implementation

**8.1 Prisma Schema**

```prisma
model ContentTemplate {
  id          String    @id @default(cuid())
  name        String
  category    String    // 'news' | 'work'
  description String?

  // Template content
  blocks      Json      // BlogContent.blocks
  rowConfig   Json?     // Row layout config

  // Metadata
  isDefault   Boolean   @default(false)
  createdBy   String
  user        User      @relation(fields: [createdBy], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([category, name])
  @@map("content_templates")
}
```

**8.2 API Endpoints**

```typescript
// GET /api/admin/content-templates?category=news
// List all templates for a category
// Response: [{ id, name, description, isDefault, createdAt }]

// POST /api/admin/content-templates
// Save current blocks as template
// Body: { name, category, description, blocks, rowConfig }
// Response: { id, name }

// GET /api/admin/content-templates/:id
// Load specific template
// Response: { id, name, blocks, rowConfig, category }

// PUT /api/admin/content-templates/:id
// Update template
// Body: { name, description, blocks, rowConfig }

// DELETE /api/admin/content-templates/:id
// Delete template

// PATCH /api/admin/content-templates/:id/set-default
// Set as default template for category
```

**8.3 useContentTemplate Hook**

```typescript
// /src/hooks/useContentTemplate.ts

export function useContentTemplate() {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = useCallback(async (category: 'news' | 'work') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content-templates?category=${category}`);
      const data = await res.json();
      setTemplates(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTemplate = useCallback(async (
    name: string,
    category: 'news' | 'work',
    blocks: Block[],
    rowConfig?: RowConfig[],
    description?: string
  ) => {
    const res = await fetch('/api/admin/content-templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, blocks, rowConfig, description }),
    });
    return res.json();
  }, []);

  const loadTemplate = useCallback(async (id: string) => {
    const res = await fetch(`/api/admin/content-templates/${id}`);
    return res.json();
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    await fetch(`/api/admin/content-templates/${id}`, { method: 'DELETE' });
  }, []);

  const setDefaultTemplate = useCallback(async (id: string) => {
    await fetch(`/api/admin/content-templates/${id}/set-default`, {
      method: 'PATCH',
    });
  }, []);

  return {
    templates,
    loading,
    fetchTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    setDefaultTemplate,
  };
}
```

**8.4 UI Components**

**TemplateSelector Component:**
```typescript
// /src/components/admin/shared/TemplateSelector.tsx

interface TemplateSelectorProps {
  category: 'news' | 'work';
  onSelect: (template: ContentTemplate) => void;
}

export function TemplateSelector({ category, onSelect }: TemplateSelectorProps) {
  const { templates, loading, fetchTemplates } = useContentTemplate();

  useEffect(() => {
    fetchTemplates(category);
  }, [category]);

  return (
    <div className="flex items-center gap-2">
      <select
        onChange={(e) => {
          const template = templates.find(t => t.id === e.target.value);
          if (template) onSelect(template);
        }}
        className="px-2 py-1 border rounded text-sm"
      >
        <option value="">Select template...</option>
        {templates.map(t => (
          <option key={t.id} value={t.id}>
            {t.isDefault ? '⭐ ' : ''}{t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

**TemplateSaver Component:**
```typescript
// /src/components/admin/shared/TemplateSaver.tsx

export function TemplateSaver({
  blocks,
  rowConfig,
  category,
  onSave,
}: {
  blocks: Block[];
  rowConfig?: RowConfig[];
  category: 'news' | 'work';
  onSave?: () => void;
}) {
  const { saveTemplate } = useContentTemplate();
  const [showForm, setShowForm] = useState(false);

  const handleSave = async (name: string, description: string) => {
    await saveTemplate(name, category, blocks, rowConfig, description);
    setShowForm(false);
    onSave?.();
  };

  return (
    <div>
      {showForm ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          const name = e.currentTarget.templateName.value;
          const desc = e.currentTarget.templateDesc.value;
          handleSave(name, desc);
        }}>
          <input
            type="text"
            name="templateName"
            placeholder="Template name"
            required
            className="px-2 py-1 border rounded text-sm"
          />
          <textarea
            name="templateDesc"
            placeholder="Description (optional)"
            className="px-2 py-1 border rounded text-sm"
          />
          <button type="submit" className="btn btn-sm">Save</button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn btn-ghost btn-sm"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-sm btn-outline"
        >
          📌 Save as Template
        </button>
      )}
    </div>
  );
}
```

**8.5 Modal Integration**

```typescript
// In NewsBlogModal.tsx / WorkBlogModal.tsx

// Header: Template selector
<div className="flex items-center gap-2">
  <TemplateSelector
    category={category as 'news' | 'work'}
    onSelect={(template) => {
      resetBlocks(template.blocks);
      setRowConfig(template.rowConfig || []);
    }}
  />
</div>

// Footer: Save as template button
<footer className="flex justify-between">
  <TemplateSaver
    blocks={blocks}
    rowConfig={rowConfig}
    category={category as 'news' | 'work'}
    onSave={() => {
      // Refresh template list
    }}
  />
  <div className="flex gap-2">
    <button onClick={onClose}>Close</button>
    <button onClick={handleSubmit}>Save</button>
  </div>
</footer>
```

---

## 10. Integrated Timeline

### Complete Feature Set (49-53 hours total)

| Phase | Feature | Duration | Cumulative | Key Deliverable |
|-------|---------|----------|------------|-----------------|
| Phase 1 | Tiptap: Backend Prep | 4h | 4h | Expanded API, types |
| Phase 2 | Tiptap: Editor Component | 16h | 20h | WYSIWYG editor with image D&D |
| Phase 3 | Tiptap: Block Integration | 8h | 28h | TextBlockEditor replacement |
| Phase 4 | Tiptap: Migration | 4h | 32h | Legacy data migration script |
| Phase 5 | Tiptap: Testing | 6h | 38h | Functional & performance tests |
| Phase 6 | Tiptap: Deployment | 2h | 40h | Production ready |
| **Phase 7** | **Draft: Auto-save** | **3-5h** | **43-45h** | **localStorage + auto-save UI** |
| **Phase 8** | **Template: Save & Load** | **6-8h** | **49-53h** | **Template management system** |

### Implementation Priority

**Must-Have (Phase 1-6 + Phase 7):** 43-45 hours
- Tiptap WYSIWYG editor
- Image drag & drop
- WebP conversion
- Auto-save draft

**Nice-to-Have (Phase 8):** 6-8 hours
- Template save/load
- Default templates
- Template management UI

### Deployment Strategy

```
Week 1 (Mon-Tue): Phase 1-2 (Tiptap setup + component)
Week 1 (Wed-Thu): Phase 3-4 (Integration + migration)
Week 1 (Fri): Phase 5 (Testing)
Week 2 (Mon): Phase 6 (Deployment)

Week 2 (Tue-Wed): Phase 7 (Draft feature)
Week 2 (Thu-Fri): Phase 8 (Template feature)
```

### Phase 7-8 Checklist

**Phase 7: Draft Auto-Save**
```
[ ] Create useAutoSave hook
[ ] Integrate into NewsBlogModal
[ ] Integrate into WorkBlogModal
[ ] localStorage save every 30s
[ ] Display last saved time
[ ] Draft recovery on modal open
[ ] Clear draft after successful save
[ ] (Optional) Add Draft model to Prisma
[ ] (Optional) Create draft API endpoints
[ ] Test: draft recovery works
[ ] Test: timestamp updates correctly
```

**Phase 8: Template System**
```
[ ] Add ContentTemplate model to Prisma
[ ] Create API endpoints (GET/POST/PUT/DELETE/PATCH)
[ ] Create useContentTemplate hook
[ ] Create TemplateSelector component
[ ] Create TemplateSaver component
[ ] Integrate into NewsBlogModal
[ ] Integrate into WorkBlogModal
[ ] Test: save template works
[ ] Test: load template pre-fills blocks
[ ] Test: set default template works
[ ] UI: Template management page (admin dashboard)
```

---

## Summary

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| Phase 1: Tiptap Backend Prep | 4 hours | Expanded API, types, converter |
| Phase 2: Tiptap Component | 16 hours | Full WYSIWYG editor with image D&D |
| Phase 3: Tiptap Integration | 8 hours | TextBlockEditor replacement, dual rendering |
| Phase 4: Tiptap Migration | 4 hours | Optional bulk migration script |
| Phase 5: Tiptap Testing | 6 hours | Functional, performance, cross-browser |
| Phase 6: Tiptap Deployment | 2 hours | Staging + production |
| **Phase 7: Draft Auto-Save** | **3-5 hours** | **localStorage + recovery UI** |
| **Phase 8: Template System** | **6-8 hours** | **Template save/load/manage** |
| **Total** | **49-53 hours** | **Complete WYSIWYG editing with productivity features** |

**Key Decisions:**
1. Tiptap replaces TextBlock's textarea only (not the entire block system)
2. Dual rendering ensures backward compatibility
3. Lazy migration (convert on edit, not bulk)
4. Admin-only Tiptap bundle (dynamic import)
5. DOMPurify sanitization on all Tiptap HTML output

**Dependencies to Install:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/pm \
  @tiptap/extension-image @tiptap/extension-link \
  @tiptap/extension-underline @tiptap/extension-placeholder \
  @tiptap/extension-text-align @tiptap/extension-color \
  @tiptap/extension-text-style @tiptap/html
```

**Files to Create (8):**
```
src/components/admin/shared/TiptapEditor/
  index.ts
  TiptapEditor.tsx
  TiptapToolbar.tsx
  types.ts
  styles/tiptap-editor.css
  extensions/CustomImage.ts
  extensions/ImageResizer.tsx
  hooks/useImageUpload.ts
src/lib/tiptap/
  markdown-converter.ts
scripts/
  migrate-markdown-to-tiptap.ts
```

**Files to Modify (10+):**
```
src/app/api/admin/upload/route.ts (API response expansion)
src/components/admin/shared/BlockEditor/types.ts (TiptapContent type, contentFormat)
src/components/admin/shared/BlockEditor/blocks/TextBlockEditor.tsx (Tiptap integration)
src/components/admin/shared/BlockEditor/renderers/TextBlockRenderer.tsx (dual rendering)
src/components/admin/shared/BlockEditor/renderers/BlockRenderer.tsx (Tiptap support)
src/components/public/work/WorkDetailContent.tsx (dual rendering)
src/components/public/news/NewsEventDetailContent.tsx (dual rendering)
src/components/public/news/NewsBlockRenderer.tsx (dual rendering)
src/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer.tsx (dual rendering)
src/lib/content-parser.ts (contentFormat preservation)
```
