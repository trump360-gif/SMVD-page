'use client';

import { useState, useCallback } from 'react';
import type { SocialPlatform } from '@/types/schemas';

// ---- Types ----

export interface SocialLinkItem {
  url: string;
  isActive: boolean;
}

export type SocialLinksMap = Partial<Record<SocialPlatform, SocialLinkItem>>;

export interface FooterData {
  id: string;
  title: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  copyright: string | null;
  socialLinks: SocialLinksMap | null;
  updatedAt: string;
}

export interface UpdateFooterTextInput {
  title?: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  copyright?: string | null;
}

export interface UpsertSocialLinkInput {
  url: string;
  isActive: boolean;
}

// ---- Hook ----

export function useFooterEditor() {
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchFooter = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/footer', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '푸터 조회 실패');
      setFooter(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '푸터 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFooter = useCallback(async (input: UpdateFooterTextInput) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '푸터 수정 실패');
      setFooter(data.data);
      return data.data as FooterData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '푸터 수정 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const upsertSocialLink = useCallback(
    async (platform: SocialPlatform, input: UpsertSocialLinkInput) => {
      try {
        setError(null);
        const res = await fetch(`/api/admin/footer/social-links/${platform}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'SNS 링크 저장 실패');
        setFooter(data.data);
        return data.data as FooterData;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'SNS 링크 저장 실패';
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  const deleteSocialLink = useCallback(async (platform: SocialPlatform) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/footer/social-links/${platform}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'SNS 링크 삭제 실패');
      }
      const data = await res.json();
      setFooter(data.data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'SNS 링크 삭제 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const toggleSocialLink = useCallback(async (platform: SocialPlatform) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/footer/social-links/${platform}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'SNS 링크 상태 변경 실패');
      setFooter(data.data);
      return data.data as FooterData;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'SNS 링크 상태 변경 실패';
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  return {
    // State
    footer,
    isLoading,
    error,
    // Methods
    fetchFooter,
    updateFooter,
    upsertSocialLink,
    deleteSocialLink,
    toggleSocialLink,
    clearError,
  };
}
