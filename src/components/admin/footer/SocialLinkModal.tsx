'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '@/types/schemas';
import type { SocialPlatform } from '@/types/schemas';
import type { SocialLinkItem, UpsertSocialLinkInput } from '@/hooks/useFooterEditor';

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  twitter: 'Twitter (X)',
  linkedin: 'LinkedIn',
};

interface SocialLinkModalProps {
  isOpen: boolean;
  editingPlatform: SocialPlatform | null;
  existingLink: SocialLinkItem | null;
  takenPlatforms: SocialPlatform[];
  onClose: () => void;
  onSubmit: (platform: SocialPlatform, input: UpsertSocialLinkInput) => void | Promise<void>;
}

export default function SocialLinkModal({
  isOpen,
  editingPlatform,
  existingLink,
  takenPlatforms,
  onClose,
  onSubmit,
}: SocialLinkModalProps) {
  const isEditing = editingPlatform !== null;

  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [url, setUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ platform?: string; url?: string }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditing && editingPlatform) {
        setPlatform(editingPlatform);
        setUrl(existingLink?.url ?? '');
        setIsActive(existingLink?.isActive ?? true);
      } else {
        // Find first available platform
        const available = SOCIAL_PLATFORMS.find((p) => !takenPlatforms.includes(p));
        setPlatform(available ?? 'instagram');
        setUrl('');
        setIsActive(true);
      }
      setErrors({});
    }
  }, [isOpen, isEditing, editingPlatform, existingLink, takenPlatforms]);

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
    const newErrors: { platform?: string; url?: string } = {};

    if (!isEditing && takenPlatforms.includes(platform)) {
      newErrors.platform = '이미 등록된 플랫폼입니다. 기존 항목을 수정해주세요.';
    }

    if (!url.trim()) {
      newErrors.url = 'URL은 필수입니다';
    } else {
      try {
        new URL(url.trim());
      } catch {
        newErrors.url = '유효한 URL 형식이어야 합니다 (예: https://instagram.com/...)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(platform, { url: url.trim(), isActive });
      onClose();
    } catch {
      // Error is handled by the hook and propagated to parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePlatforms = isEditing
    ? SOCIAL_PLATFORMS
    : SOCIAL_PLATFORMS.filter((p) => !takenPlatforms.includes(p));

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-link-modal-title"
      data-testid="social-link-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="모달 닫기"
          data-testid="social-link-modal-close-btn"
        >
          <X size={18} />
        </button>

        <h2
          id="social-link-modal-title"
          className="text-lg font-semibold text-gray-900 mb-5"
        >
          {isEditing ? 'SNS 링크 수정' : 'SNS 링크 추가'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Platform */}
          <div className="mb-4">
            <label
              htmlFor="social-platform"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              플랫폼 <span className="text-red-500">*</span>
            </label>
            <select
              id="social-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.platform ? 'border-red-500' : 'border-gray-300'
              } ${isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
              data-testid="social-link-platform-select"
              disabled={isSubmitting || isEditing}
            >
              {availablePlatforms.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_LABELS[p]}
                </option>
              ))}
              {isEditing && editingPlatform && (
                <option value={editingPlatform}>{PLATFORM_LABELS[editingPlatform]}</option>
              )}
            </select>
            {errors.platform && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {errors.platform}
              </p>
            )}
          </div>

          {/* URL */}
          <div className="mb-4">
            <label
              htmlFor="social-url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              URL <span className="text-red-500">*</span>
            </label>
            <input
              id="social-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/..."
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.url ? 'border-red-500' : 'border-gray-300'
              }`}
              data-testid="social-link-url-input"
              disabled={isSubmitting}
            />
            {errors.url && (
              <p className="mt-1 text-xs text-red-500" role="alert">
                {errors.url}
              </p>
            )}
          </div>

          {/* Active toggle */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">활성화</span>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                isActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={isActive}
              aria-label="SNS 링크 활성화 토글"
              data-testid="social-link-active-toggle"
              disabled={isSubmitting}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="social-link-modal-cancel-btn"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="social-link-modal-submit-btn"
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
