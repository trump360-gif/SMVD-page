"use client";

import { useCallback } from "react";
import type { UndergraduateContent, GraduateContent } from "@/lib/validation/curriculum";
import type { ApiResponse } from "./types";
import { useStateHelpers } from "./useStateHelpers";
import { useCourseEditor } from "./useCourseEditor";
import { useTrackModuleEditor } from "./useTrackModuleEditor";
import { useThesisEditor } from "./useThesisEditor";

export type { CurriculumSection, CurriculumEditorState } from "./types";

/**
 * Main curriculum editor hook.
 * Composes sub-hooks for courses, tracks/modules, and theses.
 */
export function useCurriculumEditor() {
  const {
    state,
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
  } = useStateHelpers();

  // Section full update
  const updateSection = useCallback(
    async (
      sectionId: string,
      type: "CURRICULUM_UNDERGRADUATE" | "CURRICULUM_GRADUATE",
      content: UndergraduateContent | GraduateContent
    ): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, type, content }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "섹션 업데이트에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("섹션이 업데이트되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  // Compose sub-hooks with shared dependencies
  const deps = { updateState, showSuccess, showError, updateSectionInState };

  const { addCourse, updateCourse, deleteCourse, reorderCourses } =
    useCourseEditor(deps);

  const { updateTracks, updateModules } = useTrackModuleEditor(deps);

  const { addThesis, updateThesis, deleteThesis } = useThesisEditor(deps);

  return {
    // State
    sections: state.sections,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    successMessage: state.successMessage,

    // Section helpers
    getSection,
    getUndergraduateContent,
    getGraduateContent,

    // Section CRUD
    fetchSections,
    updateSection,

    // Course CRUD (undergraduate)
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,

    // Track/module updates (undergraduate)
    updateTracks,
    updateModules,

    // Thesis CRUD (graduate)
    addThesis,
    updateThesis,
    deleteThesis,

    // Message management
    clearError,
    clearSuccessMessage,
  };
}
