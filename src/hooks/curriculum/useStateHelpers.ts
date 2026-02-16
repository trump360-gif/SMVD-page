"use client";

import { useState, useCallback } from "react";
import type { UndergraduateContent, GraduateContent } from "@/lib/validation/curriculum";
import type {
  CurriculumSection,
  CurriculumEditorState,
  ApiListResponse,
} from "./types";

/**
 * Core state management and helper functions for the curriculum editor.
 * Provides state, section lookup, fetch, and generic section update.
 */
export function useStateHelpers() {
  const [state, setState] = useState<CurriculumEditorState>({
    sections: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
  });

  // Helper: partial state update
  const updateState = useCallback(
    (partial: Partial<CurriculumEditorState>) => {
      setState((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  // Helper: show success message (auto-dismiss after 3s)
  const showSuccess = useCallback(
    (message: string) => {
      updateState({ successMessage: message, error: null });
      setTimeout(() => updateState({ successMessage: null }), 3000);
    },
    [updateState]
  );

  // Helper: show error message
  const showError = useCallback(
    (message: string) => {
      updateState({ error: message, successMessage: null });
    },
    [updateState]
  );

  // Helper: get section by type
  const getSection = useCallback(
    (type: "CURRICULUM_UNDERGRADUATE" | "CURRICULUM_GRADUATE") => {
      return state.sections.find((s) => s.type === type) || null;
    },
    [state.sections]
  );

  // Helper: get undergraduate content
  const getUndergraduateContent =
    useCallback((): UndergraduateContent | null => {
      const section = getSection("CURRICULUM_UNDERGRADUATE");
      if (!section) return null;
      return section.content as UndergraduateContent;
    }, [getSection]);

  // Helper: get graduate content
  const getGraduateContent = useCallback((): GraduateContent | null => {
    const section = getSection("CURRICULUM_GRADUATE");
    if (!section) return null;
    return section.content as GraduateContent;
  }, [getSection]);

  // Fetch all sections
  const fetchSections = useCallback(async (): Promise<boolean> => {
    try {
      updateState({ isLoading: true, error: null });
      const response = await fetch("/api/admin/curriculum/sections", {
        credentials: "include",
      });

      const data: ApiListResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "섹션 조회에 실패했습니다");
      }

      updateState({ sections: data.data || [], isLoading: false });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      updateState({ isLoading: false });
      showError(message);
      return false;
    }
  }, [updateState, showError]);

  // Update section in local state after API response
  const updateSectionInState = useCallback(
    (sectionId: string, newData: CurriculumSection | undefined) => {
      if (!newData) return;
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? newData : s
        ),
        isSaving: false,
      }));
    },
    []
  );

  // Clear messages
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const clearSuccessMessage = useCallback(() => {
    updateState({ successMessage: null });
  }, [updateState]);

  return {
    state,
    setState,
    updateState,
    showSuccess,
    showError,
    getSection,
    getUndergraduateContent,
    getGraduateContent,
    fetchSections,
    updateSectionInState,
    clearError,
    clearSuccessMessage,
  };
}
