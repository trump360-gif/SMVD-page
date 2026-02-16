'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import NewsDetailPreviewRenderer from '@/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer';
import type { NewsArticleContext } from '@/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer';
import { ModalShell, ThreePanelLayout } from '@/components/admin/shared/BlogEditorModal';
import { useBlockEditor } from '@/components/admin/shared/BlockEditor/useBlockEditor';
import { useRowManager } from '@/components/admin/shared/BlockEditor/useRowManager';
import type {
  BlogContent,
  BlockType,
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
} from '@/hooks/useNewsEditor';

interface NewsBlogModalProps {
  isOpen: boolean;
  article?: NewsArticleData | null;
  onClose: () => void;
  onSubmit: (data: CreateArticleInput | UpdateArticleInput) => Promise<void>;
}

const CATEGORIES = ['Notice', 'Event', 'Awards', 'Recruiting'];

export default function NewsBlogModal({
  isOpen,
  article,
  onClose,
  onSubmit,
}: NewsBlogModalProps) {
  const isEditing = !!article;

  // ---- State ----
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'attachments'>('info'); // Updated - 2026-02-16

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

  // Attachments (NEW - 2026-02-16)
  const [attachments, setAttachments] = useState<import('@/hooks/useNewsEditor').AttachmentData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    getBlockCount,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBlockEditor(editorContent.blocks);

  // Row-based layout configuration
  const [rowConfig, setRowConfig] = useState<RowConfig[]>([]);

  // Track if article data has been loaded to avoid overwriting loaded rowConfig
  const [isLoaded, setIsLoaded] = useState(false);

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
    'NewsBlogModal'
  );

  // One-way sync: blocks/rowConfig changes -> editorContent update
  // BUT: Don't sync if we just loaded data (preserve loaded rowConfig)
  useEffect(() => {
    if (!isLoaded) return; // Skip sync during initial load
    setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
  }, [blocks, rowConfig, isLoaded]);

  // ---- Reset form ----
  useEffect(() => {
    if (isOpen) {
      if (article) {
        if (process.env.DEBUG) console.log('[NewsBlogModal] ========== LOADING ARTICLE ==========');
        if (process.env.DEBUG) console.log('[NewsBlogModal] Article ID:', article.id);
        if (process.env.DEBUG) console.log('[NewsBlogModal] Article slug:', article.slug);
        if (process.env.DEBUG) console.log('[NewsBlogModal] Article title:', article.title);

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

        // Load attachments (NEW - 2026-02-16)
        if (article.attachments && Array.isArray(article.attachments)) {
          setAttachments(article.attachments);
        } else {
          setAttachments([]);
        }

        // Parse content: check for new block format or legacy format
        const content = article.content as NewsContentShape | BlogContent | null;

        if (process.env.DEBUG) console.log('[NewsBlogModal] Loading article:', article.title);
        if (process.env.DEBUG) console.log('[NewsBlogModal] content type:', typeof content);
        if (process.env.DEBUG) console.log('[NewsBlogModal] content is null?:', content === null);
        if (process.env.DEBUG) console.log('[NewsBlogModal] content is undefined?:', content === undefined);
        if (process.env.DEBUG) console.log('[NewsBlogModal] content:', JSON.stringify(content));

        let parsedContent: BlogContent | null = null;
        let contentToConvert: NewsContentShape | BlogContent | null = content;

        if (content) {
          // First, handle case where content might be a JSON string
          if (typeof content === 'string') {
            if (process.env.DEBUG) console.log('[NewsBlogModal] Content is a string, attempting to parse JSON');
            try {
              contentToConvert = JSON.parse(content) as NewsContentShape | BlogContent;
              if (process.env.DEBUG) console.log('[NewsBlogModal] ✅ Parsed JSON string:', contentToConvert);
            } catch (e) {
              if (process.env.DEBUG) console.log('[NewsBlogModal] ❌ Failed to parse JSON string:', e);
              contentToConvert = null;
            }
          }

          // Now check if it's in block format (has 'blocks' array)
          if (
            typeof contentToConvert === 'object' &&
            contentToConvert !== null &&
            'blocks' in contentToConvert &&
            Array.isArray(contentToConvert.blocks) &&
            contentToConvert.blocks.length > 0
          ) {
            parsedContent = contentToConvert as BlogContent;
            if (process.env.DEBUG) console.log('[NewsBlogModal] ✅ Found blocks in content:', parsedContent.blocks.length, 'blocks');
          }
        }

        if (parsedContent && parsedContent.blocks && parsedContent.blocks.length > 0) {
          if (process.env.DEBUG) console.log('[NewsBlogModal] ✅ Using block format with', parsedContent.blocks.length, 'blocks');
          setEditorContent(parsedContent);
          // ✅ Ensure rowConfig is valid - if missing, create default from blockCount
          const rowCfg = parsedContent.rowConfig || [];
          if (rowCfg.length === 0 && parsedContent.blocks.length > 0) {
            // Auto-generate: 1 row with all blocks
            setRowConfig([{ layout: 1, blockCount: parsedContent.blocks.length }]);
          } else {
            setRowConfig(rowCfg);
          }
          if (process.env.DEBUG) console.log('[NewsBlogModal] 🔄 Resetting blocks:', parsedContent.blocks.length);
          resetBlocks(parsedContent.blocks);
        } else {
          // Fallback: Convert legacy content to BlockEditor format
          if (process.env.DEBUG) console.log('[NewsBlogModal] ⚠️  Falling back to legacy format');
          if (process.env.DEBUG) console.log('[NewsBlogModal] Content being converted:', JSON.stringify(contentToConvert, null, 2));
          const legacyContent = parseNewsContent(contentToConvert as NewsContentShape | null);
          if (process.env.DEBUG) console.log('[NewsBlogModal] Legacy content converted to:', JSON.stringify(legacyContent, null, 2));
          setEditorContent(legacyContent);
          // ✅ Auto-generate rowConfig for legacy content too
          if (legacyContent.blocks && legacyContent.blocks.length > 0) {
            if (process.env.DEBUG) console.log('[NewsBlogModal] 🔄 Resetting legacy blocks:', legacyContent.blocks.length);
            setRowConfig([{ layout: 1, blockCount: legacyContent.blocks.length }]);
            resetBlocks(legacyContent.blocks);
          } else {
            if (process.env.DEBUG) console.log('[NewsBlogModal] ❌ No blocks found!');
            if (process.env.DEBUG) console.log('[NewsBlogModal] legacyContent:', legacyContent);
            if (process.env.DEBUG) console.log('[NewsBlogModal] legacyContent.blocks:', legacyContent.blocks);
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
        setAttachments([]); // NEW - 2026-02-16
      }
      setError(null);
      setActiveTab('info');
      // 🚨 CRITICAL: Mark as loaded so sync effect won't overwrite loaded data
      setIsLoaded(true);
    } else {
      // Modal closed, reset isLoaded for next open
      setIsLoaded(false);
    }
  }, [isOpen, article]);

  // ---- File Upload Handlers ----
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: import('@/hooks/useNewsEditor').AttachmentData[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newAttachments.push({
        id: `temp-${Date.now()}-${i}`,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        fileBlob: file, // Store the actual file for later upload
      } as any);
    }
    setAttachments([...attachments, ...newAttachments]);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [attachments]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (!files) return;

    const newAttachments: import('@/hooks/useNewsEditor').AttachmentData[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newAttachments.push({
        id: `temp-${Date.now()}-${i}`,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        fileBlob: file,
      } as any);
    }
    setAttachments([...attachments, ...newAttachments]);
  }, [attachments]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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
      // 🔍 CRITICAL DEBUG: Log entry to try block
      if (process.env.DEBUG) console.log('[NewsBlogModal] ========== ENTERING TRY BLOCK ==========');
      if (process.env.DEBUG) console.log('[NewsBlogModal] blocks:', blocks);
      if (process.env.DEBUG) console.log('[NewsBlogModal] blocks.length:', blocks?.length);
      if (process.env.DEBUG) console.log('[NewsBlogModal] blocks type:', typeof blocks);
      if (process.env.DEBUG) console.log('[NewsBlogModal] Array.isArray(blocks):', Array.isArray(blocks));

      // 🔍 Debug: Log blocks status before submit
      if (process.env.DEBUG) console.log('[NewsBlogModal] ========== BEFORE SUBMIT ==========');
      if (process.env.DEBUG) console.log('[NewsBlogModal] blocks.length:', blocks.length);
      if (process.env.DEBUG) console.log('[NewsBlogModal] blocks:', JSON.stringify(blocks, null, 2));
      if (process.env.DEBUG) console.log('[NewsBlogModal] editorContent.blocks.length:', editorContent.blocks.length);
      if (process.env.DEBUG) console.log('[NewsBlogModal] editorContent.blocks:', JSON.stringify(editorContent.blocks, null, 2));
      if (process.env.DEBUG) console.log('[NewsBlogModal] editorContent:', JSON.stringify(editorContent, null, 2));
      if (process.env.DEBUG) console.log('[NewsBlogModal] rowConfig:', JSON.stringify(rowConfig, null, 2));
      if (process.env.DEBUG) console.log('[NewsBlogModal] blocks === editorContent.blocks?:', blocks === editorContent.blocks);

      // 🔧 CRITICAL FIX: Use blocks from useBlockEditor hook (always fresh)
      const hasBlocks = blocks && blocks.length > 0;

      // 🔍 CRITICAL: Create content with explicit deep copy + row config safety check
      let content: NewsContentData | null = null;

      if (hasBlocks) {
        // Explicitly deep copy blocks array to avoid reference issues
        const blocksCopy = JSON.parse(JSON.stringify(blocks));

        // Validate blocksCopy is not empty and has actual data
        if (!Array.isArray(blocksCopy) || blocksCopy.length === 0) {
          console.error('[NewsBlogModal] ❌ CRITICAL: blocksCopy is empty after deep copy!');
          throw new Error('블록 데이터가 손실되었습니다. 다시 시도해주세요.');
        }

        // 🚨 CRITICAL FIX: rowConfig might be stale due to async setState
        // Solution: Always generate rowConfig from actual blocks, never rely on state alone
        const rowConfigCopy = Array.isArray(rowConfig) && rowConfig.length > 0
          ? [...rowConfig]
          : [{ layout: 1 as const, blockCount: blocksCopy.length }];

        content = {
          blocks: blocksCopy,
          rowConfig: rowConfigCopy,
          version: '1.0',
        };

        // 🔍 CRITICAL VALIDATION: Verify content object is valid before sending
        if (!content || typeof content !== 'object' || !content.blocks || !Array.isArray(content.blocks)) {
          console.error('[NewsBlogModal] ❌ CRITICAL: content object is invalid!', content);
          throw new Error('콘텐츠 객체가 유효하지 않습니다.');
        }

        if (content.blocks.length === 0) {
          console.error('[NewsBlogModal] ❌ CRITICAL: content.blocks is empty!');
          throw new Error('최소 1개의 블록이 필요합니다.');
        }

        if (process.env.DEBUG) console.log('[NewsBlogModal] ========== SUBMIT: CONTENT CREATED ==========');
        if (process.env.DEBUG) console.log('[NewsBlogModal] hasBlocks:', true);
        if (process.env.DEBUG) console.log('[NewsBlogModal] blocks.length:', blocks.length);
        if (process.env.DEBUG) console.log('[NewsBlogModal] blocksCopy.length:', blocksCopy.length);
        if (process.env.DEBUG) console.log('[NewsBlogModal] First block ID:', blocksCopy[0]?.id);
        if (process.env.DEBUG) console.log('[NewsBlogModal] rowConfig.length:', rowConfig.length);
        if (process.env.DEBUG) console.log('[NewsBlogModal] rowConfigCopy:', JSON.stringify(rowConfigCopy));
        if (process.env.DEBUG) console.log('[NewsBlogModal] Final content:', JSON.stringify(content));
      } else {
        if (process.env.DEBUG) console.log('[NewsBlogModal] ========== SUBMIT: NO BLOCKS ==========');
        if (process.env.DEBUG) console.log('[NewsBlogModal] blocks:', blocks);
        if (process.env.DEBUG) console.log('[NewsBlogModal] blocks.length:', blocks?.length ?? 'N/A');
        content = null;
      }

      // Filter out fileBlob (not JSON serializable) - keep all attachments
      const validAttachments = attachments
        .map(({ fileBlob, ...rest }: any) => rest) // Remove fileBlob property from all
        .filter((a: any) => a.filename); // Only keep those with filename

      const data: CreateArticleInput = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim() || undefined,
        thumbnailImage,
        content,
        attachments: validAttachments.length > 0 ? validAttachments : undefined, // NEW - 2026-02-16
        publishedAt: publishedAt || new Date().toISOString().split('T')[0],
        published,
      };

      // 🔍 CRITICAL VALIDATION: Verify the final data object
      if (data.content && typeof data.content === 'object') {
        const contentKeys = Object.keys(data.content);
        if (contentKeys.length === 0) {
          console.error('[NewsBlogModal] ❌ CRITICAL: data.content is an empty object!');
          throw new Error('콘텐츠가 비어있습니다.');
        }
      }

      if (process.env.DEBUG) console.log('[NewsBlogModal] ========== SENDING DATA ==========');
      if (process.env.DEBUG) console.log('[NewsBlogModal] data.content type:', typeof data.content);
      if (process.env.DEBUG) console.log('[NewsBlogModal] data.content keys:', data.content ? Object.keys(data.content) : 'null');
      if (process.env.DEBUG) console.log('[NewsBlogModal] data.content:', JSON.stringify(data.content, null, 2));

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
            <div className="space-y-5 max-w-3xl p-6">
              {/* Title + Category */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="nb-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    id="nb-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article title"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="nb-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="nb-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="nb-excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt (shown in list)
                </label>
                <textarea
                  id="nb-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short description for the list view (2 lines max)..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y"
                />
              </div>

              {/* Thumbnail + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nb-thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail
                  </label>
                  <input
                    id="nb-thumbnail"
                    type="text"
                    value={thumbnailImage}
                    onChange={(e) => setThumbnailImage(e.target.value)}
                    placeholder="/Group-27.svg"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                  {thumbnailImage && (
                    <div className="mt-2 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={thumbnailImage} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="nb-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Published Date
                  </label>
                  <input
                    id="nb-date"
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Published */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="nb-published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="nb-published" className="text-sm font-medium text-gray-700">
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

          {/* Tab: Attachments (NEW - 2026-02-16) */}
          {activeTab === 'attachments' && (
            <div className="space-y-5 max-w-3xl p-6">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
              />

              {/* File Upload Section */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Drag files here or click to upload
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP
                  </p>
                </div>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    {attachments.length} file{attachments.length !== 1 ? 's' : ''}
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(attachment.size / 1024).toFixed(1)} KB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter(a => a.id !== attachment.id))}
                          className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    No attachments yet. Upload files above.
                  </p>
                </div>
              )}
            </div>
          )}
    </ModalShell>
  );
}
