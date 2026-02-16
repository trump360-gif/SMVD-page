"use client";

import { useCallback } from "react";
import type { Section } from "./types";

/**
 * Work portfolio CRUD + reorder operations for the home page editor.
 */
export function useWorkPortfolioEditor(
  sections: Section[],
  setSections: React.Dispatch<React.SetStateAction<Section[]>>
) {
  const addWorkPortfolio = useCallback(
    async (
      sectionId: string,
      data: { title: string; category: string; mediaId: string }
    ) => {
      try {
        const response = await fetch("/api/admin/work-portfolios", {
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
                  workPortfolios: [...(s.workPortfolios || []), result.data],
                }
              : s
          )
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("작품 추가 실패");
      }
    },
    [setSections]
  );

  const updateWorkPortfolio = useCallback(
    async (
      workId: string,
      data: { title: string; category: string; mediaId: string }
    ) => {
      try {
        const response = await fetch("/api/admin/work-portfolios", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: workId, ...data }),
          credentials: "include",
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        setSections((prev) =>
          prev.map((s) => ({
            ...s,
            workPortfolios: (s.workPortfolios || []).map((w) =>
              w.id === workId ? result.data : w
            ),
          }))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("작품 수정 실패");
      }
    },
    [setSections]
  );

  const deleteWorkPortfolio = useCallback(
    async (workId: string) => {
      try {
        const response = await fetch(
          `/api/admin/work-portfolios?id=${workId}`,
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
            workPortfolios: (s.workPortfolios || []).filter(
              (w) => w.id !== workId
            ),
          }))
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("작품 삭제 실패");
      }
    },
    [setSections]
  );

  const reorderWorkPortfolio = useCallback(
    async (workId: string, direction: "up" | "down", sectionId: string) => {
      try {
        const section = sections.find((s) => s.id === sectionId);
        if (!section?.workPortfolios) return;

        const currentIndex = section.workPortfolios.findIndex(
          (w) => w.id === workId
        );
        if (currentIndex === -1) return;

        const newIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= section.workPortfolios.length) return;

        const currentItem = section.workPortfolios[currentIndex];
        const targetItem = section.workPortfolios[newIndex];

        const response = await fetch(`/api/admin/work-portfolios/reorder`, {
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
            if (!s.workPortfolios) return s;

            const items = [...s.workPortfolios];
            [items[currentIndex], items[newIndex]] = [
              items[newIndex],
              items[currentIndex],
            ];

            return { ...s, workPortfolios: items };
          })
        );
      } catch (err) {
        throw err instanceof Error ? err : new Error("순서 변경 실패");
      }
    },
    [sections, setSections]
  );

  return {
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
  };
}
