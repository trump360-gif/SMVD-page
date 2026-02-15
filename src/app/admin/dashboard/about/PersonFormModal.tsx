'use client';

import { useState, useEffect, useCallback } from 'react';
import { AboutPerson } from '@/hooks/useAboutEditor';

interface PersonFormModalProps {
  isOpen: boolean;
  person: AboutPerson | null;
  onClose: () => void;
  onSubmit: (data: Omit<AboutPerson, 'id' | 'order'>) => Promise<void>;
}

const EMPTY_FORM: Omit<AboutPerson, 'id' | 'order'> = {
  name: '',
  title: '',
  role: 'professor',
  office: '',
  email: [],
  phone: '',
  major: '',
  specialty: '',
  badge: '',
  courses: {
    undergraduate: [],
    graduate: [],
  },
  biography: {
    cvText: '',
    position: '',
    education: [],
    experience: [],
  },
};

export default function PersonFormModal({
  isOpen,
  person,
  onClose,
  onSubmit,
}: PersonFormModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [emailText, setEmailText] = useState('');
  const [undergraduateText, setUndergraduateText] = useState('');
  const [graduateText, setGraduateText] = useState('');
  const [educationText, setEducationText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!person;

  useEffect(() => {
    if (isOpen && person) {
      setForm({
        name: person.name,
        title: person.title,
        role: person.role || 'professor',
        office: person.office || '',
        email: person.email || [],
        phone: person.phone || '',
        major: person.major || '',
        specialty: person.specialty || '',
        badge: person.badge || '',
        courses: person.courses || { undergraduate: [], graduate: [] },
        biography: person.biography || {
          cvText: '',
          position: '',
          education: [],
          experience: [],
        },
      });
      setEmailText((person.email || []).join(', '));
      setUndergraduateText(
        (person.courses?.undergraduate || []).join(', ')
      );
      setGraduateText((person.courses?.graduate || []).join(', '));
      setEducationText(
        (person.biography?.education || []).join('\n')
      );
      setExperienceText(
        (person.biography?.experience || []).join('\n')
      );
    } else if (isOpen && !person) {
      setForm(EMPTY_FORM);
      setEmailText('');
      setUndergraduateText('');
      setGraduateText('');
      setEducationText('');
      setExperienceText('');
    }
  }, [isOpen, person]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.title.trim()) {
      alert('이름과 직함은 필수 입력입니다.');
      return;
    }

    try {
      setIsSaving(true);
      const data: Omit<AboutPerson, 'id' | 'order'> = {
        ...form,
        email: emailText
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean),
        courses: {
          undergraduate: undergraduateText
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
          graduate: graduateText
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
        },
        biography: {
          cvText: form.biography?.cvText || '',
          position: form.biography?.position || '',
          education: educationText
            .split('\n')
            .map((e) => e.trim())
            .filter(Boolean),
          experience: experienceText
            .split('\n')
            .map((e) => e.trim())
            .filter(Boolean),
        },
      };
      await onSubmit(data);
    } catch {
      // Error handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? '교수/강사 수정' : '새로운 교수/강사 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &#215;
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                직함 *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="교수"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                구분
              </label>
              <select
                value={form.role || 'professor'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="professor">교수</option>
                <option value="instructor">강사</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                뱃지
              </label>
              <input
                type="text"
                value={form.badge || ''}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Research & Mentoring"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              연락처 정보
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연구실
                </label>
                <input
                  type="text"
                  value={form.office || ''}
                  onChange={(e) =>
                    setForm({ ...form, office: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="미술대학 711호"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="professor@sookmyung.ac.kr, name@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전화
                </label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="02-710-XXXX"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              학과 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전공
                </label>
                <input
                  type="text"
                  value={form.major || ''}
                  onChange={(e) =>
                    setForm({ ...form, major: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="시각디자인"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전문분야
                </label>
                <input
                  type="text"
                  value={form.specialty || ''}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="UX/UI Design"
                />
              </div>
            </div>
          </div>

          {/* Courses */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              담당과목
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학사과정 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={undergraduateText}
                  onChange={(e) => setUndergraduateText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="기초디자인, 타이포그래피, 편집디자인"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  석사과정 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={graduateText}
                  onChange={(e) => setGraduateText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="디자인연구, 고급편집디자인"
                />
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              약력
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CV 텍스트
                  </label>
                  <input
                    type="text"
                    value={form.biography?.cvText || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        biography: {
                          ...form.biography!,
                          cvText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="CV Download"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    직책
                  </label>
                  <input
                    type="text"
                    value={form.biography?.position || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        biography: {
                          ...form.biography!,
                          position: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="시각영상디자인학과 교수"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학력 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={educationText}
                  onChange={(e) => setEducationText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="숙명여자대학교 시각디자인학과 학사&#10;서울대학교 디자인학과 석사"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  경력 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="2020 - 현재 숙명여자대학교 교수&#10;2015 - 2020 삼성전자 디자인센터"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {isSaving
              ? '저장 중...'
              : isEditing
                ? '수정 저장'
                : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
}
