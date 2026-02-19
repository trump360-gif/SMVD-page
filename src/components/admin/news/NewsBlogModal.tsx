'use client';

import { useState, useEffect, useCallback } from 'react';
import { ModalShell } from '@/components/admin/shared/BlogEditorModal';
import { TiptapEditor } from '@/components/admin/shared/TiptapEditor';
import type { TiptapContent } from '@/components/admin/shared/BlockEditor/types';
import { isTiptapContent } from '@/components/admin/shared/BlockEditor/types';
import {
  newsArticleInputSchema,
  formatValidationError,
} from '@/lib/validation/blog-schemas';
import type {
  NewsArticleData,
  CreateArticleInput,
  UpdateArticleInput,
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

  // Tiptap editor content
  const [editorContent, setEditorContent] = useState<TiptapContent>({
    type: 'doc',
    content: [],
  });

  // Attachments
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);

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
          article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : ''
        );
        setPublished(article.published);

        if (article.attachments && Array.isArray(article.attachments)) {
          setAttachments(article.attachments);
        } else {
          setAttachments([]);
        }

        // Parse Tiptap JSON content or default
        let tiptapContent: TiptapContent = { type: 'doc', content: [] };
        if (article.content) {
          if (typeof article.content === 'string') {
            try {
              const parsed = JSON.parse(article.content);
              if (isTiptapContent(parsed)) {
                tiptapContent = parsed;
              }
            } catch (e) {
              console.error('Failed to parse content:', e);
            }
          } else if (isTiptapContent(article.content)) {
            tiptapContent = article.content;
          }
        }

        setEditorContent(tiptapContent);
      } else {
        setTitle('');
        setCategory('Notice');
        setExcerpt('');
        setThumbnailImage('/Group-27.svg');
        setPublishedAt(new Date().toISOString().split('T')[0]);
        setPublished(true);
        setEditorContent({ type: 'doc', content: [] });
        setAttachments([]);
      }
      setError(null);
      setActiveTab('info');
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
        content: editorContent, // Store Tiptap JSON directly
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : null,
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

  // Handle TiptapEditor content change
  const handleTiptapChange = useCallback((content: TiptapContent) => {
    setEditorContent(content);
  }, []);

  const tabs = [
    { key: 'info', label: '기본정보' },
    { key: 'content', label: '콘텐츠' },
    { key: 'attachments', label: '첨부파일' },
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="News 상세페이지 작성"
      subtitle={isEditing ? `편집중: ${article?.title}` : '새로운 뉴스 기사 또는 행사를 만드세요'}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(key) => setActiveTab(key as 'info' | 'content' | 'attachments')}
      error={error}
      onClearError={() => setError(null)}
      footerInfo=""
      submitLabel={isSubmitting ? '저장중...' : isEditing ? '변경사항 저장' : '기사 생성'}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
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
          onThumbnailImageChange={(url) => setThumbnailImage(url || '')}
          onPublishedAtChange={setPublishedAt}
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
            placeholder="뉴스 기사 내용을 입력하세요..."
            fontSize={16}
            fontWeight="400"
            color="#1b1d1f"
            lineHeight={1.8}
          />
        </div>
      )}

      {/* Tab: Attachments */}
      {activeTab === 'attachments' && (
        <AttachmentsTab attachments={attachments} onAttachmentsChange={setAttachments} />
      )}
    </ModalShell>
  );
}
