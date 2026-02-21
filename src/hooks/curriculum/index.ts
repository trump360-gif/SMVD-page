"use client";

import { useCallback } from "react";
import { deepEqual } from "@/lib/diffUtils";
import type { CurriculumSection } from "./types";
import { useStateHelpers } from "./useStateHelpers";
import { useCourseEditor } from "./useCourseEditor";
import { useTrackModuleEditor } from "./useTrackModuleEditor";
import { useThesisEditor } from "./useThesisEditor";

export type { CurriculumSection } from "./types";

/**
 * Main curriculum editor hook.
 * Composes sub-hooks for courses, tracks/modules, and theses.
 * All CRUD is local-only until saveChanges() is called.
 */
export function useCurriculumEditor() {
  const {
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
  } = useStateHelpers();

  // Compose sub-hooks with local-only deps
  const subDeps = { sections, updateContent };

  const { addCourse, updateCourse, deleteCourse, reorderCourses } =
    useCourseEditor(subDeps);

  const { updateTracks, updateModules } = useTrackModuleEditor(subDeps);

  const { addThesis, updateThesis, deleteThesis } = useThesisEditor(subDeps);

  /**
   * Save all changed sections to the server.
   * Compares snapshot vs local for each section and PUTs changes.
   */
  const saveChanges = useCallback(async (): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const changedSections = sections.filter((local) => {
        const snap = sectionsSnapshot.find(
          (s: CurriculumSection) => s.id === local.id
        );
        if (!snap) return true;
        return !deepEqual(snap.content, local.content);
      });

      if (changedSections.length === 0) {
        setIsSaving(false);
        return true;
      }

      for (const section of changedSections) {
        const response = await fetch("/api/admin/curriculum/sections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            sectionId: section.id,
            type: section.type,
            content: section.content,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "섹션 저장에 실패했습니다"
          );
        }
      }

      // Re-fetch to sync with server and reset snapshot
      await fetchSections();
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [sections, sectionsSnapshot, setIsSaving, setError, fetchSections]);

  return {
    // State
    sections,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,

    // Section helpers
    getSection,
    getUndergraduateContent,
    getGraduateContent,

    // Fetch & save
    fetchSections,
    saveChanges,
    revert,

    // Course CRUD (undergraduate, local-only)
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,

    // Track/module updates (undergraduate, local-only)
    updateTracks,
    updateModules,

    // Thesis CRUD (graduate, local-only)
    addThesis,
    updateThesis,
    deleteThesis,

    // Local content update (for graduate master/doctor)
    updateContent,

    // Error management
    clearError,
  };
}
