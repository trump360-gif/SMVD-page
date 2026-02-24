'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ModalShell } from '@/components/admin/shared/BlogEditorModal';
import WorkBasicInfoForm from './WorkBasicInfoForm';
import dynamic from 'next/dynamic';
const TiptapEditor = dynamic(
  () => import('@/components/admin/shared/TiptapEditor').then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    ),
  }
);
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
import { useModalDirtyState } from '@/hooks/useModalDirtyState';
import { UnsavedChangesDialog } from '@/components/admin/shared/UnsavedChangesDialog';

interface WorkBlogModalProps {
  isOpen: boolean;
  project?: WorkProjectData | null;
  onClose: () => void;
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => void;
}

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
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);

  // Images
  const [thumbnailImage, setThumbnailImage] = useState('');

  // Tiptap editor content
  const [editorContent, setEditorContent] = useState<TiptapContent>({
    type: 'doc',
    content: [],
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Dirty State ----
  const formState = useMemo(() => ({
    title, subtitle, category, tags, author, email, year,
    description, published, thumbnailImage, editorContent,
  }), [title, subtitle, category, tags, author, email, year,
    description, published, thumbnailImage, editorContent]);

  const {
    isDirty,
    revert,
    showCloseConfirm,
    setShowCloseConfirm,
    handleClose,
  } = useModalDirtyState(formState, isOpen);

  const handleCloseAttempt = useCallback(() => {
    handleClose(onClose);
  }, [handleClose, onClose]);

  const handleRevert = useCallback(() => {
    const snapshot = revert();
    setTitle(snapshot.title);
    setSubtitle(snapshot.subtitle);
    setCategory(snapshot.category);
    setTags(snapshot.tags);
    setAuthor(snapshot.author);
    setEmail(snapshot.email);
    setYear(snapshot.year);
    setDescription(snapshot.description);
    setPublished(snapshot.published);
    setThumbnailImage(snapshot.thumbnailImage);
    setEditorContent(snapshot.editorContent);
  }, [revert]);

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
        setDescription(project.description || '');
        setThumbnailImage(project.thumbnailImage);
        setPublished(project.published);

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
        setDescription('');
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
        description: description.trim(),
        year,
        heroImage: thumbnailImage.trim(),
        thumbnailImage: thumbnailImage.trim(),
        galleryImages: [],
        published,
        content: editorContent,
      };

      onSubmit(data);
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

  const handleTiptapChange = useCallback((content: TiptapContent) => {
    setEditorContent(content);
  }, []);

  return (
    <>
      <ModalShell
        isOpen={isOpen}
        onClose={handleCloseAttempt}
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
        isDirty={isDirty}
        onRevert={handleRevert}
      >
        {activeTab === 'info' && (
          <div className="flex-1 min-h-0 overflow-y-auto">
          <WorkBasicInfoForm
            title={title}
            subtitle={subtitle}
            category={category}
            tags={tags}
            author={author}
            email={email}
            year={year}
            description={description}
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
            onDescriptionChange={setDescription}
            onThumbnailImageChange={(url) => setThumbnailImage(url || '')}
            onPublishedChange={setPublished}
          />
          </div>
        )}

        {activeTab === 'content' && (
          <div className="p-6 flex-1 min-h-0 flex flex-col">
            <TiptapEditor
              content={editorContent}
              contentFormat="tiptap"
              onChange={handleTiptapChange}
              placeholder="프로젝트 설명을 입력하세요..."
              fontSize={16}
              fontWeight="400"
              color="#1b1d1f"
              lineHeight={1.8}
              className="flex-1"
            />
          </div>
        )}
      </ModalShell>

      <UnsavedChangesDialog
        isOpen={showCloseConfirm}
        onKeepEditing={() => setShowCloseConfirm(false)}
        onDiscard={() => {
          setShowCloseConfirm(false);
          onClose();
        }}
      />
    </>
  );
}
