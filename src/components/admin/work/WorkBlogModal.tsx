'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import BlockEditor from '@/components/admin/shared/BlockEditor';
import type { BlogContent, WorkProjectContext, HeroImageBlock } from '@/components/admin/shared/BlockEditor/types';
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
  const modalRef = useRef<HTMLDivElement>(null);

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

        // Convert legacy description (markdown) + galleryImages + heroImage to BlogContent
        setEditorContent(
          parseWorkProjectContent(
            project.description,
            project.galleryImages as string[] | undefined,
            project.heroImage,
            project.title,
            project.author,
            project.email
          )
        );
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
      }
      setError(null);
      setActiveTab('info');
    }
  }, [isOpen, project]);

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

      // Extract heroImage from HeroImageBlock in block content
      const heroBlock = editorContent.blocks.find(
        (b) => b.type === 'hero-image'
      ) as HeroImageBlock | undefined;
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
              {isEditing ? 'Edit Portfolio' : 'New Portfolio'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? `Editing: ${project?.title}` : 'Create a new portfolio project'}
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

          {/* Tab: Content (Block Editor) */}
          {activeTab === 'content' && (
            <div>
              <p className="text-sm text-gray-500 mb-3">
                Build the project detail page. Use Text blocks for description and Work Gallery for images.
                The preview shows the exact layout as it appears on the public page.
              </p>
              <BlockEditor
                value={editorContent}
                onChange={setEditorContent}
                enablePreview={true}
                previewMode="work-detail"
                showWorkBlocks={true}
                projectContext={{
                  title: title,
                  author: author,
                  email: email,
                  heroImage: '',
                  category: category,
                } satisfies WorkProjectContext}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
