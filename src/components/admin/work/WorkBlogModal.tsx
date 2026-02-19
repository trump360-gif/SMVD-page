'use client';

import { useState, useEffect, useCallback } from 'react';
import { ModalShell } from '@/components/admin/shared/BlogEditorModal';
import WorkBasicInfoForm from './WorkBasicInfoForm';
import { TiptapEditor } from '@/components/admin/shared/TiptapEditor';
import type { TiptapContent } from '@/components/admin/shared/BlockEditor/types';
import { isTiptapContent } from '@/components/admin/shared/BlockEditor/types';
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

  // Tiptap editor content (single JSON document)
  const [editorContent, setEditorContent] = useState<TiptapContent>({
    type: 'doc',
    content: [],
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

        // Parse Tiptap JSON content or default
        let tiptapContent: TiptapContent = { type: 'doc', content: [] };
        if (project.content) {
          if (typeof project.content === 'string') {
            try {
              const parsed = JSON.parse(project.content);
              if (isTiptapContent(parsed)) {
                tiptapContent = parsed;
              }
            } catch (e) {
              console.error('Failed to parse content:', e);
            }
          } else if (isTiptapContent(project.content)) {
            tiptapContent = project.content;
          }
        }

        setEditorContent(tiptapContent);
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
        setEditorContent({ type: 'doc', content: [] });
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

      const data: CreateProjectInput = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        tags: parsedTags,
        author: author.trim(),
        email: email.trim(),
        description: '', // No longer used (content is in Tiptap JSON)
        year,
        heroImage: thumbnailImage.trim(), // Use thumbnail as hero image
        thumbnailImage: thumbnailImage.trim(),
        galleryImages: [],
        published,
        content: editorContent, // Store Tiptap JSON directly
      };

      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { key: 'info', label: '기본정보' },
    { key: 'content', label: '콘텐츠' },
  ];

  // Handle TiptapEditor content change
  const handleTiptapChange = useCallback((content: TiptapContent) => {
    setEditorContent(content);
  }, []);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Work 상세페이지 작성"
      subtitle={isEditing ? `편집중: ${project?.title}` : '새로운 포트폴리오 프로젝트를 만드세요'}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(key) => setActiveTab(key as 'info' | 'content')}
      error={error}
      onClearError={() => setError(null)}
      footerInfo=""
      submitLabel={isSubmitting ? '저장중...' : isEditing ? '변경사항 저장' : '프로젝트 생성'}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
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

      {/* Tab: Content (TiptapEditor) */}
      {activeTab === 'content' && (
        <div className="p-6">
          <TiptapEditor
            content={editorContent}
            contentFormat="tiptap"
            onChange={handleTiptapChange}
            placeholder="프로젝트 설명을 입력하세요..."
            fontSize={16}
            fontWeight="400"
            color="#1b1d1f"
            lineHeight={1.8}
          />
        </div>
      )}
    </ModalShell>
  );
}
