'use client';

import { useState, useCallback } from 'react';

// ---- Types ----

export interface WorkProjectData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  author: string;
  email: string;
  description: string;
  year: string;
  heroImage: string;
  thumbnailImage: string;
  galleryImages: string[];
  order: number;
  published: boolean;
  content?: Record<string, any>; // BlockEditor content with blocks array
  createdAt: string;
  updatedAt: string;
}

export interface WorkExhibitionData {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  image: string;
  year: string;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  author: string;
  email: string;
  description: string;
  year: string;
  heroImage: string;
  thumbnailImage: string;
  galleryImages: string[];
  published?: boolean;
  content?: Record<string, any>; // BlockEditor content with blocks array
}

export interface UpdateProjectInput {
  title?: string;
  subtitle?: string;
  category?: string;
  tags?: string[];
  author?: string;
  email?: string;
  description?: string;
  year?: string;
  heroImage?: string;
  thumbnailImage?: string;
  galleryImages?: string[];
  published?: boolean;
  content?: Record<string, any>; // BlockEditor content with blocks array
}

export interface CreateExhibitionInput {
  title: string;
  subtitle: string;
  artist: string;
  image: string;
  year?: string;
  published?: boolean;
}

export interface UpdateExhibitionInput {
  title?: string;
  subtitle?: string;
  artist?: string;
  image?: string;
  year?: string;
  published?: boolean;
}

// ---- Hook ----

export function useWorkEditor() {
  const [projects, setProjects] = useState<WorkProjectData[]>([]);
  const [exhibitions, setExhibitions] = useState<WorkExhibitionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // ---- Projects ----

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/work/projects', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '프로젝트 조회 실패');
      setProjects(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로젝트 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProject = useCallback(async (input: CreateProjectInput) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/work/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '프로젝트 생성 실패');
      setProjects((prev) => [...prev, data.data]);
      return data.data as WorkProjectData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '프로젝트 생성 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const updateProject = useCallback(async (id: string, input: UpdateProjectInput) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/work/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '프로젝트 수정 실패');
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? data.data : p))
      );
      return data.data as WorkProjectData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '프로젝트 수정 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/work/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '프로젝트 삭제 실패');
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : '프로젝트 삭제 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const reorderProject = useCallback(async (projectId: string, newOrder: number) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/work/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, newOrder }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '순서 변경 실패');
      // Refetch to get accurate order
      await fetchProjects();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '순서 변경 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchProjects]);

  // ---- Exhibitions ----

  const fetchExhibitions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/work/exhibitions', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '전시 조회 실패');
      setExhibitions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '전시 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addExhibition = useCallback(async (input: CreateExhibitionInput) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/work/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '전시 생성 실패');
      setExhibitions((prev) => [...prev, data.data]);
      return data.data as WorkExhibitionData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '전시 생성 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const updateExhibition = useCallback(async (id: string, input: UpdateExhibitionInput) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/work/exhibitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '전시 수정 실패');
      setExhibitions((prev) =>
        prev.map((e) => (e.id === id ? data.data : e))
      );
      return data.data as WorkExhibitionData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '전시 수정 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const deleteExhibition = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/work/exhibitions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '전시 삭제 실패');
      }
      setExhibitions((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : '전시 삭제 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const reorderExhibition = useCallback(async (exhibitionId: string, newOrder: number) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/work/exhibitions/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exhibitionId, newOrder }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '순서 변경 실패');
      await fetchExhibitions();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '순서 변경 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, [fetchExhibitions]);

  // ---- Initialize ----

  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/work/init', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '초기화 실패');
      // Refetch after initialization
      await Promise.all([fetchProjects(), fetchExhibitions()]);
      return data.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '초기화 실패';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects, fetchExhibitions]);

  return {
    // State
    projects,
    exhibitions,
    isLoading,
    error,
    // Projects
    fetchProjects,
    addProject,
    updateProject,
    deleteProject,
    reorderProject,
    // Exhibitions
    fetchExhibitions,
    addExhibition,
    updateExhibition,
    deleteExhibition,
    reorderExhibition,
    // Utility
    initializeData,
    clearError,
  };
}
