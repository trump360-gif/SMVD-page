'use client';

import { useState, useCallback } from 'react';
import { useDirtyState } from './useDirtyState';

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

let tempIdCounter = 0;

export function useNavigationEditor() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    localState: navigations,
    setLocalState: setNavigations,
    snapshot,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  } = useDirtyState<NavigationItem[]>([]);

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
      resetSnapshot(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '네비게이션 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, [resetSnapshot]);

  /** Local-only: add with temp ID */
  const addNavigation = useCallback(
    (input: CreateNavigationInput) => {
      tempIdCounter++;
      setNavigations((prev) => {
        const tempItem: NavigationItem = {
          id: `temp_${Date.now()}_${tempIdCounter}`,
          label: input.label,
          href: input.href,
          order: prev.length,
          isActive: true,
          parentId: input.parentId ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [...prev, tempItem];
      });
    },
    [setNavigations],
  );

  /** Local-only: update fields */
  const updateNavigation = useCallback(
    (id: string, input: UpdateNavigationInput) => {
      setNavigations((prev) =>
        prev.map((nav) =>
          nav.id === id
            ? { ...nav, ...input, updatedAt: new Date().toISOString() }
            : nav,
        ),
      );
    },
    [setNavigations],
  );

  /** Local-only: delete */
  const deleteNavigation = useCallback(
    (id: string) => {
      setNavigations((prev) => prev.filter((nav) => nav.id !== id));
    },
    [setNavigations],
  );

  /** Local-only: reorder */
  const reorderNavigations = useCallback(
    (items: ReorderItem[]) => {
      setNavigations((prev) => {
        const orderMap = new Map(items.map((i) => [i.id, i.order]));
        return [...prev]
          .map((nav) => ({
            ...nav,
            order: orderMap.has(nav.id) ? orderMap.get(nav.id)! : nav.order,
          }))
          .sort((a, b) => a.order - b.order);
      });
    },
    [setNavigations],
  );

  /** Local-only: toggle active state */
  const toggleNavigation = useCallback(
    (id: string) => {
      setNavigations((prev) =>
        prev.map((nav) =>
          nav.id === id ? { ...nav, isActive: !nav.isActive } : nav,
        ),
      );
    },
    [setNavigations],
  );

  /** Persist all local changes to server */
  const saveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);

      const snapshotMap = new Map(snapshot.map((s) => [s.id, s]));

      // Compute diffs
      const deletedIds = snapshot
        .filter((s) => !navigations.some((n) => n.id === s.id))
        .map((s) => s.id);

      const newItems = navigations.filter((n) => n.id.startsWith('temp_'));

      const modifiedItems = navigations.filter((n) => {
        if (n.id.startsWith('temp_')) return false;
        const orig = snapshotMap.get(n.id);
        if (!orig) return false;
        return (
          orig.label !== n.label ||
          orig.href !== n.href ||
          orig.parentId !== n.parentId
        );
      });

      const toggledItems = navigations.filter((n) => {
        if (n.id.startsWith('temp_')) return false;
        const orig = snapshotMap.get(n.id);
        return orig && orig.isActive !== n.isActive;
      });

      // 1. Delete removed items
      for (const id of deletedIds) {
        const res = await fetch(`/api/admin/navigation/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { message?: string }).message || '네비게이션 삭제 실패',
          );
        }
      }

      // 2. Create new items (capture real IDs for reorder)
      const tempIdToRealId = new Map<string, string>();
      for (const item of newItems) {
        const res = await fetch('/api/admin/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: item.label,
            href: item.href,
            parentId: item.parentId,
          }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '네비게이션 생성 실패');
        tempIdToRealId.set(item.id, data.data.id);
      }

      // 3. Update modified items
      for (const item of modifiedItems) {
        const res = await fetch(`/api/admin/navigation/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: item.label,
            href: item.href,
            parentId: item.parentId,
          }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '네비게이션 수정 실패');
      }

      // 4. Toggle items that changed isActive
      for (const item of toggledItems) {
        const res = await fetch(`/api/admin/navigation/${item.id}/toggle`, {
          method: 'PATCH',
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { message?: string }).message || '활성화 상태 변경 실패',
          );
        }
      }

      // 5. Reorder with real IDs
      const reorderItems = navigations
        .map((n, idx) => ({
          id: n.id.startsWith('temp_')
            ? tempIdToRealId.get(n.id) ?? ''
            : n.id,
          order: idx,
        }))
        .filter((item) => item.id !== '');

      if (reorderItems.length > 0) {
        const res = await fetch('/api/admin/navigation/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: reorderItems }),
          credentials: 'include',
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { message?: string }).message || '순서 변경 실패',
          );
        }
      }

      // 6. Re-fetch to sync snapshot with server
      await fetchNavigations();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '네비게이션 저장 실패';
      setError(msg);
      await fetchNavigations();
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [snapshot, navigations, fetchNavigations]);

  return {
    // State
    navigations,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    // Methods
    fetchNavigations,
    addNavigation,
    updateNavigation,
    deleteNavigation,
    reorderNavigations,
    toggleNavigation,
    saveChanges,
    revert,
    clearError,
  };
}
