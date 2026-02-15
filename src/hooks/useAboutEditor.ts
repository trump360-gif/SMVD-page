'use client';

import { useState, useCallback } from 'react';

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
  text: string;
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

export function useAboutEditor() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [people, setPeople] = useState<AboutPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // About 섹션 조회
  const fetchSections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/about/sections', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch sections');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 모든 교수/강사 조회
  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/about/people', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch people');
      const data = await res.json();
      setPeople(data.people || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 섹션 수정
  const updateSection = useCallback(
    async (sectionId: string, type: string, title: string, content: any) => {
      try {
        setError(null);
        const res = await fetch('/api/admin/about/sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionId, type, title, content }),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to update section');
        const data = await res.json();
        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? data.section : s))
        );
        return data.section;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      }
    },
    []
  );

  // 교수 추가
  const addPerson = useCallback(async (personData: Omit<AboutPerson, 'id' | 'order'>) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/about/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personData),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to add person');
      const data = await res.json();
      setPeople((prev) => [...prev, data.person]);
      return data.person;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  // 교수 수정
  const updatePerson = useCallback(
    async (personId: string, personData: Partial<AboutPerson>) => {
      try {
        setError(null);
        const res = await fetch(`/api/admin/about/people/${personId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(personData),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to update person');
        const data = await res.json();
        setPeople((prev) =>
          prev.map((p) => (p.id === personId ? data.person : p))
        );
        return data.person;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      }
    },
    []
  );

  // 교수 삭제
  const deletePerson = useCallback(async (personId: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/admin/about/people/${personId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete person');
      setPeople((prev) => prev.filter((p) => p.id !== personId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  // 섹션 순서 변경
  const reorderSections = useCallback(async (sectionId: string, newOrder: number) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/about/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, newOrder }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to reorder sections');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  // 교수 순서 변경
  const reorderPeople = useCallback(async (personId: string, newOrder: number) => {
    try {
      setError(null);
      const res = await fetch('/api/admin/about/people/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId, newOrder }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to reorder people');
      const data = await res.json();
      setPeople(data.people || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  return {
    sections,
    people,
    isLoading,
    error,
    fetchSections,
    fetchPeople,
    updateSection,
    addPerson,
    updatePerson,
    deletePerson,
    reorderSections,
    reorderPeople,
  };
}
