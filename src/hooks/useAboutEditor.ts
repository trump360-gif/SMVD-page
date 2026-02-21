'use client';

import { useState, useCallback } from 'react';
import { useDirtyState } from './useDirtyState';
import { deepEqual } from '@/lib/diffUtils';

interface AboutIntro {
  title: string;
  description: string;
  imageSrc?: string;
}

interface AboutVision {
  title: string;
  content: string;
  chips: string[];
}

interface TimelineItem {
  year: string;
  description: string;
}

interface AboutHistory {
  title: string;
  introText: string;
  timelineItems: TimelineItem[];
}

interface Professor {
  id: string;
  name: string;
  title: string;
}

interface AboutPeople {
  professors?: Professor[];
  instructors?: Professor[];
}

export interface AboutSection {
  id: string;
  pageId: string;
  type: string;
  title?: string | null;
  content: AboutIntro | AboutVision | AboutHistory | AboutPeople | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AboutPerson {
  id: string;
  name: string;
  title: string;
  role?: string;
  office?: string;
  email: string[];
  phone?: string;
  major?: string;
  specialty?: string;
  badge?: string;
  profileImage?: string;
  courses?: {
    undergraduate: string[];
    graduate: string[];
  };
  biography?: {
    cvText?: string;
    position?: string;
    education: string[];
    experience: string[];
  };
  order: number;
}

let tempIdCounter = 0;

export function useAboutEditor() {
  // ---- Sections: dirty state ----
  const {
    localState: sections,
    setLocalState: setSections,
    snapshot: sectionsSnapshot,
    isDirty: sectionsDirty,
    changeCount: sectionsChangeCount,
    resetSnapshot: resetSectionsSnapshot,
    revert: revertSections,
  } = useDirtyState<AboutSection[]>([]);

  // ---- People: dirty state (converted from immediate save) ----
  const {
    localState: people,
    setLocalState: setPeople,
    snapshot: peopleSnapshot,
    isDirty: peopleDirty,
    changeCount: peopleChangeCount,
    resetSnapshot: resetPeopleSnapshot,
    revert: revertPeople,
  } = useDirtyState<AboutPerson[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = sectionsDirty || peopleDirty;
  const changeCount = sectionsChangeCount + peopleChangeCount;

  const revert = useCallback(() => {
    revertSections();
    revertPeople();
  }, [revertSections, revertPeople]);

  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/about/sections', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch sections');
      const data = await res.json();
      resetSectionsSnapshot(data.sections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [resetSectionsSnapshot]);

  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/about/people', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch people');
      const data = await res.json();
      resetPeopleSnapshot(data.people || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [resetPeopleSnapshot]);

