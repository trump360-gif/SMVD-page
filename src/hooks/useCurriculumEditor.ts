"use client";

import { useState, useCallback } from "react";
import type {
  UndergraduateContent,
  GraduateContent,
  CourseData,
  TrackData,
  ModuleDetailData,
  ThesisCardData,
} from "@/lib/validation/curriculum";

// ============================================================
// Section 타입 (API 응답)
// ============================================================

interface CurriculumSection {
  id: string;
  pageId: string;
  type: "CURRICULUM_UNDERGRADUATE" | "CURRICULUM_GRADUATE";
  title: string | null;
  content: UndergraduateContent | GraduateContent;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T = CurriculumSection> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

interface ApiListResponse {
  success: boolean;
  data?: CurriculumSection[];
  message?: string;
}

// ============================================================
// Hook 상태 타입
// ============================================================

interface CurriculumEditorState {
  sections: CurriculumSection[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
}

// ============================================================
// useCurriculumEditor Hook
// ============================================================

export function useCurriculumEditor() {
  const [state, setState] = useState<CurriculumEditorState>({
    sections: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
  });

  // 헬퍼: 상태 부분 업데이트
  const updateState = useCallback(
    (partial: Partial<CurriculumEditorState>) => {
      setState((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  // 헬퍼: 성공 메시지 표시 (3초 후 자동 사라짐)
  const showSuccess = useCallback(
    (message: string) => {
      updateState({ successMessage: message, error: null });
      setTimeout(() => updateState({ successMessage: null }), 3000);
    },
    [updateState]
  );

  // 헬퍼: 에러 메시지 표시
  const showError = useCallback(
    (message: string) => {
      updateState({ error: message, successMessage: null });
    },
    [updateState]
  );

  // 헬퍼: 특정 타입의 섹션 가져오기
  const getSection = useCallback(
    (type: "CURRICULUM_UNDERGRADUATE" | "CURRICULUM_GRADUATE") => {
      return state.sections.find((s) => s.type === type) || null;
    },
    [state.sections]
  );

  // 헬퍼: 학부 콘텐츠 가져오기
  const getUndergraduateContent =
    useCallback((): UndergraduateContent | null => {
      const section = getSection("CURRICULUM_UNDERGRADUATE");
      if (!section) return null;
      return section.content as UndergraduateContent;
    }, [getSection]);

  // 헬퍼: 대학원 콘텐츠 가져오기
  const getGraduateContent = useCallback((): GraduateContent | null => {
    const section = getSection("CURRICULUM_GRADUATE");
    if (!section) return null;
    return section.content as GraduateContent;
  }, [getSection]);

  // ============================================================
  // 섹션 조회
  // ============================================================

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

  // ============================================================
  // 섹션 전체 업데이트
  // ============================================================

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

        // 로컬 상태 업데이트
        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

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
    [updateState, showSuccess, showError]
  );

  // ============================================================
  // 과목 CRUD (학부)
  // ============================================================

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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("과목이 추가되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "과목 추가에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("과목이 수정되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "과목 수정에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("과목이 삭제되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "과목 삭제에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

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
    [updateState, showSuccess, showError]
  );

  // ============================================================
  // 트랙 업데이트 (학부)
  // ============================================================

  const updateTracks = useCallback(
    async (sectionId: string, tracks: TrackData[]): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/tracks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, tracks }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "트랙 정보 업데이트에 실패했습니다");
        }

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("트랙 정보가 업데이트되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "트랙 정보 업데이트에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
  );

  // ============================================================
  // 모듈 업데이트 (학부)
  // ============================================================

  const updateModules = useCallback(
    async (sectionId: string, modules: ModuleDetailData[]): Promise<boolean> => {
      try {
        updateState({ isSaving: true });

        const response = await fetch("/api/admin/curriculum/modules", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sectionId, modules }),
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "모듈 정보 업데이트에 실패했습니다"
          );
        }

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("모듈 정보가 업데이트되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "모듈 정보 업데이트에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
  );

  // ============================================================
  // 논문 CRUD (대학원)
  // ============================================================

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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("논문이 추가되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "논문 추가에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("논문이 수정되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "논문 수정에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
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

        setState((prev) => ({
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId && data.data ? data.data : s
          ),
          isSaving: false,
        }));

        showSuccess("논문이 삭제되었습니다");
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "논문 삭제에 실패했습니다";
        updateState({ isSaving: false });
        showError(message);
        return false;
      }
    },
    [updateState, showSuccess, showError]
  );

  // ============================================================
  // 에러/성공 메시지 초기화
  // ============================================================

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const clearSuccessMessage = useCallback(() => {
    updateState({ successMessage: null });
  }, [updateState]);

  // ============================================================
  // Return
  // ============================================================

  return {
    // 상태
    sections: state.sections,
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    error: state.error,
    successMessage: state.successMessage,

    // 섹션 헬퍼
    getSection,
    getUndergraduateContent,
    getGraduateContent,

    // 섹션 CRUD
    fetchSections,
    updateSection,

    // 과목 CRUD (학부)
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,

    // 트랙/모듈 업데이트 (학부)
    updateTracks,
    updateModules,

    // 논문 CRUD (대학원)
    addThesis,
    updateThesis,
    deleteThesis,

    // 메시지 관리
    clearError,
    clearSuccessMessage,
  };
}
