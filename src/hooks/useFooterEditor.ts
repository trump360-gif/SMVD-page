'use client';

import { useState, useCallback } from 'react';
import { useDirtyState } from './useDirtyState';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    localState: footer,
    setLocalState: setFooter,
    snapshot,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  } = useDirtyState<FooterData | null>(null);

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
      resetSnapshot(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '푸터 조회 실패');
    } finally {
      setIsLoading(false);
    }
  }, [resetSnapshot]);

  /** Local-only: update text fields */
  const updateFooterText = useCallback(
    (input: UpdateFooterTextInput) => {
      setFooter((prev) => (prev ? { ...prev, ...input } : prev));
    },
    [setFooter],
  );

  /** Local-only: add or update an SNS link */
  const upsertSocialLink = useCallback(
    (platform: SocialPlatform, input: UpsertSocialLinkInput) => {
      setFooter((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          socialLinks: {
            ...(prev.socialLinks ?? {}),
            [platform]: { url: input.url, isActive: input.isActive },
          },
        };
      });
    },
    [setFooter],
  );

  /** Local-only: delete an SNS link */
  const deleteSocialLink = useCallback(
    (platform: SocialPlatform) => {
      setFooter((prev) => {
        if (!prev) return prev;
        const newLinks = { ...(prev.socialLinks ?? {}) } as Record<string, SocialLinkItem>;
        delete newLinks[platform];
        return { ...prev, socialLinks: newLinks as SocialLinksMap };
      });
    },
    [setFooter],
  );

  /** Local-only: toggle an SNS link's isActive */
  const toggleSocialLink = useCallback(
    (platform: SocialPlatform) => {
      setFooter((prev) => {
        if (!prev) return prev;
        const links = (prev.socialLinks ?? {}) as Record<string, SocialLinkItem>;
        const link = links[platform];
        if (!link) return prev;
        return {
          ...prev,
          socialLinks: {
            ...links,
            [platform]: { ...link, isActive: !link.isActive },
          } as SocialLinksMap,
        };
      });
    },
    [setFooter],
  );

  /** Persist all changes to server */
  const saveChanges = useCallback(async () => {
    if (!footer) return;
    try {
      setIsSaving(true);
      setError(null);

      // 1. Text fields
      const textChanged =
        snapshot &&
        (snapshot.title !== footer.title ||
          snapshot.description !== footer.description ||
          snapshot.address !== footer.address ||
          snapshot.phone !== footer.phone ||
          snapshot.email !== footer.email ||
          snapshot.copyright !== footer.copyright);

      if (textChanged) {
        const res = await fetch('/api/admin/footer', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: footer.title,
            description: footer.description,
            address: footer.address,
            phone: footer.phone,
            email: footer.email,
            copyright: footer.copyright,
          }),
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '푸터 텍스트 저장 실패');
      }

      // 2. SNS link changes
      const oldLinks = (snapshot?.socialLinks ?? {}) as Record<string, SocialLinkItem>;
      const newLinks = (footer.socialLinks ?? {}) as Record<string, SocialLinkItem>;
      const oldPlatforms = Object.keys(oldLinks);
      const newPlatforms = Object.keys(newLinks);

      // Deleted
      for (const p of oldPlatforms) {
        if (!newPlatforms.includes(p)) {
          const res = await fetch(`/api/admin/footer/social-links/${p}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(
              (data as { message?: string }).message || 'SNS 링크 삭제 실패',
            );
          }
        }
      }

      // New or modified
      for (const p of newPlatforms) {
        const oldLink = oldLinks[p];
        const newLink = newLinks[p];
        if (
          !oldLink ||
          oldLink.url !== newLink.url ||
          oldLink.isActive !== newLink.isActive
        ) {
          const res = await fetch(`/api/admin/footer/social-links/${p}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLink),
            credentials: 'include',
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'SNS 링크 저장 실패');
        }
      }

      // Re-fetch to sync snapshot
      await fetchFooter();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '푸터 저장 실패';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [footer, snapshot, fetchFooter]);

  return {
    // State
    footer,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    // Methods
    fetchFooter,
    updateFooterText,
    upsertSocialLink,
    deleteSocialLink,
    toggleSocialLink,
    saveChanges,
    revert,
    clearError,
  };
}
