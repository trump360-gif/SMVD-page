'use client';

import { useState, useEffect, useCallback } from 'react';
import NewsDetailPreviewRenderer from '@/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer';
import type { NewsArticleContext } from '@/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer';
import { ModalShell, ThreePanelLayout } from '@/components/admin/shared/BlogEditorModal';
import { useBlockEditor } from '@/components/admin/shared/BlockEditor/useBlockEditor';
import { useRowManager } from '@/components/admin/shared/BlockEditor/useRowManager';
import type {
  BlogContent,
  RowConfig,
} from '@/components/admin/shared/BlockEditor/types';
import { parseNewsContent, type NewsContentShape } from '@/lib/content-parser';
import {
  newsArticleInputSchema,
  formatValidationError,
} from '@/lib/validation/blog-schemas';
import type {
  NewsArticleData,
  CreateArticleInput,
  UpdateArticleInput,
  NewsContentData,
  AttachmentData,
} from '@/hooks/useNewsEditor';
import ArticleInfoForm from './ArticleInfoForm';
import AttachmentsTab from './AttachmentsTab';

interface NewsBlogModalProps {
  isOpen: boolean;
  article?: NewsArticleData | null;
  onClose: () => void;
  onSubmit: (data: CreateArticleInput | UpdateArticleInput) => Promise<void>;
}

