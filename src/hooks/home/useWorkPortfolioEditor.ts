"use client";

import { useCallback } from "react";
import type { Section, WorkPortfolio } from "./types";

let tempIdCounter = 0;

/**
 * Work portfolio CRUD operations (local-only).
 * All changes are buffered until saveChanges() is called.
 */
export function useWorkPortfolioEditor(
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
) {
  const addWorkPortfolio = useCallback(
    (
      sectionId: string,
      data: {
        title: string;
        category: string;
        mediaId: string;
        media?: { id: string; filename: string; filepath: string };
      }
    ) => {
      tempIdCounter++;
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          const items = s.workPortfolios || [];
          const maxOrder =
            items.length > 0
              ? Math.max(...items.map((i) => i.order)) + 1
              : 0;
          const tempItem: WorkPortfolio = {
            id: `temp_${Date.now()}_${tempIdCounter}`,
            sectionId,
            title: data.title,
            category: data.category,
            mediaId: data.mediaId,
            order: maxOrder,
            media: data.media,
          };
          return { ...s, workPortfolios: [...items, tempItem] };
        })
      );
    },
    [setSections]
  );

  const updateWorkPortfolio = useCallback(
    (
      workId: string,
      data: {
        title: string;
        category: string;
        mediaId: string;
        media?: { id: string; filename: string; filepath: string };
      }
    ) => {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          workPortfolios: (s.workPortfolios || []).map((w) =>
            w.id === workId
              ? {
                  ...w,
                  title: data.title,
                  category: data.category,
                  mediaId: data.mediaId,
                  media: data.media ?? w.media,
                }
              : w
          ),
        }))
      );
    },
    [setSections]
  );

  const deleteWorkPortfolio = useCallback(
    (workId: string) => {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          workPortfolios: (s.workPortfolios || []).filter(
            (w) => w.id !== workId
          ),
        }))
      );
    },
    [setSections]
  );

  const reorderWorkPortfolio = useCallback(
    (sectionId: string, workId: string, newOrder: number) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId || !s.workPortfolios) return s;
          const items = [...s.workPortfolios];
          const fromIndex = items.findIndex((i) => i.id === workId);
          const toIndex = items.findIndex((i) => i.order === newOrder);
          if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
            return s;
          const [moved] = items.splice(fromIndex, 1);
          items.splice(toIndex, 0, moved);
          return {
            ...s,
            workPortfolios: items.map((item, idx) => ({
              ...item,
              order: idx,
            })),
          };
        })
      );
    },
    [setSections]
  );

  return {
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
  };
}
