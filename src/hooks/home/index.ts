"use client";

import { useState, useCallback, useEffect } from "react";
import type { Section } from "./types";
import { useExhibitionItemEditor } from "./useExhibitionItemEditor";
import { useWorkPortfolioEditor } from "./useWorkPortfolioEditor";

export type { Section, ExhibitionItem, WorkPortfolio } from "./types";

/**
 * Main home page editor hook.
 * Composes sub-hooks for exhibition items and work portfolios.
 */
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
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSections(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // About section update
  const updateAboutSection = useCallback(
    async (sectionId: string, content: Record<string, unknown>) => {
      try {
        const response = await fetch(`/api/admin/sections/${sectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          credentials: "include",
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? result.data : s))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("소개 섹션 저장 실패");
      }
    },
    []
  );

  // Compose sub-hooks
  const {
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
  } = useExhibitionItemEditor(sections, setSections);

  const {
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
  } = useWorkPortfolioEditor(sections, setSections);

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
