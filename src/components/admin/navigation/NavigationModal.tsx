'use client';

import { useState, useEffect, useCallback } from 'react';
import type { NavigationItem, CreateNavigationInput, UpdateNavigationInput } from '@/hooks/useNavigationEditor';

interface NavigationModalProps {
  isOpen: boolean;
  item?: NavigationItem | null;
  allItems: NavigationItem[];
  onClose: () => void;
  onSubmit: (data: CreateNavigationInput | UpdateNavigationInput) => void | Promise<void>;
}

export default function NavigationModal({
  isOpen,
  item,
  allItems,
  onClose,
  onSubmit,
}: NavigationModalProps) {
  const isEditing = !!item;

  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ label?: string; href?: string }>({});

  // Reset form when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setLabel(item.label);
        setHref(item.href);
        setParentId(item.parentId ?? '');
      } else {
        setLabel('');
        setHref('');
        setParentId('');
      }
      setErrors({});
    }
  }, [isOpen, item]);

  // Esc key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const validate = (): boolean => {
    const newErrors: { label?: string; href?: string } = {};
    if (!label.trim()) newErrors.label = '메뉴 이름은 필수입니다';
    if (!href.trim()) newErrors.href = 'Href는 필수입니다';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateNavigationInput | UpdateNavigationInput = {
        label: label.trim(),
        href: href.trim(),
        ...(parentId ? { parentId } : { parentId: undefined }),
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show parent options that are not the current item itself
  const parentOptions = allItems.filter((nav) => nav.id !== item?.id && !nav.parentId);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="navigation-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2
          id="navigation-modal-title"
          className="text-lg font-semibold text-gray-900 mb-5"
        >
          {isEditing ? '메뉴 수정' : '메뉴 추가'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Label */}
          <div className="mb-4">
            <label
              htmlFor="nav-label"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              메뉴 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="nav-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="예: About"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.label ? 'border-red-500' : 'border-gray-300'
              }`}
              data-testid="navigation-modal-label-input"
              disabled={isSubmitting}
            />
            {errors.label && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {errors.label}
              </p>
            )}
          </div>

          {/* Href */}
          <div className="mb-4">
            <label
              htmlFor="nav-href"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Href <span className="text-red-500">*</span>
            </label>
            <input
              id="nav-href"
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="예: /about"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.href ? 'border-red-500' : 'border-gray-300'
              }`}
              data-testid="navigation-modal-href-input"
              disabled={isSubmitting}
            />
            {errors.href && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {errors.href}
              </p>
            )}
          </div>

          {/* Parent (optional) */}
          {parentOptions.length > 0 && (
            <div className="mb-6">
              <label
                htmlFor="nav-parent"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                상위 메뉴 (선택사항)
              </label>
              <select
                id="nav-parent"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="navigation-modal-parent-select"
                disabled={isSubmitting}
              >
                <option value="">없음 (최상위 메뉴)</option>
                {parentOptions.map((nav) => (
                  <option key={nav.id} value={nav.id}>
                    {nav.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="navigation-modal-cancel-btn"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="navigation-modal-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
