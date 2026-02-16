"use client";

import { useCallback } from "react";
import type { ThesisCardData } from "@/lib/validation/curriculum";
import type { ApiResponse, CurriculumSection } from "./types";

interface UseThesisEditorDeps {
  updateState: (partial: { isSaving: boolean }) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  updateSectionInState: (sectionId: string, data: CurriculumSection | undefined) => void;
}

/**
 * Thesis CRUD operations for graduate curriculum.
 */
export function useThesisEditor({
  updateState,
  showSuccess,
  showError,
  updateSectionInState,
}: UseThesisEditorDeps) {
  const addThesis = useCallback(
    async (sectionId: string, thesis: ThesisCardData): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/theses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, thesis }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "논문 추가에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("논문이 추가되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "논문 추가에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  const updateThesis = useCallback(
    async (
      sectionId: string,
      thesisIndex: number,
      thesis: ThesisCardData
    ): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/theses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, thesisIndex, thesis }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "논문 수정에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("논문이 수정되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "논문 수정에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  const deleteThesis = useCallback(
    async (sectionId: string, thesisIndex: number): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/theses", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, thesisIndex }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "논문 삭제에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("논문이 삭제되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "논문 삭제에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  return {
    addThesis,
    updateThesis,
    deleteThesis,
  };
}
