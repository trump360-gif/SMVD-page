'use client';

import { useState, useCallback, useEffect } from 'react';

interface Section {
  id: string;
  pageId: string;
  type: string;
  title: string;
  content: any;
  order: number;
  exhibitionItems?: ExhibitionItem[];
  workPortfolios?: WorkPortfolio[];
}

interface ExhibitionItem {
  id: string;
  sectionId: string;
  year: string;
  mediaId: string;
  order: number;
  media?: { id: string; filename: string; filepath: string };
}

interface WorkPortfolio {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  mediaId: string;
  order: number;
  media?: { id: string; filename: string; filepath: string };
}

export function useHomeEditor(initialSections: Section[]) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update sections when initialSections changes
  useEffect(() => {
    if (initialSections.length > 0) {
      setSections(initialSections);
    }
  }, [initialSections]);

  const fetchSections = useCallback(async (pageId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/sections?pageId=${pageId}`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setSections(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Work Portfolio Operations
  const addWorkPortfolio = useCallback(
    async (sectionId: string, data: { title: string; category: string; mediaId: string }) => {
      try {
        const response = await fetch('/api/admin/work-portfolios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, ...data }),
          credentials: 'include',
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        // Update sections locally
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  workPortfolios: [...(s.workPortfolios || []), result.data],
                }
              : s
          )
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('작품 추가 실패');
      }
    },
    []
  );

  const updateWorkPortfolio = useCallback(
    async (
      workId: string,
      data: { title: string; category: string; mediaId: string }
    ) => {
      try {
        const response = await fetch('/api/admin/work-portfolios', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: workId, ...data }),
          credentials: 'include',
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        // Update sections locally
        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            workPortfolios: (s.workPortfolios || []).map((w) =>
              w.id === workId ? result.data : w
            ),
          }))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('작품 수정 실패');
      }
    },
    []
  );

  const deleteWorkPortfolio = useCallback(async (workId: string) => {
    try {
      const response = await fetch(`/api/admin/work-portfolios?id=${workId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      // Update sections locally
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          workPortfolios: (s.workPortfolios || []).filter(
            (w) => w.id !== workId
          ),
        }))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('작품 삭제 실패');
    }
  }, []);

  // Exhibition Item Operations
  const addExhibitionItem = useCallback(
    async (sectionId: string, data: { year: string; mediaId: string }) => {
      try {
        const response = await fetch('/api/admin/exhibition-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, ...data }),
          credentials: 'include',
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        // Update sections locally
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  exhibitionItems: [...(s.exhibitionItems || []), result.data],
                }
              : s
          )
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('전시 아이템 추가 실패');
      }
    },
    []
  );

  const updateExhibitionItem = useCallback(
    async (itemId: string, data: { year: string; mediaId: string }) => {
      try {
        const response = await fetch('/api/admin/exhibition-items', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, ...data }),
          credentials: 'include',
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        // Update sections locally
        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            exhibitionItems: (s.exhibitionItems || []).map((e) =>
              e.id === itemId ? result.data : e
            ),
          }))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('전시 아이템 수정 실패');
      }
    },
    []
  );

  const deleteExhibitionItem = useCallback(async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/exhibition-items?id=${itemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
      }

      // Update sections locally
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          exhibitionItems: (s.exhibitionItems || []).filter(
            (e) => e.id !== itemId
          ),
        }))
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('전시 아이템 삭제 실패');
    }
  }, []);

  const reorderExhibitionItem = useCallback(
    async (itemId: string, direction: 'up' | 'down', sectionId: string) => {
      try {
        // Find current item and its order
        const section = sections.find((s) => s.id === sectionId);
        if (!section?.exhibitionItems) return;

        const currentIndex = section.exhibitionItems.findIndex(
          (e) => e.id === itemId
        );
        if (currentIndex === -1) return;

        const newIndex =
          direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= section.exhibitionItems.length) return;

        const currentItem = section.exhibitionItems[currentIndex];
        const targetItem = section.exhibitionItems[newIndex];

        // Swap orders via API
        const response = await fetch(
          `/api/admin/exhibition-items/reorder`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              itemId: currentItem.id,
              newOrder: targetItem.order,
            }),
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('순서 변경 실패');

        // Update sections with swapped orders
        setSections((prev) =>
          prev.map((s) => {
            if (s.id !== sectionId) return s;
            if (!s.exhibitionItems) return s;

            const items = [...s.exhibitionItems];
            [items[currentIndex], items[newIndex]] = [
              items[newIndex],
              items[currentIndex],
            ];

            return {
              ...s,
              exhibitionItems: items,
            };
          })
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('순서 변경 실패');
      }
    },
    [sections]
  );

  const reorderWorkPortfolio = useCallback(
    async (workId: string, direction: 'up' | 'down', sectionId: string) => {
      try {
        // Find current item and its order
        const section = sections.find((s) => s.id === sectionId);
        if (!section?.workPortfolios) return;

        const currentIndex = section.workPortfolios.findIndex(
          (w) => w.id === workId
        );
        if (currentIndex === -1) return;

        const newIndex =
          direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= section.workPortfolios.length) return;

        const currentItem = section.workPortfolios[currentIndex];
        const targetItem = section.workPortfolios[newIndex];

        // Swap orders via API
        const response = await fetch(
          `/api/admin/work-portfolios/reorder`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              itemId: currentItem.id,
              newOrder: targetItem.order,
            }),
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('순서 변경 실패');

        // Update sections with swapped orders
        setSections((prev) =>
          prev.map((s) => {
            if (s.id !== sectionId) return s;
            if (!s.workPortfolios) return s;

            const items = [...s.workPortfolios];
            [items[currentIndex], items[newIndex]] = [
              items[newIndex],
              items[currentIndex],
            ];

            return {
              ...s,
              workPortfolios: items,
            };
          })
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('순서 변경 실패');
      }
    },
    [sections]
  );

  // About Section Operations
  const updateAboutSection = useCallback(
    async (sectionId: string, content: any) => {
      try {
        const response = await fetch(`/api/admin/sections/${sectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
          credentials: 'include',
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        // Update sections locally
        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? result.data : s))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error('소개 섹션 저장 실패');
      }
    },
    []
  );

  return {
    sections,
    isLoading,
    error,
    fetchSections,
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
    updateAboutSection,
  };
}