  /** Local-only: update section title and content */
  const updateSectionLocal = useCallback(
    (sectionId: string, title: string, content: Record<string, unknown>) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, title, content: content as AboutSection['content'] }
            : s,
        ),
      );
    },
    [setSections],
  );

  /** Local-only: reorder sections */
  const reorderSections = useCallback((sectionId: string, newOrder: number) => {
    setSections((prev) => {
      const items = [...prev];
      const idx = items.findIndex((s) => s.id === sectionId);
      if (idx === -1) return prev;
      const [moved] = items.splice(idx, 1);
      items.splice(newOrder, 0, moved);
      return items.map((item, i) => ({ ...item, order: i }));
    });
  }, [setSections]);

  // ---- People: local-only mutations ----

  const addPerson = useCallback((personData: Omit<AboutPerson, 'id' | 'order'>) => {
    const tempId = `temp_${Date.now()}_${++tempIdCounter}`;
    const newPerson: AboutPerson = {
      ...personData,
      id: tempId,
      order: 0,
    };
    setPeople((prev) => {
      newPerson.order = prev.length;
      return [...prev, newPerson];
    });
    return newPerson;
  }, [setPeople]);

  const updatePerson = useCallback(
    (personId: string, personData: Partial<AboutPerson>) => {
      setPeople((prev) =>
        prev.map((p) => (p.id === personId ? { ...p, ...personData } : p)),
      );
    },
    [setPeople],
  );

  const deletePerson = useCallback((personId: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== personId));
  }, [setPeople]);

  const reorderPeople = useCallback((personId: string, newOrder: number) => {
    setPeople((prev) => {
      const items = [...prev];
      const idx = items.findIndex((p) => p.id === personId);
      if (idx === -1) return prev;
      const [moved] = items.splice(idx, 1);
      items.splice(newOrder, 0, moved);
      return items.map((item, i) => ({ ...item, order: i }));
    });
  }, [setPeople]);

  // ---- Save all changes (sections + people) ----

  const saveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);

      // --- Sections diff ---
      if (sectionsDirty) {
        const snapshotMap = new Map(sectionsSnapshot.map((s) => [s.id, s]));

        for (const section of sections) {
          const orig = snapshotMap.get(section.id);
          if (!orig) continue;
          if (
            orig.title !== section.title ||
            !deepEqual(orig.content, section.content)
          ) {
            const res = await fetch('/api/admin/about/sections', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sectionId: section.id,
                type: section.type,
                title: section.title,
                content: section.content,
              }),
              credentials: 'include',
            });
            if (!res.ok) throw new Error('섹션 저장 실패');
          }
        }

        // Reorder sections if needed
        for (let i = 0; i < sections.length; i++) {
          const orig = snapshotMap.get(sections[i].id);
          if (orig && orig.order !== i) {
            await fetch('/api/admin/about/reorder', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sectionId: sections[i].id, newOrder: i }),
              credentials: 'include',
            });
          }
        }
      }

      // --- People diff ---
      if (peopleDirty) {
        await syncPeople(peopleSnapshot, people);
      }

      // Re-fetch to sync snapshots
      await Promise.all([fetchSections(), fetchPeople()]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '저장 실패';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsSaving(false);
    }
  }, [
    sections, sectionsSnapshot, sectionsDirty,
    people, peopleSnapshot, peopleDirty,
    fetchSections, fetchPeople,
  ]);

  return {
    sections,
    people,
    isDirty,
    changeCount,
    sectionsDirty,
    sectionsChangeCount,
    peopleDirty,
    peopleChangeCount,
    isLoading,
    isSaving,
    error,
    fetchSections,
    updateSectionLocal,
    reorderSections,
    revertSections,
    fetchPeople,
    addPerson,
    updatePerson,
    deletePerson,
    reorderPeople,
    revertPeople,
    saveChanges,
    revert,
  };
}

// ---- Helpers for saveChanges ----

async function syncPeople(
  snapItems: AboutPerson[],
  localItems: AboutPerson[]
) {
  const localIds = new Set(localItems.map((i) => i.id));
  const snapMap = new Map(snapItems.map((i) => [i.id, i]));

  // 1. Delete
  for (const item of snapItems) {
    if (!localIds.has(item.id)) {
      const res = await fetch(`/api/admin/about/people/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('교수/강사 삭제 실패');
    }
  }

  // 2. Create (temp IDs)
  for (const item of localItems) {
    if (item.id.startsWith('temp_')) {
      const { id: _id, order: _order, ...personData } = item;
      const res = await fetch('/api/admin/about/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('교수/강사 추가 실패');
    }
  }

  // 3. Update
  for (const item of localItems) {
    if (item.id.startsWith('temp_')) continue;
    const orig = snapMap.get(item.id);
    if (!orig) continue;
    if (!deepEqual(orig, item)) {
      const { id: _id, order: _order, ...personData } = item;
      const res = await fetch(`/api/admin/about/people/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('교수/강사 수정 실패');
    }
  }

  // 4. Reorder
  for (let i = 0; i < localItems.length; i++) {
    const item = localItems[i];
    if (item.id.startsWith('temp_')) continue;
    const orig = snapMap.get(item.id);
    if (orig && orig.order !== i) {
      await fetch('/api/admin/about/people/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: item.id, newOrder: i }),
        credentials: 'include',
      });
    }
  }
}
