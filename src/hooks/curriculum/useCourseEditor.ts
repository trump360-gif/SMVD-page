"use client";

import { useCallback } from "react";
import type {
  CourseData,
  UndergraduateContent,
} from "@/lib/validation/curriculum";
import type { CurriculumSection } from "./types";

interface UseCourseEditorDeps {
  sections: CurriculumSection[];
  updateContent: (
    sectionId: string,
    content: UndergraduateContent
  ) => void;
}

/**
 * Course CRUD operations (local-only) for undergraduate curriculum.
 */
export function useCourseEditor({
  sections,
  updateContent,
}: UseCourseEditorDeps) {
  const getContent = useCallback(
    (sectionId: string): UndergraduateContent | null => {
      const section = sections.find((s) => s.id === sectionId);
      return section ? (section.content as UndergraduateContent) : null;
    },
    [sections]
  );

  const addCourse = useCallback(
    (sectionId: string, semesterIndex: number, course: CourseData) => {
      const content = getContent(sectionId);
      if (!content) return;
      const newSemesters = content.semesters.map((sem, idx) => {
        if (idx !== semesterIndex) return sem;
        return { ...sem, courses: [...sem.courses, course] };
      });
      updateContent(sectionId, { ...content, semesters: newSemesters });
    },
    [getContent, updateContent]
  );

  const updateCourse = useCallback(
    (
      sectionId: string,
      semesterIndex: number,
      courseIndex: number,
      course: CourseData
    ) => {
      const content = getContent(sectionId);
      if (!content) return;
      const newSemesters = content.semesters.map((sem, idx) => {
        if (idx !== semesterIndex) return sem;
        return {
          ...sem,
          courses: sem.courses.map((c, ci) =>
            ci === courseIndex ? course : c
          ),
        };
      });
      updateContent(sectionId, { ...content, semesters: newSemesters });
    },
    [getContent, updateContent]
  );

  const deleteCourse = useCallback(
    (sectionId: string, semesterIndex: number, courseIndex: number) => {
      const content = getContent(sectionId);
      if (!content) return;
      const newSemesters = content.semesters.map((sem, idx) => {
        if (idx !== semesterIndex) return sem;
        return {
          ...sem,
          courses: sem.courses.filter((_, ci) => ci !== courseIndex),
        };
      });
      updateContent(sectionId, { ...content, semesters: newSemesters });
    },
    [getContent, updateContent]
  );

  const reorderCourses = useCallback(
    (sectionId: string, semesterIndex: number, courses: CourseData[]) => {
      const content = getContent(sectionId);
      if (!content) return;
      const newSemesters = content.semesters.map((sem, idx) => {
        if (idx !== semesterIndex) return sem;
        return { ...sem, courses };
      });
      updateContent(sectionId, { ...content, semesters: newSemesters });
    },
    [getContent, updateContent]
  );

  return {
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
  };
}
