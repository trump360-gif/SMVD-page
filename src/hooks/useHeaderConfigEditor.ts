'use client';

import { useState, useCallback } from 'react';
import { useDirtyState } from './useDirtyState';
import type { HeaderConfig, Media } from '@/types/schemas';

// ---- Types ----

export interface HeaderConfigData extends HeaderConfig {
  logoImage?: Media | null;
  faviconImage?: Media | null;
}

export interface HeaderConfigEditState {
  logoImageId: string | null;
  faviconImageId: string | null;
  logoPreview: string | null;
  faviconPreview: string | null;
}

// ---- Hook ----

export function useHeaderConfigEditor() {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    localState: editState,
    setLocalState: setEditState,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  } = useDirtyState<HeaderConfigEditState>({
    logoImageId: null,
    faviconImageId: null,
    logoPreview: null,
    faviconPreview: null,
  });

  const clearError = useCallback(() => setError(null), []);

  const fetchHeaderConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/header-config', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '헤더 설정 조회 실패');
      const config = data.data as HeaderConfigData;
      setHeaderConfig(config);
      resetSnapshot({
        logoImageId: config.logoImageId ?? null,
        faviconImageId: config.faviconImageId ?? null,
        logoPreview: config.logoImage?.filepath ?? null,
        faviconPreview: config.faviconImage?.filepath ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '헤더 설정 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, [resetSnapshot]);

  /** Local-only update — no API call */
  const updateLocal = useCallback(
    (input: Partial<HeaderConfigEditState>) => {
      setEditState((prev) => ({ ...prev, ...input }));
    },
    [setEditState],
  );

  /** Persist changes to server */
  const saveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      const res = await fetch('/api/admin/header-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoImageId: editState.logoImageId,
          faviconImageId: editState.faviconImageId,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '헤더 설정 저장 실패');
      const config = data.data as HeaderConfigData;
      setHeaderConfig(config);
      resetSnapshot({
        logoImageId: config.logoImageId ?? null,
        faviconImageId: config.faviconImageId ?? null,
        logoPreview: config.logoImage?.filepath ?? null,
        faviconPreview: config.faviconImage?.filepath ?? null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '헤더 설정 저장 실패';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [editState.logoImageId, editState.faviconImageId, resetSnapshot]);

  return {
    // State
    headerConfig,
    editState,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    // Methods
    fetchHeaderConfig,
    updateLocal,
    saveChanges,
    revert,
    clearError,
  };
}
