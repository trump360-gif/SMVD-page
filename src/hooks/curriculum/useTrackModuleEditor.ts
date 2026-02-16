"use client";

import { useCallback } from "react";
import type { TrackData, ModuleDetailData } from "@/lib/validation/curriculum";
import type { ApiResponse, CurriculumSection } from "./types";

interface UseTrackModuleEditorDeps {
  updateState: (partial: { isSaving: boolean }) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  updateSectionInState: (sectionId: string, data: CurriculumSection | undefined) => void;
}

/**
 * Track and module update operations for undergraduate curriculum.
 */
export function useTrackModuleEditor({
  updateState,
  showSuccess,
  showError,
  updateSectionInState,
}: UseTrackModuleEditorDeps) {
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
          throw new Error(
            data.message || "트랙 정보 업데이트에 실패했습니다"
          );
        }

        updateSectionInState(sectionId, data.data);
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
    [updateState, showSuccess, showError, updateSectionInState]
  );

  const updateModules = useCallback(
    async (
      sectionId: string,
      modules: ModuleDetailData[]
    ): Promise<boolean> => {
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

        updateSectionInState(sectionId, data.data);
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
    [updateState, showSuccess, showError, updateSectionInState]
  );

  return {
    updateTracks,
    updateModules,
  };
}
