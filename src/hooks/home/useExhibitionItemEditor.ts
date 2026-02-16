"use client";

import { useCallback } from "react";
import type { Section } from "./types";

/**
 * Exhibition item CRUD + reorder operations for the home page editor.
 */
export function useExhibitionItemEditor(
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
) {
  const addExhibitionItem = useCallback(
    async (sectionId: string, data: { year: string; mediaId: string }) => {
      try {
        const response = await fetch("/api/admin/exhibition-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId, ...data }),
          credentials: "include",
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  exhibitionItems: [...(s.exhibitionItems || []), result.data],
                }
              : s
          )
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("전시 아이템 추가 실패");
      }
    },
    [setSections]
  );

  const updateExhibitionItem = useCallback(
    async (itemId: string, data: { year: string; mediaId: string }) => {
      try {
        const response = await fetch("/api/admin/exhibition-items", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, ...data }),
          credentials: "include",
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            exhibitionItems: (s.exhibitionItems || []).map((e) =>
              e.id === itemId ? result.data : e
            ),
          }))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("전시 아이템 수정 실패");
      }
    },
    [setSections]
  );

  const deleteExhibitionItem = useCallback(
    async (itemId: string) => {
      try {
        const response = await fetch(
          `/api/admin/exhibition-items?id=${itemId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message);
        }

        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            exhibitionItems: (s.exhibitionItems || []).filter(
              (e) => e.id !== itemId
            ),
          }))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("전시 아이템 삭제 실패");
      }
    },
    [setSections]
  );

  const reorderExhibitionItem = useCallback(
    async (itemId: string, direction: "up" | "down", sectionId: string) => {
      try {
        const section = sections.find((s) => s.id === sectionId);
        if (!section?.exhibitionItems) return;

        const currentIndex = section.exhibitionItems.findIndex(
          (e) => e.id === itemId
        );
        if (currentIndex === -1) return;

        const newIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= section.exhibitionItems.length) return;

        const currentItem = section.exhibitionItems[currentIndex];
        const targetItem = section.exhibitionItems[newIndex];

        const response = await fetch(`/api/admin/exhibition-items/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: currentItem.id,
            newOrder: targetItem.order,
          }),
          credentials: "include",
        });

        if (!response.ok) throw new Error("순서 변경 실패");

        setSections((prev) =>
          prev.map((s) => {
            if (s.id !== sectionId) return s;
            if (!s.exhibitionItems) return s;

            const items = [...s.exhibitionItems];
            [items[currentIndex], items[newIndex]] = [
              items[newIndex],
              items[currentIndex],
            ];

            return { ...s, exhibitionItems: items };
          })
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("순서 변경 실패");
      }
    },
    [sections, setSections]
  );

  return {
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
  };
}
