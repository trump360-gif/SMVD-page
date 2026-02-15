'use client';

import { useState, useEffect, useRef } from 'react';
import type { ThesisCardData } from '@/lib/validation/curriculum';

// ============================================================
// Types
// ============================================================

interface ThesisModalProps {
  isOpen: boolean;
  isEditing?: boolean;
  thesis?: ThesisCardData;
  onClose: () => void;
  onSubmit: (thesis: ThesisCardData) => Promise<void>;
  isSaving?: boolean;
}

// ============================================================
// ThesisModal
// ============================================================

export default function ThesisModal({
  isOpen,
  isEditing,
  thesis,
  onClose,
  onSubmit,
  isSaving,
}: ThesisModalProps) {
  const [category, setCategory] = useState('UX/UI');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const categoryInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when opened
  useEffect(() => {
    if (isOpen) {
      if (isEditing && thesis) {
        setCategory(thesis.category);
        setTitle(thesis.title);
        setDate(thesis.date);
      } else {
        setCategory('UX/UI');
        setTitle('');
        setDate('');
      }
      setErrors({});
      setTimeout(() => categoryInputRef.current?.focus(), 100);
    }
  }, [isOpen, isEditing, thesis]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!title.trim()) {
      newErrors.title = 'Thesis title is required';
    }
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      category: category.trim(),
      title: title.trim(),
      date: date.trim(),
    });
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
            {isEditing ? 'Edit Thesis' : 'Add Thesis'}
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
          {/* Category */}
          <div>
            <label htmlFor="thesis-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              ref={categoryInputRef}
              id="thesis-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. UX/UI"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Thesis Title */}
          <div>
            <label htmlFor="thesis-title" className="block text-sm font-medium text-gray-700 mb-1">
              Thesis Title
            </label>
            <textarea
              id="thesis-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter thesis title"
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm resize-none ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="thesis-date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="thesis-date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 2025. 11"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-400">
              Free text format (e.g. &quot;2025. 11&quot;, &quot;2024. 06.&quot;)
            </p>
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