export default function NewsBlogModal({
  isOpen,
  article,
  onClose,
  onSubmit,
}: NewsBlogModalProps) {
  const isEditing = !!article;

  // ---- State ----
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'attachments'>('info');

  // Basic info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notice');
  const [excerpt, setExcerpt] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('/Group-27.svg');
  const [publishedAt, setPublishedAt] = useState('');
  const [published, setPublished] = useState(true);

  // Block editor content
  const [editorContent, setEditorContent] = useState<BlogContent>({
    blocks: [],
    version: '1.0',
  });

  // Attachments
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);

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
    resetBlocks,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBlockEditor(editorContent.blocks);

  // Row-based layout configuration
  const [rowConfig, setRowConfig] = useState<RowConfig[]>([]);

  // Track if article data has been loaded to avoid overwriting loaded rowConfig
  const [isLoaded, setIsLoaded] = useState(false);

  // ---- Row management callbacks ----
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
    'NewsBlogModal'
  );

  // One-way sync: blocks/rowConfig changes -> editorContent update
  useEffect(() => {
    if (!isLoaded) return;
    setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
  }, [blocks, rowConfig, isLoaded]);

  // ---- Reset form ----
  useEffect(() => {
    if (isOpen) {
      if (article) {
        if (process.env.DEBUG) console.log('[NewsBlogModal] Loading article:', article.title);

        setTitle(article.title);
        setCategory(article.category);
        setExcerpt(article.excerpt || '');
        setThumbnailImage(article.thumbnailImage);
        setPublishedAt(
          article.publishedAt
            ? new Date(article.publishedAt).toISOString().split('T')[0]
            : ''
        );
        setPublished(article.published);

        if (article.attachments && Array.isArray(article.attachments)) {
          setAttachments(article.attachments);
        } else {
          setAttachments([]);
        }

        const content = article.content as NewsContentShape | BlogContent | null;

        let parsedContent: BlogContent | null = null;
        let contentToConvert: NewsContentShape | BlogContent | null = content;

        if (content) {
          if (typeof content === 'string') {
            try {
              contentToConvert = JSON.parse(content) as NewsContentShape | BlogContent;
            } catch {
              contentToConvert = null;
            }
          }

          if (
            typeof contentToConvert === 'object' &&
            contentToConvert !== null &&
            'blocks' in contentToConvert &&
            Array.isArray(contentToConvert.blocks) &&
            contentToConvert.blocks.length > 0
          ) {
            parsedContent = contentToConvert as BlogContent;
          }
        }

        if (parsedContent && parsedContent.blocks && parsedContent.blocks.length > 0) {
          setEditorContent(parsedContent);
          const rowCfg = parsedContent.rowConfig || [];
          if (rowCfg.length === 0 && parsedContent.blocks.length > 0) {
            setRowConfig([{ layout: 1, blockCount: parsedContent.blocks.length }]);
          } else {
            setRowConfig(rowCfg);
          }
          resetBlocks(parsedContent.blocks);
        } else {
          const legacyContent = parseNewsContent(contentToConvert as NewsContentShape | null);
          setEditorContent(legacyContent);
          if (legacyContent.blocks && legacyContent.blocks.length > 0) {
            setRowConfig([{ layout: 1, blockCount: legacyContent.blocks.length }]);
            resetBlocks(legacyContent.blocks);
          } else {
            setRowConfig([]);
          }
        }
      } else {
        setTitle('');
        setCategory('Notice');
        setExcerpt('');
        setThumbnailImage('/Group-27.svg');
        setPublishedAt(new Date().toISOString().split('T')[0]);
        setPublished(true);
        setEditorContent({ blocks: [], version: '1.0' });
        setRowConfig([]);
        setAttachments([]);
      }
      setError(null);
      setActiveTab('info');
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [isOpen, article]);

  // ---- Submit ----
  const handleSubmit = async () => {
    setError(null);

    const result = newsArticleInputSchema.safeParse({
      title: title.trim(),
      category,
      excerpt: excerpt.trim() || undefined,
      publishedAt: publishedAt || undefined,
      thumbnailImage: thumbnailImage || undefined,
    });

    if (!result.success) {
      setError(formatValidationError(result.error));
      setActiveTab('info');
      return;
    }

    setIsSubmitting(true);

    try {
      const hasBlocks = blocks && blocks.length > 0;
      let content: NewsContentData | null = null;

      if (hasBlocks) {
        const blocksCopy = JSON.parse(JSON.stringify(blocks));

        if (!Array.isArray(blocksCopy) || blocksCopy.length === 0) {
          throw new Error('블록 데이터가 손실되었습니다. 다시 시도해주세요.');
        }

        const rowConfigCopy = Array.isArray(rowConfig) && rowConfig.length > 0
          ? [...rowConfig]
          : [{ layout: 1 as const, blockCount: blocksCopy.length }];

        content = {
          blocks: blocksCopy,
          rowConfig: rowConfigCopy,
          version: '1.0',
        };

        if (!content || typeof content !== 'object' || !content.blocks || !Array.isArray(content.blocks)) {
          throw new Error('콘텐츠 객체가 유효하지 않습니다.');
        }

        if (content.blocks.length === 0) {
          throw new Error('최소 1개의 블록이 필요합니다.');
        }
      } else {
        content = null;
      }

      // Upload new file attachments
      const uploadedAttachments: AttachmentData[] = [];

      for (const attachment of attachments) {
        const attachmentWithBlob = attachment as AttachmentData & { fileBlob?: File };
        if (attachmentWithBlob.fileBlob && attachmentWithBlob.fileBlob instanceof File) {
          try {
            const formData = new FormData();
            formData.append('file', attachmentWithBlob.fileBlob);

            const uploadRes = await fetch('/api/admin/upload/document', {
              method: 'POST',
              body: formData,
              credentials: 'include',
            });

            if (!uploadRes.ok) {
              const errorData = await uploadRes.json();
              throw new Error(`파일 업로드 실패: ${errorData.message}`);
            }

            const uploadedData = await uploadRes.json();
            uploadedAttachments.push({
              id: uploadedData.data.id,
              filename: uploadedData.data.filename,
              filepath: uploadedData.data.filepath,
              mimeType: uploadedData.data.mimeType,
              size: uploadedData.data.size,
              uploadedAt: uploadedData.data.uploadedAt,
            });
          } catch (err) {
            throw new Error(err instanceof Error ? err.message : '파일 업로드 중 오류 발생');
          }
        } else if (attachment.filepath) {
          uploadedAttachments.push({
            id: attachment.id,
            filename: attachment.filename,
            filepath: attachment.filepath,
            mimeType: attachment.mimeType,
            size: attachment.size,
            uploadedAt: attachment.uploadedAt,
          });
        }
      }

      const data: CreateArticleInput = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim() || undefined,
        thumbnailImage,
        content,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : null,
        publishedAt: publishedAt || new Date().toISOString().split('T')[0],
        published,
      };

      if (data.content && typeof data.content === 'object') {
        const contentKeys = Object.keys(data.content);
        if (contentKeys.length === 0) {
          throw new Error('콘텐츠가 비어있습니다.');
        }
      }

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
    { key: 'attachments', label: 'Attachments' },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Article' : 'New Article'}
      subtitle={isEditing ? `Editing: ${article?.title}` : 'Create a new news article or event'}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(key) => setActiveTab(key as 'info' | 'content' | 'attachments')}
      error={error}
      onClearError={() => setError(null)}
      footerInfo={`${editorContent.blocks.length} content block${editorContent.blocks.length !== 1 ? 's' : ''}`}
      submitLabel={isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Article'}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onKeyDown={handleUndoRedoKeyDown}
    >
      {/* Tab: Basic Info */}
      {activeTab === 'info' && (
        <ArticleInfoForm
          title={title}
          category={category}
          excerpt={excerpt}
          thumbnailImage={thumbnailImage}
          publishedAt={publishedAt}
          published={published}
          onTitleChange={setTitle}
          onCategoryChange={setCategory}
          onExcerptChange={setExcerpt}
          onThumbnailImageChange={setThumbnailImage}
          onPublishedAtChange={setPublishedAt}
          onPublishedChange={setPublished}
        />
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
          previewSubtitle="News article preview"
          previewPanel={
            <NewsDetailPreviewRenderer
              blocks={blocks}
              rowConfig={rowConfig}
              articleContext={{
                title: title,
                category: category,
                publishedAt: publishedAt,
              } satisfies NewsArticleContext}
            />
          }
        />
      )}

      {/* Tab: Attachments */}
      {activeTab === 'attachments' && (
        <AttachmentsTab
          attachments={attachments}
          onAttachmentsChange={setAttachments}
        />
      )}
    </ModalShell>
  );
}
