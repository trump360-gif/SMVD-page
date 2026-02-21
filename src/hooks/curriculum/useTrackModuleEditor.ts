"use client";

import { useCallback } from "react";
import type {
  TrackData,
  ModuleDetailData,
  UndergraduateContent,
} from "@/lib/validation/curriculum";
import type { CurriculumSection } from "./types";

interface UseTrackModuleEditorDeps {
  sections: CurriculumSection[];
  updateContent: (
    sectionId: string,
    content: UndergraduateContent
  ) => void;
}

/**
 * Track and module updates (local-only) for undergraduate curriculum.
 */
export function useTrackModuleEditor({
  sections,
  updateContent,
}: UseTrackModuleEditorDeps) {
  const getContent = useCallback(
    (sectionId: string): UndergraduateContent | null => {
      const section = sections.find((s) => s.id === sectionId);
      return section ? (section.content as UndergraduateContent) : null;
    },
    [sections]
  );

  const updateTracks = useCallback(
    (sectionId: string, tracks: TrackData[]) => {
      const content = getContent(sectionId);
      if (!content) return;
      updateContent(sectionId, { ...content, tracks });
    },
    [getContent, updateContent]
  );

  const updateModules = useCallback(
    (sectionId: string, modules: ModuleDetailData[]) => {
      const content = getContent(sectionId);
      if (!content) return;
      updateContent(sectionId, { ...content, modules });
    },
    [getContent, updateContent]
  );

  return {
    updateTracks,
    updateModules,
  };
}
