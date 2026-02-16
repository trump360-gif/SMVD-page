'use client';

import { useState, useEffect, useCallback } from 'react';
import WorkDetailPreviewRenderer from '@/components/admin/shared/BlockEditor/renderers/WorkDetailPreviewRenderer';
import { ModalShell, ThreePanelLayout } from '@/components/admin/shared/BlogEditorModal';
import { useBlockEditor } from '@/components/admin/shared/BlockEditor/useBlockEditor';
import { useRowManager } from '@/components/admin/shared/BlockEditor/useRowManager';
import type {
  BlogContent,
  WorkProjectContext,
  HeroImageBlock,
  HeroSectionBlock,
  RowConfig,
  BlockType,
} from '@/components/admin/shared/BlockEditor/types';
import {
  parseWorkProjectContent,
  serializeContent,
} from '@/lib/content-parser';
import {
  workBlogInputSchema,
  formatValidationError,
} from '@/lib/validation/blog-schemas';
import type {
  WorkProjectData,
  CreateProjectInput,
  UpdateProjectInput,
} from '@/hooks/useWorkEditor';

interface WorkBlogModalProps {
  isOpen: boolean;
  project?: WorkProjectData | null;
  onClose: () => void;
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => Promise<void>;
}

const CATEGORIES = ['UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'];

