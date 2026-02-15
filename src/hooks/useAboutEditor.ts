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

      // ABOUT_PEOPLE 섹션도 함께 업데이트
      await syncPeopleSection();

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

        // ABOUT_PEOPLE 섹션도 함께 업데이트
        await syncPeopleSection();

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

      // ABOUT_PEOPLE 섹션도 함께 업데이트
      await syncPeopleSection();
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

      // ABOUT_PEOPLE 섹션도 함께 업데이트
      await syncPeopleSection();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  }, []);

  // ABOUT_PEOPLE 섹션 동기화 (People 테이블 변경 시 호출)
  const syncPeopleSection = useCallback(async () => {
    try {
      // 최신 people 데이터 조회
      const peopleRes = await fetch('/api/admin/about/people', {
        credentials: 'include',
      });
      if (!peopleRes.ok) throw new Error('Failed to fetch people');
      const peopleData = await peopleRes.json();
      const allPeople = peopleData.people || [];

      // 교수와 강사 분리
      const professors = allPeople.filter(
        (p: AboutPerson) => p.role === 'professor' || !p.role
      );
      const instructors = allPeople.filter(
        (p: AboutPerson) => p.role === 'instructor'
      );

      // ABOUT_PEOPLE 섹션 찾기
      const peopleSection = sections.find((s) => s.type === 'ABOUT_PEOPLE');
      if (!peopleSection) return;

      // 섹션 업데이트
      await fetch('/api/admin/about/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: peopleSection.id,
          type: 'ABOUT_PEOPLE',
          title: null,
          content: {
            professors,
            instructors,
          },
        }),
        credentials: 'include',
      });

      // 로컬 sections 상태 업데이트
      setSections((prev) =>
        prev.map((s) =>
          s.id === peopleSection.id
            ? {
                ...s,
                content: {
                  professors,
                  instructors,
                },
              }
            : s
        )
      );
    } catch (err) {
      console.error('Failed to sync people section:', err);
    }
  }, [sections]);

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
