"use client";

import { useCallback } from "react";
import type { ThesisCardData, GraduateContent } from "@/lib/validation/curriculum";
import type { CurriculumSection } from "./types";

interface UseThesisEditorDeps {
  sections: CurriculumSection[];
  updateContent: (
    sectionId: string,
    content: GraduateContent
  ) => void;
}

/**
 * Thesis CRUD operations (local-only) for graduate curriculum.
 */
export function useThesisEditor({
  sections,
  updateContent,
}: UseThesisEditorDeps) {
  const getContent = useCallback(
    (sectionId: string): GraduateContent | null => {
      const section = sections.find((s) => s.id === sectionId);
      return section ? (section.content as GraduateContent) : null;
    },
    [sections]
  );

  const addThesis = useCallback(
    (sectionId: string, thesis: ThesisCardData) => {
      const content = getContent(sectionId);
      if (!content) return;
      updateContent(sectionId, {
        ...content,
        theses: [...(content.theses || []), thesis],
      });
    },
    [getContent, updateContent]
  );

  const updateThesis = useCallback(
    (sectionId: string, thesisIndex: number, thesis: ThesisCardData) => {
      const content = getContent(sectionId);
      if (!content) return;
      updateContent(sectionId, {
        ...content,
        theses: (content.theses || []).map((t, i) =>
          i === thesisIndex ? thesis : t
        ),
      });
    },
    [getContent, updateContent]
  );

  const deleteThesis = useCallback(
    (sectionId: string, thesisIndex: number) => {
      const content = getContent(sectionId);
      if (!content) return;
      updateContent(sectionId, {
        ...content,
        theses: (content.theses || []).filter((_, i) => i !== thesisIndex),
      });
    },
    [getContent, updateContent]
  );

  return {
    addThesis,
    updateThesis,
    deleteThesis,
  };
}
