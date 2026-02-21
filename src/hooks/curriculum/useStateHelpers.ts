"use client";

import { useState, useCallback } from "react";
import type { UndergraduateContent, GraduateContent } from "@/lib/validation/curriculum";
import { useDirtyState } from "../useDirtyState";
import type {
  CurriculumSection,
  ApiListResponse,
} from "./types";

/**
 * Core state management for the curriculum editor.
 * Uses useDirtyState for snapshot/local state tracking.
 */
export function useStateHelpers() {
  const {
    localState: sections,
    setLocalState: setSections,
    snapshot: sectionsSnapshot,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  } = useDirtyState<CurriculumSection[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Helper: get section by type
  const getSection = useCallback(
    (type: "CURRICULUM_UNDERGRADUATE" | "CURRICULUM_GRADUATE") => {
      return sections.find((s) => s.type === type) || null;
    },
    [sections]
  );

  const getUndergraduateContent =
    useCallback((): UndergraduateContent | null => {
      const section = getSection("CURRICULUM_UNDERGRADUATE");
      if (!section) return null;
      return section.content as UndergraduateContent;
    }, [getSection]);

  const getGraduateContent = useCallback((): GraduateContent | null => {
    const section = getSection("CURRICULUM_GRADUATE");
    if (!section) return null;
    return section.content as GraduateContent;
  }, [getSection]);

  // Fetch all sections
  const fetchSections = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/admin/curriculum/sections", {
        credentials: "include",
      });

      const data: ApiListResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "섹션 조회에 실패했습니다");
      }

      resetSnapshot(data.data || []);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [resetSnapshot]);

  // Local-only: update section content
  const updateContent = useCallback(
    (sectionId: string, newContent: UndergraduateContent | GraduateContent) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, content: newContent } : s
        )
      );
    },
    [setSections]
  );

  return {
    sections,
    sectionsSnapshot,
    isDirty,
    changeCount,
    isLoading,
    isSaving,
    setIsSaving,
    error,
    setError,
    getSection,
    getUndergraduateContent,
    getGraduateContent,
    fetchSections,
    updateContent,
    revert,
    clearError,
  };
}
