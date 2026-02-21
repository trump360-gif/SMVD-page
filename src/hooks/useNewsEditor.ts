'use client';

import { useState, useCallback } from 'react';
import { useDirtyState } from './useDirtyState';
import { deepEqual } from '@/lib/diffUtils';
import type { TiptapContent } from '@/components/admin/shared/BlockEditor/types';

// ---- Types ----

export interface GalleryData {
  main: string;
  layout: string;
  centerLeft: string;
  centerRight: string;
  bottomLeft: string;
  bottomCenter: string;
  bottomRight: string;
}

export interface AttachmentData {
  id: string;
  filename: string;
  filepath?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
  fileBlob?: File;
}

export interface NewsContentData {
  type?: 'doc';
  content?: any[];
  introTitle?: string;
  introText?: string;
  gallery?: GalleryData;
}

export interface NewsArticleData {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  thumbnailImage: string;
  content: TiptapContent | NewsContentData | null;
  attachments?: AttachmentData[] | null;
  publishedAt: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleInput {
  title: string;
  category: string;
  excerpt?: string;
  thumbnailImage?: string;
  content?: TiptapContent | NewsContentData | null;
  attachments?: AttachmentData[] | null;
  publishedAt?: string;
  published?: boolean;
}

export interface UpdateArticleInput {
  title?: string;
  category?: string;
  excerpt?: string | null;
  thumbnailImage?: string;
  content?: TiptapContent | NewsContentData | null;
  attachments?: AttachmentData[] | null;
  publishedAt?: string;
  published?: boolean;
}

// ---- Hook ----

let tempIdCounter = 0;

export function useNewsEditor() {
  const {
    localState: articles,
    setLocalState: setArticles,
    snapshot: articlesSnapshot,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  } = useDirtyState<NewsArticleData[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ---- Fetch ----

  const fetchArticles = useCallback(async (category?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = category && category !== 'ALL' ? `?category=${category}` : '';
      const res = await fetch(`/api/admin/news/articles${params}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '뉴스 조회 실패');
      resetSnapshot(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '뉴스 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, [resetSnapshot]);

  // ---- Articles: local-only mutations ----

  const addArticle = useCallback((input: CreateArticleInput) => {
    const tempId = `temp_${Date.now()}_${++tempIdCounter}`;
    const newArticle: NewsArticleData = {
      id: tempId,
      slug: '',
      title: input.title,
      category: input.category,
      excerpt: input.excerpt || null,
      thumbnailImage: input.thumbnailImage || '',
      content: input.content ?? null,
      attachments: input.attachments ?? null,
      publishedAt: input.publishedAt || new Date().toISOString(),
      published: input.published ?? true,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setArticles((prev) => {
      newArticle.order = prev.length;
      return [...prev, newArticle];
    });
    return newArticle;
  }, [setArticles]);

  const updateArticle = useCallback((id: string, input: UpdateArticleInput) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...input, updatedAt: new Date().toISOString() } : a))
    );
  }, [setArticles]);

  const deleteArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, [setArticles]);

  const reorderArticle = useCallback((articleId: string, newOrder: number) => {
    setArticles((prev) => {
      const items = [...prev];
      const idx = items.findIndex((a) => a.id === articleId);
      if (idx === -1) return prev;
      const [moved] = items.splice(idx, 1);
      items.splice(newOrder, 0, moved);
      return items.map((item, i) => ({ ...item, order: i }));
    });
  }, [setArticles]);

  // ---- Save all changes ----

  const saveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);

      await syncArticles(articlesSnapshot, articles);

      // Re-fetch to sync snapshot with server state
      await fetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '저장 실패';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [articles, articlesSnapshot, fetchArticles]);

  // ---- Initialize ----

  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/news/init', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '초기화 실패');
      await fetchArticles();
      return data.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '초기화 실패';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    fetchArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    reorderArticle,
    saveChanges,
    revert,
    initializeData,
    clearError,
  };
}

// ---- Helpers for saveChanges ----

async function syncArticles(
  snapItems: NewsArticleData[],
  localItems: NewsArticleData[]
) {
  const localIds = new Set(localItems.map((i) => i.id));
  const snapMap = new Map(snapItems.map((i) => [i.id, i]));

  // 1. Delete: in snapshot but not in local
  for (const item of snapItems) {
    if (!localIds.has(item.id)) {
      const res = await fetch(`/api/admin/news/articles/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('뉴스 삭제 실패');
    }
  }

  // 2. Create: temp IDs (new items)
  for (const item of localItems) {
    if (item.id.startsWith('temp_')) {
      const res = await fetch('/api/admin/news/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          excerpt: item.excerpt,
          thumbnailImage: item.thumbnailImage,
          content: item.content,
          attachments: item.attachments,
          publishedAt: item.publishedAt,
          published: item.published,
        }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('뉴스 생성 실패');
    }
  }

  // 3. Update: existing items with changed fields
  for (const item of localItems) {
    if (item.id.startsWith('temp_')) continue;
    const orig = snapMap.get(item.id);
    if (!orig) continue;
    if (!deepEqual(orig, item)) {
      const res = await fetch(`/api/admin/news/articles/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          excerpt: item.excerpt,
          thumbnailImage: item.thumbnailImage,
          content: item.content,
          attachments: item.attachments,
          publishedAt: item.publishedAt,
          published: item.published,
        }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('뉴스 수정 실패');
    }
  }

  // 4. Reorder
  for (let i = 0; i < localItems.length; i++) {
    const item = localItems[i];
    if (item.id.startsWith('temp_')) continue;
    const orig = snapMap.get(item.id);
    if (orig && orig.order !== i) {
      await fetch('/api/admin/news/articles/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: item.id, newOrder: i }),
        credentials: 'include',
      });
    }
  }
}
