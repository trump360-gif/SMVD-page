'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import BlockEditor from '@/components/admin/shared/BlockEditor';
import type { BlogContent } from '@/components/admin/shared/BlockEditor/types';
import { parseNewsContent, type NewsContentShape } from '@/lib/content-parser';
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
  const [activeTab, setActiveTab] = useState<'info' | 'blog-content'>('info');

  // Basic info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notice');
  const [excerpt, setExcerpt] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState('/Group-27.svg');
  const [publishedAt, setPublishedAt] = useState('');
  const [published, setPublished] = useState(true);

  // Block editor content (replaces introTitle + introText + gallery)
  const [editorContent, setEditorContent] = useState<BlogContent>({
    blocks: [],
    version: '1.0',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Reset form ----
  useEffect(() => {
    if (isOpen) {
      if (article) {
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

        // Convert legacy content JSON to BlockEditor format
        const content = article.content as NewsContentShape | null;
        setEditorContent(parseNewsContent(content));
      } else {
        setTitle('');
        setCategory('Notice');
        setExcerpt('');
        setThumbnailImage('/Group-27.svg');
        setPublishedAt(new Date().toISOString().split('T')[0]);
        setPublished(true);
        setEditorContent({ blocks: [], version: '1.0' });
      }
      setError(null);
      setActiveTab('info');
    }
  }, [isOpen, article]);

  // ---- Escape key handler ----
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
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

    if (!title.trim()) { setError('Title is required'); setActiveTab('info'); return; }
    if (!category) { setError('Category is required'); setActiveTab('info'); return; }

    setIsSubmitting(true);

    try {
      // Build content in new block format
      // Each block is type-safe via discriminated union (Block type)
      const hasBlocks = editorContent.blocks.length > 0;
      const content: NewsContentData | null = hasBlocks
        ? {
            blocks: editorContent.blocks, // Block[] - already type-safe
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
    { key: 'blog-content' as const, label: 'Blog Content' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl flex flex-col"
        style={{
          width: 'calc(100vw - 80px)',
          maxWidth: '1200px',
          height: 'calc(100vh - 80px)',
          maxHeight: '900px',
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
        <div className="flex-1 overflow-y-auto p-6">
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
            <div className="space-y-5 max-w-3xl">
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

          {/* Tab: Blog Content (Block Editor) */}
          {activeTab === 'blog-content' && (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Build the article page using content blocks. Add text, images, galleries, and more.
              </p>
              <BlockEditor
                value={editorContent}
                onChange={setEditorContent}
                enablePreview={true}
              />
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
