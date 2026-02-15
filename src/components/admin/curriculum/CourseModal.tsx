'use client';

import { useState, useEffect, useRef } from 'react';
import type { CourseData } from '@/lib/validation/curriculum';
import ColorPicker from './ColorPicker';

interface CourseModalProps {
  isOpen: boolean;
  isEditing: boolean;
  semester?: { year: number; term: number };
  course?: CourseData;
  onClose: () => void;
  onSubmit: (data: CourseData, year: number, term: number) => void;
}

export default function CourseModal({
  isOpen,
  isEditing,
  semester,
  course,
  onClose,
  onSubmit,
}: CourseModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ff5f5aff');
  const [classification, setClassification] = useState<'required' | 'elective'>('elective');
  const [year, setYear] = useState(1);
  const [term, setTerm] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && course) {
        setName(course.name);
        setColor(course.color);
        setClassification(course.classification);
      } else {
        setName('');
        setColor('#ff5f5aff');
        setClassification('elective');
      }

      if (semester) {
        setYear(semester.year);
        setTerm(semester.term);
      }

      setErrors({});
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen, isEditing, course, semester]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '과목명을 입력하세요';
    }

    if (!color || !/^#[0-9a-fA-F]{6,8}$/.test(color)) {
      newErrors.color = '올바른 색상을 선택하세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(
      {
        name: name.trim(),
        color,
        classification,
      },
      year,
      term
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? '과목 수정' : '과목 추가'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Semester Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="course-year" className="block text-sm font-medium text-gray-700 mb-1">
                학년
              </label>
              <select
                id="course-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:text-gray-500"
              >
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    {y}학년
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="course-term" className="block text-sm font-medium text-gray-700 mb-1">
                학기
              </label>
              <select
                id="course-term"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                disabled={isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:text-gray-500"
              >
                {[1, 2].map((t) => (
                  <option key={t} value={t}>
                    {t}학기
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Name */}
          <div>
            <label htmlFor="course-name" className="block text-sm font-medium text-gray-700 mb-1">
              과목명
            </label>
            <input
              ref={nameInputRef}
              id="course-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 기초 그래픽 디자인 I"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <ColorPicker
              value={color}
              onChange={setColor}
              label="Color"
            />
            {errors.color && (
              <p className="mt-1 text-xs text-red-600">{errors.color}</p>
            )}
          </div>

          {/* Classification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분류
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classification"
                  value="required"
                  checked={classification === 'required'}
                  onChange={() => setClassification('required')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">필수</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classification"
                  value="elective"
                  checked={classification === 'elective'}
                  onChange={() => setClassification('elective')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">선택</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {isEditing ? '저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
