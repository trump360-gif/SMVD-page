'use client';

import { useState, useCallback } from 'react';
import type { HeaderConfig, Media } from '@/types/schemas';

// ---- Types ----

export interface HeaderConfigData extends HeaderConfig {
  logoImage?: Media | null;
  faviconImage?: Media | null;
}

export interface UpdateHeaderConfigInput {
  logoImageId?: string | null;
  faviconImageId?: string | null;
}

// ---- Hook ----

export function useHeaderConfigEditor() {
  const [headerConfig, setHeaderConfig] = useState<HeaderConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setHeaderConfig(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '헤더 설정 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateHeaderConfig = useCallback(async (input: UpdateHeaderConfigInput) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/header-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '헤더 설정 수정 실패');
      setHeaderConfig(data.data);
      return data.data as HeaderConfigData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '헤더 설정 수정 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    // State
    headerConfig,
    isLoading,
    error,
    // Methods
    fetchHeaderConfig,
    updateHeaderConfig,
    clearError,
  };
}
