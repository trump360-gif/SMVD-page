'use client';

import { useState, useCallback } from 'react';

// ---- Types ----

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNavigationInput {
  label: string;
  href: string;
  parentId?: string;
}

export interface UpdateNavigationInput {
  label?: string;
  href?: string;
  parentId?: string | null;
}

export interface ReorderItem {
  id: string;
  order: number;
}

// ---- Hook ----

export function useNavigationEditor() {
  const [navigations, setNavigations] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchNavigations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/navigation', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '네비게이션 조회 실패');
      setNavigations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '네비게이션 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNavigation = useCallback(async (input: CreateNavigationInput) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '네비게이션 생성 실패');
      setNavigations((prev) => [...prev, data.data]);
      return data.data as NavigationItem;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '네비게이션 생성 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const updateNavigation = useCallback(async (id: string, input: UpdateNavigationInput) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/navigation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '네비게이션 수정 실패');
      setNavigations((prev) =>
        prev.map((nav) => (nav.id === id ? data.data : nav))
      );
      return data.data as NavigationItem;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '네비게이션 수정 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const deleteNavigation = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/navigation/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '네비게이션 삭제 실패');
      }
      setNavigations((prev) => prev.filter((nav) => nav.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : '네비게이션 삭제 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const reorderNavigations = useCallback(async (items: ReorderItem[]) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/navigation/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '순서 변경 실패');
      setNavigations(data.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '순서 변경 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const toggleNavigation = useCallback(async (id: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/navigation/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '활성화 상태 변경 실패');
      setNavigations((prev) =>
        prev.map((nav) => (nav.id === id ? data.data : nav))
      );
      return data.data as NavigationItem;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '활성화 상태 변경 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    // State
    navigations,
    isLoading,
    error,
    // Methods
    fetchNavigations,
    addNavigation,
    updateNavigation,
    deleteNavigation,
    reorderNavigations,
    toggleNavigation,
    clearError,
  };
}
