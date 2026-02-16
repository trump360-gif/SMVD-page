"use client";

import { useCallback } from "react";
import type { CourseData } from "@/lib/validation/curriculum";
import type { ApiResponse, CurriculumSection } from "./types";

interface UseCourseEditorDeps {
  updateState: (partial: { isSaving: boolean }) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  updateSectionInState: (sectionId: string, data: CurriculumSection | undefined) => void;
}

/**
 * Course CRUD operations for undergraduate curriculum.
 */
export function useCourseEditor({
  updateState,
  showSuccess,
  showError,
  updateSectionInState,
}: UseCourseEditorDeps) {
  const addCourse = useCallback(
    async (
      sectionId: string,
      semesterIndex: number,
      course: CourseData
    ): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, semesterIndex, course }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "과목 추가에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("과목이 추가되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "과목 추가에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  const updateCourse = useCallback(
    async (
      sectionId: string,
      semesterIndex: number,
      courseIndex: number,
      course: CourseData
    ): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            sectionId,
            semesterIndex,
            courseIndex,
            course,
          }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "과목 수정에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("과목이 수정되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "과목 수정에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  const deleteCourse = useCallback(
    async (
      sectionId: string,
      semesterIndex: number,
      courseIndex: number
    ): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/courses", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, semesterIndex, courseIndex }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "과목 삭제에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("과목이 삭제되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "과목 삭제에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  const reorderCourses = useCallback(
    async (
      sectionId: string,
      semesterIndex: number,
      courses: CourseData[]
    ): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch(
          "/api/admin/curriculum/courses/reorder",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ sectionId, semesterIndex, courses }),
          }
        );

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "과목 순서 변경에 실패했습니다");
        }

        updateSectionInState(sectionId, data.data);
        showSuccess("과목 순서가 변경되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "과목 순서 변경에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError, updateSectionInState]
  );

  return {
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
  };
}
