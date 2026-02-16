'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, RotateCcw, RotateCw } from 'lucide-react';
import NewsDetailPreviewRenderer from '@/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer';
import type { NewsArticleContext } from '@/components/admin/shared/BlockEditor/renderers/NewsDetailPreviewRenderer';
import BlockLayoutVisualizer from '@/components/admin/work/BlockLayoutVisualizer';
import BlockEditorPanel from '@/components/admin/work/BlockEditorPanel';
import { useBlockEditor } from '@/components/admin/shared/BlockEditor/useBlockEditor';
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
  const modalRef = useRef<HTMLDivElement>(null);

  // ---- State ----
  const [activeTab, setActiveTab] = useState<'info' | 'content'>('info');

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
  const [rowConfig, setRowConfig] = useState<RowConfig[]>(
    editorContent.rowConfig || []
  );

  // One-way sync: blocks/rowConfig changes -> editorContent update
  useEffect(() => {
    setEditorContent((prev) => ({ ...prev, blocks, rowConfig }));
  }, [blocks, rowConfig]);

  // --- Row management callbacks ---

  const handleRowLayoutChange = useCallback(
    (rowIndex: number, newLayout: 1 | 2 | 3) => {
      setRowConfig((prev) => {
        const updated = [...prev];
        if (rowIndex < updated.length) {
          updated[rowIndex] = { ...updated[rowIndex], layout: newLayout };
        }
        return updated;
      });
    },
    []
  );

  const handleAddRow = useCallback((layout: 1 | 2 | 3 = 1) => {
    setRowConfig((prev) => [...prev, { layout, blockCount: 0 }]);
  }, []);

  const handleDeleteRow = useCallback((rowIndex: number) => {
    setRowConfig((prev) => {
      if (prev.length <= 1) return prev;
      const updated = [...prev];
      const removedBlockCount = updated[rowIndex].blockCount;
      updated.splice(rowIndex, 1);
      if (removedBlockCount > 0) {
        const mergeTarget = rowIndex > 0 ? rowIndex - 1 : 0;
        if (updated[mergeTarget]) {
          updated[mergeTarget] = {
            ...updated[mergeTarget],
            blockCount: updated[mergeTarget].blockCount + removedBlockCount,
          };
        }
      }
      return updated;
    });
  }, []);

  const handleAddBlockToRow = useCallback(
    (type: BlockType, rowIndex: number) => {
      setRowConfig((prev) => {
        const updated = [...prev];
        if (rowIndex < updated.length) {
          updated[rowIndex] = {
            ...updated[rowIndex],
            blockCount: updated[rowIndex].blockCount + 1,
          };
        } else {
          updated.push({ layout: 1, blockCount: 1 });
        }
        return updated;
      });

      let blockOffset = 0;
      for (let i = 0; i < rowIndex; i++) {
        blockOffset += rowConfig[i]?.blockCount ?? 0;
      }
      blockOffset += rowConfig[rowIndex]?.blockCount ?? 0;
      if (blockOffset > 0 && blockOffset <= blocks.length) {
        const afterBlock = blocks[blockOffset - 1];
        addBlock(type, afterBlock.id);
      } else {
        addBlock(type);
      }
    },
    [addBlock, blocks, rowConfig]
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      const blockIndex = blocks.findIndex((b) => b.id === id);
      if (blockIndex === -1) {
        deleteBlock(id);
        return;
      }

      let accum = 0;
      let targetRow = -1;
      for (let i = 0; i < rowConfig.length; i++) {
        accum += rowConfig[i].blockCount;
        if (blockIndex < accum) {
          targetRow = i;
          break;
        }
      }

      deleteBlock(id);

      if (targetRow >= 0) {
        setRowConfig((prev) => {
          const updated = [...prev];
          if (targetRow < updated.length && updated[targetRow].blockCount > 0) {
            updated[targetRow] = {
              ...updated[targetRow],
              blockCount: updated[targetRow].blockCount - 1,
            };
            if (updated[targetRow].blockCount === 0 && updated.length > 1) {
              updated.splice(targetRow, 1);
            }
          }
          return updated;
        });
      }
    },
    [blocks, deleteBlock, rowConfig]
  );

  const handleMoveBlockToRow = useCallback(
    (blockId: string, targetRowIndex: number, positionInRow: number) => {
      const blockIndex = blocks.findIndex((b) => b.id === blockId);
      if (blockIndex === -1) return;

      let accum = 0;
      let sourceRow = -1;
      for (let i = 0; i < rowConfig.length; i++) {
        accum += rowConfig[i].blockCount;
        if (blockIndex < accum) {
          sourceRow = i;
          break;
        }
      }

      let destIndex = 0;
      for (let i = 0; i < targetRowIndex; i++) {
        destIndex += rowConfig[i]?.blockCount ?? 0;
      }
      destIndex += positionInRow;

      reorderBlocks(blockId, destIndex);

      if (sourceRow >= 0 && sourceRow !== targetRowIndex) {
        setRowConfig((prev) => {
          const updated = [...prev];
          if (sourceRow < updated.length && updated[sourceRow].blockCount > 0) {
            updated[sourceRow] = {
              ...updated[sourceRow],
              blockCount: updated[sourceRow].blockCount - 1,
            };
          }
          if (targetRowIndex < updated.length) {
            updated[targetRowIndex] = {
              ...updated[targetRowIndex],
              blockCount: updated[targetRowIndex].blockCount + 1,
            };
          }
          if (
            sourceRow < updated.length &&
            updated[sourceRow].blockCount === 0 &&
            updated.length > 1
          ) {
            updated.splice(sourceRow, 1);
          }
          return updated;
        });
      }
    },
    [blocks, reorderBlocks, rowConfig]
  );

  const handleReorderRows = useCallback(
    (sourceRowIndex: number, destinationRowIndex: number) => {
      console.log('[NewsBlogModal] handleReorderRows called:', {
        sourceRowIndex,
        destinationRowIndex,
        rowConfigLength: rowConfig.length,
      });

      setRowConfig((prev) => {
        console.log('[NewsBlogModal] setRowConfig callback:', {
          prev_length: prev.length,
          sourceRowIndex,
          destinationRowIndex,
          prev_data: JSON.stringify(prev),
        });

        // Validate indices
        if (
          sourceRowIndex < 0 || sourceRowIndex >= prev.length ||
          destinationRowIndex < 0 || destinationRowIndex >= prev.length ||
          sourceRowIndex === destinationRowIndex
        ) {
          console.log('[NewsBlogModal] ❌ Validation failed:', {
            check_sourceRowIndex_negative: sourceRowIndex < 0,
            check_sourceRowIndex_outOfBounds: sourceRowIndex >= prev.length,
            check_destinationRowIndex_negative: destinationRowIndex < 0,
            check_destinationRowIndex_outOfBounds: destinationRowIndex >= prev.length,
            check_sameIndex: sourceRowIndex === destinationRowIndex,
          });
          return prev;
        }

        const updated = [...prev];
        const [movedRow] = updated.splice(sourceRowIndex, 1);
        updated.splice(destinationRowIndex, 0, movedRow);
        console.log('[NewsBlogModal] ✅ Reordered rowConfig:', {
          oldIndex: sourceRowIndex,
          newIndex: destinationRowIndex,
          newLength: updated.length,
        });
        return updated;
      });
    },
    [rowConfig.length]
  );

  // ---- Reset form ----
  useEffect(() => {
    if (isOpen) {
      if (article) {
        console.log('[NewsBlogModal] ========== LOADING ARTICLE ==========');
        console.log('[NewsBlogModal] Article ID:', article.id);
        console.log('[NewsBlogModal] Article slug:', article.slug);
        console.log('[NewsBlogModal] Article title:', article.title);

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

        // Parse content: check for new block format or legacy format
        const content = article.content as NewsContentShape | BlogContent | null;

        console.log('[NewsBlogModal] Loading article:', article.title);
        console.log('[NewsBlogModal] content type:', typeof content);
        console.log('[NewsBlogModal] content is null?:', content === null);
        console.log('[NewsBlogModal] content is undefined?:', content === undefined);
        console.log('[NewsBlogModal] content:', JSON.stringify(content));

        let parsedContent: BlogContent | null = null;
        let contentToConvert: NewsContentShape | BlogContent | null = content;

        if (content) {
          // First, handle case where content might be a JSON string
          if (typeof content === 'string') {
            console.log('[NewsBlogModal] Content is a string, attempting to parse JSON');
            try {
              contentToConvert = JSON.parse(content) as NewsContentShape | BlogContent;
              console.log('[NewsBlogModal] ✅ Parsed JSON string:', contentToConvert);
            } catch (e) {
              console.log('[NewsBlogModal] ❌ Failed to parse JSON string:', e);
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
            console.log('[NewsBlogModal] ✅ Found blocks in content:', parsedContent.blocks.length, 'blocks');
          }
        }

        if (parsedContent && parsedContent.blocks && parsedContent.blocks.length > 0) {
          console.log('[NewsBlogModal] ✅ Using block format with', parsedContent.blocks.length, 'blocks');
          setEditorContent(parsedContent);
          // ✅ Ensure rowConfig is valid - if missing, create default from blockCount
          const rowCfg = parsedContent.rowConfig || [];
          if (rowCfg.length === 0 && parsedContent.blocks.length > 0) {
            // Auto-generate: 1 row with all blocks
            setRowConfig([{ layout: 1, blockCount: parsedContent.blocks.length }]);
          } else {
            setRowConfig(rowCfg);
          }
          console.log('[NewsBlogModal] 🔄 Resetting blocks:', parsedContent.blocks.length);
          resetBlocks(parsedContent.blocks);
        } else {
          // Fallback: Convert legacy content to BlockEditor format
          console.log('[NewsBlogModal] ⚠️  Falling back to legacy format');
          console.log('[NewsBlogModal] Content being converted:', JSON.stringify(contentToConvert, null, 2));
          const legacyContent = parseNewsContent(contentToConvert as NewsContentShape | null);
          console.log('[NewsBlogModal] Legacy content converted to:', JSON.stringify(legacyContent, null, 2));
          setEditorContent(legacyContent);
          // ✅ Auto-generate rowConfig for legacy content too
          if (legacyContent.blocks && legacyContent.blocks.length > 0) {
            console.log('[NewsBlogModal] 🔄 Resetting legacy blocks:', legacyContent.blocks.length);
            setRowConfig([{ layout: 1, blockCount: legacyContent.blocks.length }]);
            resetBlocks(legacyContent.blocks);
          } else {
            console.log('[NewsBlogModal] ❌ No blocks found!');
            console.log('[NewsBlogModal] legacyContent:', legacyContent);
            console.log('[NewsBlogModal] legacyContent.blocks:', legacyContent.blocks);
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
      }
      setError(null);
      setActiveTab('info');
    }
  }, [isOpen, article]);

  // ---- Keyboard shortcuts ----
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        if (canRedo) redo();
      }
    },
    [onClose, canUndo, canRedo, undo, redo]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

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
      const hasBlocks = editorContent.blocks.length > 0;
      const content: NewsContentData | null = hasBlocks
        ? {
            blocks: editorContent.blocks,
            rowConfig,
            version: '1.0',
          }
        : null;

      const data: CreateArticleInput = {
        title: title.trim(),
        category,
        excerpt: excerpt.trim() || undefined,
        thumbnailImage,
        content,
        publishedAt: publishedAt || new Date().toISOString().split('T')[0],
        published,
      };

      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { key: 'info' as const, label: 'Basic Info' },
    { key: 'content' as const, label: 'Content (Blocks)' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl flex flex-col"
        style={{
          width: 'calc(100vw - 60px)',
          maxWidth: '1600px',
          height: 'calc(100vh - 60px)',
          maxHeight: '960px',
        }}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Article' : 'New Article'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? `Editing: ${article?.title}` : 'Create a new news article or event'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200 px-6 flex gap-0 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden p-0">
          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                <X size={14} />
              </button>
            </div>
          )}

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
            <div className="flex flex-col h-full w-full">
              {/* Undo/Redo Controls */}
              <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw size={16} className="text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl+Y)"
                  className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCw size={16} className="text-gray-600" />
                </button>
                <div className="text-xs text-gray-400 ml-2">
                  Ctrl+Z / Ctrl+Y
                </div>
              </div>

              {/* 3-Panel Layout */}
              <div className="flex flex-1 overflow-hidden w-full">
                {/* Left 25%: Block Layout Visualizer */}
                <div className="w-[25%] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
                  <BlockLayoutVisualizer
                    blocks={blocks}
                    rowConfig={rowConfig}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onReorder={reorderBlocks}
                    onRowLayoutChange={handleRowLayoutChange}
                    onAddRow={handleAddRow}
                    onDeleteRow={handleDeleteRow}
                    onReorderRows={handleReorderRows}
                    onAddBlockToRow={handleAddBlockToRow}
                    onDeleteBlock={handleDeleteBlock}
                    onMoveBlockToRow={handleMoveBlockToRow}
                  />
                </div>

                {/* Center 40%: Block Editor Panel */}
                <div className="w-[40%] border-r border-gray-200 bg-white overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <BlockEditorPanel
                      block={blocks.find((b) => b.id === selectedId) || null}
                      onChange={updateBlock}
                      onDelete={handleDeleteBlock}
                      undo={undo}
                      redo={redo}
                      canUndo={canUndo}
                      canRedo={canRedo}
                    />
                  </div>
                </div>

                {/* Right 35%: Live Preview */}
                <div className="w-[35%] overflow-hidden bg-white flex flex-col h-full">
                  <div className="shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50 sticky top-0">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</h4>
                    <p className="text-[10px] text-gray-400 mt-1">News article preview</p>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <NewsDetailPreviewRenderer
                      blocks={blocks}
                      rowConfig={rowConfig}
                      articleContext={{
                        title: title,
                        category: category,
                        publishedAt: publishedAt,
                      } satisfies NewsArticleContext}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 bg-gray-50 rounded-b-xl">
          <div className="text-xs text-gray-400">
            {editorContent.blocks.length} content block{editorContent.blocks.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Article'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