export default function WorkBlogModal({
  isOpen,
  project,
  onClose,
  onSubmit,
}: WorkBlogModalProps) {
  const isEditing = !!project;

  // ---- State ----
  const [activeTab, setActiveTab] = useState<'info' | 'content'>('info');

  // Basic info
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('2025');
  const [published, setPublished] = useState(true);

  // Images (hero image is now managed via HeroImageBlock in the BlockEditor)
  const [thumbnailImage, setThumbnailImage] = useState('');

  // Block editor content (replaces markdown + gallery)
  const [editorContent, setEditorContent] = useState<BlogContent>({
    blocks: [],
    version: '1.0',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Block Editor state (3-panel layout)
  const {
    blocks,
    selectedId,
    setSelectedId,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    resetBlocks,        // ← 추가: 동기화용
    getBlockCount,      // ← 추가: 디버깅용
    undo,               // ← 새로 추가: Undo
    redo,               // ← 새로 추가: Redo
    canUndo,            // ← 새로 추가: Undo 가능 여부
    canRedo,            // ← 새로 추가: Redo 가능 여부
  } = useBlockEditor(editorContent.blocks);

  // Row-based layout configuration (replaces single columnLayout)
  const [rowConfig, setRowConfig] = useState<RowConfig[]>([]);

  // ---- Row management callbacks (extracted to useRowManager hook) ----
  const {
    handleRowLayoutChange,
    handleAddRow,
    handleDeleteRow,
    handleAddBlockToRow,
    handleDeleteBlock,
    handleMoveBlockToRow,
    handleReorderRows,
  } = useRowManager(
    rowConfig,
    setRowConfig,
    blocks,
    addBlock,
    deleteBlock,
    reorderBlocks,
    'WorkBlogModal'
  );

  // ✅ 한 방향 동기화: blocks/rowConfig 변경 → editorContent 업데이트 (편집기 변경사항 저장용)
  // ⚠️ 역방향 동기화는 제거 (infinite loop 방지)
  useEffect(() => {
    setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
  }, [blocks, rowConfig]);

  // ---- Reset form ----
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setTitle(project.title);
        setSubtitle(project.subtitle);
        setCategory(project.category);
        setTags(project.tags.join(', '));
        setAuthor(project.author);
        setEmail(project.email);
        setYear(project.year);
        setThumbnailImage(project.thumbnailImage);
        setPublished(project.published);

        // Priority: Check if project.content already has blocks (new format)
        if (process.env.DEBUG) console.log('[WorkBlogModal] Loading project:', project.title);
        if (process.env.DEBUG) console.log('[WorkBlogModal] project.content type:', typeof project.content);
        if (process.env.DEBUG) console.log('[WorkBlogModal] project.content:', project.content);

        // ✅ Parse JSON if it's a string (Prisma Json field might return as string)
        let parsedProjectContent: BlogContent | null = null;
        if (project.content) {
          if (typeof project.content === 'string') {
            try {
              parsedProjectContent = JSON.parse(project.content) as BlogContent;
              if (process.env.DEBUG) console.log('[WorkBlogModal] Parsed JSON string content:', parsedProjectContent.blocks?.length, 'blocks');
            } catch (e) {
              if (process.env.DEBUG) console.log('[WorkBlogModal] Failed to parse JSON string:', e);
            }
          } else if (typeof project.content === 'object' && 'blocks' in project.content) {
            parsedProjectContent = project.content as BlogContent;
            if (process.env.DEBUG) console.log('[WorkBlogModal] Using object content:', parsedProjectContent.blocks?.length, 'blocks');
          }
        }

        if (parsedProjectContent && parsedProjectContent.blocks && parsedProjectContent.blocks.length > 0) {
          if (process.env.DEBUG) console.log('[WorkBlogModal] Using project.content with blocks:', parsedProjectContent.blocks.length);
          setEditorContent(parsedProjectContent);
          // ✅ Ensure rowConfig is valid - if missing, create default from blockCount
          const rowCfg = parsedProjectContent.rowConfig || [];
          if (rowCfg.length === 0 && parsedProjectContent.blocks.length > 0) {
            // Auto-generate: 1 row with all blocks
            setRowConfig([{ layout: 1, blockCount: parsedProjectContent.blocks.length }]);
          } else {
            setRowConfig(rowCfg);
          }
          // ✅ Immediately sync with useBlockEditor
          if (process.env.DEBUG) console.log('[WorkBlogModal] Resetting blocks:', parsedProjectContent.blocks.length);
          resetBlocks(parsedProjectContent.blocks);
        } else {
          // Fallback: Convert legacy description (markdown) + galleryImages + heroImage to BlogContent
          if (process.env.DEBUG) console.log('[WorkBlogModal] Falling back to parseWorkProjectContent');
          const parsedContent = parseWorkProjectContent(
            project.description,
            project.galleryImages as string[] | undefined,
            project.heroImage,
            project.title,
            project.author,
            project.email
          );
          if (process.env.DEBUG) console.log('[WorkBlogModal] Parsed content blocks:', parsedContent.blocks?.length);
          setEditorContent(parsedContent);
          // ✅ Auto-generate rowConfig for fallback content too
          if (parsedContent.blocks && parsedContent.blocks.length > 0) {
            if (process.env.DEBUG) console.log('[WorkBlogModal] Resetting fallback blocks:', parsedContent.blocks.length);
            setRowConfig([{ layout: 1, blockCount: parsedContent.blocks.length }]);
            resetBlocks(parsedContent.blocks);
          } else {
            setRowConfig([]);
          }
        }
      } else {
        setTitle('');
        setSubtitle('');
        setCategory('');
        setTags('');
        setAuthor('');
        setEmail('');
        setYear('2025');
        setThumbnailImage('');
        setPublished(true);
        setEditorContent({ blocks: [], version: '1.0' });
        setRowConfig([]);
      }
      setError(null);
      setActiveTab('info');
    }
  }, [isOpen, project]);

  // ---- Submit ----
  const handleSubmit = async () => {
    setError(null);

    // Validate all basic info fields via Zod schema
    const result = workBlogInputSchema.safeParse({
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      author: author.trim(),
      email: email.trim(),
      year,
      thumbnailImage: thumbnailImage.trim() || undefined,
    });

    if (!result.success) {
      setError(formatValidationError(result.error));
      setActiveTab('info');
      return;
    }

    if (!isEditing) {
      if (!thumbnailImage.trim()) { setError('Thumbnail image is required'); setActiveTab('info'); return; }
    }

    setIsSubmitting(true);

    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      // Extract heroImage from HeroImageBlock or HeroSectionBlock in block content
      const heroBlock = editorContent.blocks.find(
        (b) => b.type === 'hero-image' || b.type === 'hero-section'
      ) as (HeroImageBlock | HeroSectionBlock) | undefined;
      const extractedHeroImage = heroBlock?.url ?? '';

      const data: CreateProjectInput = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        tags: parsedTags,
        author: author.trim(),
        email: email.trim(),
        description: serializeContent(editorContent),
        year,
        heroImage: extractedHeroImage,
        thumbnailImage: thumbnailImage.trim(),
        galleryImages: [],
        published,
        content: editorContent, // Store BlockEditor content directly
      };

      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Undo/Redo keyboard handler
  const handleUndoRedoKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    },
    [canUndo, canRedo, undo, redo]
  );

  const tabs = [
    { key: 'info', label: 'Basic Info' },
    { key: 'content', label: 'Content (Blocks)' },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Portfolio' : 'New Portfolio'}
      subtitle={isEditing ? `Editing: ${project?.title}` : 'Create a new portfolio project'}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(key) => setActiveTab(key as 'info' | 'content')}
      error={error}
      onClearError={() => setError(null)}
      footerInfo={`${editorContent.blocks.length} content block${editorContent.blocks.length !== 1 ? 's' : ''}`}
      submitLabel={isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onKeyDown={handleUndoRedoKeyDown}
    >
          {/* Tab: Basic Info */}
          {activeTab === 'info' && (
            <div className="space-y-5 max-w-3xl p-6">
              {/* Title + Category */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="wb-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    id="wb-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Vora"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="wb-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="wb-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label htmlFor="wb-subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle *
                </label>
                <input
                  id="wb-subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Author Name, 2025"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Author + Email + Year */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="wb-author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    id="wb-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="wb-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="wb-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="wb-year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    id="wb-year"
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="wb-tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  id="wb-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="UX/UI, Branding, Motion"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {tags && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {tags.split(',').map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Image */}
              <div>
                <label htmlFor="wb-thumb" className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail {!isEditing && '*'}
                </label>
                <input
                  id="wb-thumb"
                  type="text"
                  value={thumbnailImage}
                  onChange={(e) => setThumbnailImage(e.target.value)}
                  placeholder="/images/work/portfolio-1.png"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {thumbnailImage && (
                  <div className="mt-2 w-28 h-28 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={thumbnailImage} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Hero image is managed in the Content (Blocks) tab using the Hero Image block.
                </p>
              </div>

              {/* Published */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="wb-published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="wb-published" className="text-sm font-medium text-gray-700">
                  Published (visible to public)
                </label>
              </div>
            </div>
          )}

          {/* Tab: Content (3-Panel Layout) */}
          {activeTab === 'content' && (
            <ThreePanelLayout
              blocks={blocks}
              rowConfig={rowConfig}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              updateBlock={updateBlock}
              reorderBlocks={reorderBlocks}
              handleRowLayoutChange={handleRowLayoutChange}
              handleAddRow={handleAddRow}
              handleDeleteRow={handleDeleteRow}
              handleReorderRows={handleReorderRows}
              handleAddBlockToRow={handleAddBlockToRow}
              handleDeleteBlock={handleDeleteBlock}
              handleMoveBlockToRow={handleMoveBlockToRow}
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              previewSubtitle="실시간 미리보기"
              previewPanel={
                <WorkDetailPreviewRenderer
                  blocks={blocks}
                  rowConfig={rowConfig}
                  projectContext={{
                    title: title,
                    author: author,
                    email: email,
                    heroImage: '',
                    category: category,
                  } satisfies WorkProjectContext}
                />
              }
            />
          )}
    </ModalShell>
  );
}
