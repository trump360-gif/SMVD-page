"use client";

import { useState, useCallback } from "react";
import { useDirtyState } from "../useDirtyState";
import { deepEqual } from "@/lib/diffUtils";
import type { Section } from "./types";
import { useExhibitionItemEditor } from "./useExhibitionItemEditor";
import { useWorkPortfolioEditor } from "./useWorkPortfolioEditor";

export type { Section, ExhibitionItem, WorkPortfolio } from "./types";

/**
 * Main home page editor hook.
 * Uses useDirtyState for snapshot/local state tracking.
 * All sub-hook operations are local-only until saveChanges() is called.
 */
export function useHomeEditor(initialSections: Section[] = []) {
  const {
    localState: sections,
    setLocalState: setSections,
    snapshot: sectionsSnapshot,
    isDirty,
    changeCount,
    resetSnapshot,
    revert,
  } = useDirtyState<Section[]>(initialSections);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(
    async (pageId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `/api/admin/sections?pageId=${pageId}`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          resetSnapshot(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "섹션 조회 실패");
      } finally {
        setIsLoading(false);
      }
    },
    [resetSnapshot]
  );

  // Local-only: update About section content
  const updateAboutSectionLocal = useCallback(
    (sectionId: string, content: Record<string, unknown>) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, content } : s
        )
      );
    },
    [setSections]
  );

  // Compose sub-hooks (all local-only)
  const {
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
  } = useExhibitionItemEditor(sections, setSections);

  const {
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
  } = useWorkPortfolioEditor(sections, setSections);

  // Persist all changes to server
  const saveChanges = useCallback(
    async (pageId: string) => {
      try {
        setIsSaving(true);
        setError(null);

        for (const section of sections) {
          const snapSection = sectionsSnapshot.find(
            (s) => s.id === section.id
          );
          if (!snapSection) continue;

          // --- About section content ---
          if (
            section.type === "HOME_ABOUT" &&
            !deepEqual(section.content, snapSection.content)
          ) {
            const res = await fetch(
              `/api/admin/sections/${section.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: section.content }),
                credentials: "include",
              }
            );
            if (!res.ok) throw new Error("소개 섹션 저장 실패");
          }

          // --- Exhibition items ---
          await syncItems(
            "exhibition-items",
            section.id,
            snapSection.exhibitionItems || [],
            section.exhibitionItems || []
          );

          // --- Work portfolios ---
          await syncWorkItems(
            "work-portfolios",
            section.id,
            snapSection.workPortfolios || [],
            section.workPortfolios || []
          );
        }

        // Re-fetch to sync snapshot with server state
        await fetchSections(pageId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "저장 실패";
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsSaving(false);
      }
    },
    [sections, sectionsSnapshot, fetchSections]
  );

  return {
    sections,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    fetchSections,
    updateAboutSectionLocal,
    addExhibitionItem,
    updateExhibitionItem,
    deleteExhibitionItem,
    reorderExhibitionItem,
    addWorkPortfolio,
    updateWorkPortfolio,
    deleteWorkPortfolio,
    reorderWorkPortfolio,
    saveChanges,
    revert,
  };
}

// ---- Helpers for saveChanges ----

interface ExhibitionLike {
  id: string;
  year: string;
  mediaId: string;
  order: number;
}

interface WorkLike {
  id: string;
  title: string;
  category: string;
  mediaId: string;
  order: number;
}

async function syncItems(
  apiBase: string,
  sectionId: string,
  snapItems: ExhibitionLike[],
  localItems: ExhibitionLike[]
) {
  const localIds = new Set(localItems.map((i) => i.id));

  // 1. Delete: in snapshot but not in local
  for (const item of snapItems) {
    if (!localIds.has(item.id)) {
      await fetch(`/api/admin/${apiBase}?id=${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }
  }

  // 2. Create: temp IDs
  const tempIdMap = new Map<string, string>();
  for (const item of localItems) {
    if (item.id.startsWith("temp_")) {
      const res = await fetch(`/api/admin/${apiBase}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          year: item.year,
          mediaId: item.mediaId,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("아이템 추가 실패");
      const data = await res.json();
      tempIdMap.set(item.id, data.data.id);
    }
  }

  // 3. Update: non-temp items with changed fields
  const snapMap = new Map(snapItems.map((i) => [i.id, i]));
  for (const item of localItems) {
    if (item.id.startsWith("temp_")) continue;
    const snapItem = snapMap.get(item.id);
    if (!snapItem) continue;
    if (
      snapItem.year !== item.year ||
      snapItem.mediaId !== item.mediaId
    ) {
      const res = await fetch(`/api/admin/${apiBase}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          year: item.year,
          mediaId: item.mediaId,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("아이템 수정 실패");
    }
  }

  // 4. Reorder: send order for items whose position changed
  const snapOrder = snapItems
    .filter((i) => localIds.has(i.id))
    .map((i) => i.id);
  const localOrder = localItems.map((i) =>
    i.id.startsWith("temp_") ? tempIdMap.get(i.id) || i.id : i.id
  );
  const orderChanged =
    snapOrder.length !== localOrder.length ||
    snapOrder.some((id, idx) => id !== localOrder[idx]);
  if (orderChanged && localOrder.length > 0) {
    for (let i = 0; i < localOrder.length; i++) {
      const itemId = localOrder[i];
      if (!itemId) continue;
      await fetch(`/api/admin/${apiBase}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, newOrder: i }),
        credentials: "include",
      });
    }
  }
}

async function syncWorkItems(
  apiBase: string,
  sectionId: string,
  snapItems: WorkLike[],
  localItems: WorkLike[]
) {
  const localIds = new Set(localItems.map((i) => i.id));

  // 1. Delete
  for (const item of snapItems) {
    if (!localIds.has(item.id)) {
      await fetch(`/api/admin/${apiBase}?id=${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }
  }

  // 2. Create (temp IDs)
  const tempIdMap = new Map<string, string>();
  for (const item of localItems) {
    if (item.id.startsWith("temp_")) {
      const res = await fetch(`/api/admin/${apiBase}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          title: item.title,
          category: item.category,
          mediaId: item.mediaId,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("작품 추가 실패");
      const data = await res.json();
      tempIdMap.set(item.id, data.data.id);
    }
  }

  // 3. Update
  const snapMap = new Map(snapItems.map((i) => [i.id, i]));
  for (const item of localItems) {
    if (item.id.startsWith("temp_")) continue;
    const snapItem = snapMap.get(item.id);
    if (!snapItem) continue;
    if (
      snapItem.title !== item.title ||
      snapItem.category !== item.category ||
      snapItem.mediaId !== item.mediaId
    ) {
      const res = await fetch(`/api/admin/${apiBase}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          title: item.title,
          category: item.category,
          mediaId: item.mediaId,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("작품 수정 실패");
    }
  }

  // 4. Reorder
  const snapOrder = snapItems
    .filter((i) => localIds.has(i.id))
    .map((i) => i.id);
  const localOrder = localItems.map((i) =>
    i.id.startsWith("temp_") ? tempIdMap.get(i.id) || i.id : i.id
  );
  const orderChanged =
    snapOrder.length !== localOrder.length ||
    snapOrder.some((id, idx) => id !== localOrder[idx]);
  if (orderChanged && localOrder.length > 0) {
    for (let i = 0; i < localOrder.length; i++) {
      const itemId = localOrder[i];
      if (!itemId) continue;
      await fetch(`/api/admin/${apiBase}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, newOrder: i }),
        credentials: "include",
      });
    }
  }
}
