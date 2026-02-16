'use client';

import { useState, useCallback } from 'react';

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

// Attachment data structure (NEW - 2026-02-16)
export interface AttachmentData {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface NewsContentData {
  // New block-based format
  blocks?: import('@/components/admin/shared/BlockEditor/types').Block[];
  rowConfig?: import('@/components/admin/shared/BlockEditor/types').RowConfig[];
  version?: string;
  // Legacy fields (kept for backward compatibility)
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
  content: NewsContentData | null;
  attachments?: AttachmentData[] | null; // NEW - 2026-02-16
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
  content?: NewsContentData | null;
  attachments?: AttachmentData[]; // NEW - 2026-02-16
  publishedAt?: string;
  published?: boolean;
}

export interface UpdateArticleInput {
  title?: string;
  category?: string;
  excerpt?: string | null;
  thumbnailImage?: string;
  content?: NewsContentData | null;
  attachments?: AttachmentData[] | null; // NEW - 2026-02-16
  publishedAt?: string;
  published?: boolean;
}

// ---- Hook ----

export function useNewsEditor() {
  const [articles, setArticles] = useState<NewsArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ---- Articles ----

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
      setArticles(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '뉴스 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addArticle = useCallback(async (input: CreateArticleInput) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/news/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '뉴스 생성 실패');
      setArticles((prev) => [...prev, data.data]);
      return data.data as NewsArticleData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '뉴스 생성 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const updateArticle = useCallback(async (id: string, input: UpdateArticleInput) => {
    try {
      setError(null);

      // 🔍 CRITICAL DEBUG: Log input object structure before sending
      console.log('[useNewsEditor] ========== UPDATE ARTICLE ==========');
      console.log('[useNewsEditor] Article ID:', id);
      console.log('[useNewsEditor] Input object keys:', Object.keys(input));
      console.log('[useNewsEditor] Input.content exists?:', 'content' in input);
      console.log('[useNewsEditor] Input.content type:', typeof input.content);
      console.log('[useNewsEditor] Input.content value:', input.content);
      console.log('[useNewsEditor] Input.content === null?:', input.content === null);
      console.log('[useNewsEditor] Input.content === undefined?:', input.content === undefined);

      if (input.content && typeof input.content === 'object') {
        console.log('[useNewsEditor] Content object keys:', Object.keys(input.content));
        console.log('[useNewsEditor] Content.blocks exists?:', 'blocks' in input.content);
        console.log('[useNewsEditor] Content.blocks type:', typeof (input.content as any).blocks);
        console.log('[useNewsEditor] Content.blocks length:', (input.content as any).blocks?.length);
        console.log('[useNewsEditor] Full content object:', JSON.stringify(input.content, null, 2));
      }

      // 🔍 CRITICAL DEBUG: Log full input before stringify
      console.log('[useNewsEditor] Full input before stringify:', JSON.stringify(input, null, 2));

      const jsonBody = JSON.stringify(input);
      console.log('[useNewsEditor] JSON stringified body:', jsonBody);
      console.log('[useNewsEditor] Body length:', jsonBody.length);

      const res = await fetch(`/api/admin/news/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
        credentials: 'include',
      });

      console.log('[useNewsEditor] Response status:', res.status);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '뉴스 수정 실패');
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? data.data : a))
      );
      return data.data as NewsArticleData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '뉴스 수정 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/news/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '뉴스 삭제 실패');
      }
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : '뉴스 삭제 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const reorderArticle = useCallback(async (articleId: string, newOrder: number) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/news/articles/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, newOrder }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '순서 변경 실패');
      // Refetch to get accurate order
      await fetchArticles();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '순서 변경 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchArticles]);

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
      // Refetch after initialization
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
    // State
    articles,
    isLoading,
    error,
    // Articles
    fetchArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    reorderArticle,
    // Utility
    initializeData,
    clearError,
  };
}
