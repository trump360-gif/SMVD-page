'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ModalShell, TwoPanelLayout } from '@/components/admin/shared/BlogEditorModal';
import WorkBasicInfoForm from './WorkBasicInfoForm';
import { useBlockEditor } from '@/components/admin/shared/BlockEditor/useBlockEditor';
import { useRowManager } from '@/components/admin/shared/BlockEditor/useRowManager';
import type {
  BlogContent,
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
  const router = useRouter();

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

  // Auto-select first block when entering content tab
  useEffect(() => {
    if (activeTab === 'content' && blocks.length > 0 && !selectedId) {
      setSelectedId(blocks[0]?.id);
    }
  }, [activeTab, blocks, selectedId, setSelectedId]);

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
    { key: 'info', label: '기본정보' },
    { key: 'content', label: '콘텐츠 (블록)' },
  ];

  // Handle preview button click - navigate to actual work page
  const handlePreview = useCallback((blockId: string) => {
    if (project?.slug) {
      router.push(`/work/${project.slug}`);
    }
  }, [project?.slug, router]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Work상세페이지 작성 모달"
      subtitle={isEditing ? `편집중: ${project?.title}` : '새로운 포트폴리오 프로젝트를 만드세요'}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(key) => setActiveTab(key as 'info' | 'content')}
      error={error}
      onClearError={() => setError(null)}
      footerInfo={`${editorContent.blocks.length} 콘텐츠 블록`}
      submitLabel={isSubmitting ? '저장중...' : isEditing ? '변경사항 저장' : '프로젝트 생성'}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onKeyDown={handleUndoRedoKeyDown}
    >
          {/* Tab: Basic Info */}
          {activeTab === 'info' && (
            <WorkBasicInfoForm
              title={title}
              subtitle={subtitle}
              category={category}
              tags={tags}
              author={author}
              email={email}
              year={year}
              thumbnailImage={thumbnailImage}
              published={published}
              isEditing={isEditing}
              onTitleChange={setTitle}
              onSubtitleChange={setSubtitle}
              onCategoryChange={setCategory}
              onTagsChange={setTags}
              onAuthorChange={setAuthor}
              onEmailChange={setEmail}
              onYearChange={setYear}
              onThumbnailImageChange={(url) => setThumbnailImage(url || '')}
              onPublishedChange={setPublished}
            />
          )}

          {/* Tab: Content (2-Panel Layout) */}
          {activeTab === 'content' && (
            <TwoPanelLayout
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
              onPreview={handlePreview}
            />
          )}
    </ModalShell>
  );
}
