"use client";

import { useCallback } from "react";
import type { Section, ExhibitionItem } from "./types";

let tempIdCounter = 0;

/**
 * Exhibition item CRUD operations (local-only).
 * All changes are buffered until saveChanges() is called.
 */
export function useExhibitionItemEditor(
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
) {
  const addExhibitionItem = useCallback(
    (
      sectionId: string,
      data: {
        year: string;
        mediaId: string;
        media?: { id: string; filename: string; filepath: string };
      }
    ) => {
      tempIdCounter++;
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId) return s;
          const items = s.exhibitionItems || [];
          const maxOrder =
            items.length > 0
              ? Math.max(...items.map((i) => i.order)) + 1
              : 0;
          const tempItem: ExhibitionItem = {
            id: `temp_${Date.now()}_${tempIdCounter}`,
            sectionId,
            year: data.year,
            mediaId: data.mediaId,
            order: maxOrder,
            media: data.media,
          };
          return { ...s, exhibitionItems: [...items, tempItem] };
        })
      );
    },
    [setSections]
  );

  const updateExhibitionItem = useCallback(
    (
      itemId: string,
      data: {
        year: string;
        mediaId: string;
        media?: { id: string; filename: string; filepath: string };
      }
    ) => {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          exhibitionItems: (s.exhibitionItems || []).map((e) =>
            e.id === itemId
              ? {
                  ...e,
                  year: data.year,
                  mediaId: data.mediaId,
                  media: data.media ?? e.media,
                }
              : e
          ),
        }))
      );
    },
    [setSections]
  );

  const deleteExhibitionItem = useCallback(
    (itemId: string) => {
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          exhibitionItems: (s.exhibitionItems || []).filter(
            (e) => e.id !== itemId
          ),
        }))
      );
    },
    [setSections]
  );

  const reorderExhibitionItem = useCallback(
    (sectionId: string, itemId: string, newOrder: number) => {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== sectionId || !s.exhibitionItems) return s;
          const items = [...s.exhibitionItems];
          const fromIndex = items.findIndex((i) => i.id === itemId);
          const toIndex = items.findIndex((i) => i.order === newOrder);
          if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
            return s;
          const [moved] = items.splice(fromIndex, 1);
          items.splice(toIndex, 0, moved);
          return {
            ...s,
            exhibitionItems: items.map((item, idx) => ({
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
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
  };
}
