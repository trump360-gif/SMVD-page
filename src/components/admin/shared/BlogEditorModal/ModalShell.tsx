'use client';

import React, { useEffect, useCallback, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Tab {
  key: string;
  label: string;
}

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;

  /** Modal title (e.g., "Edit Portfolio" or "New Article") */
  title: string;
  /** Subtitle shown below title */
  subtitle: string;

  /** Tab definitions */
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;

  /** Error message (shown below tabs) */
  error: string | null;
  onClearError: () => void;

  /** Footer info text (e.g., "3 content blocks") */
  footerInfo: string;

  /** Submit button text and state */
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: () => void;

  /** Additional keyboard handler for undo/redo etc. */
  onKeyDown?: (e: KeyboardEvent) => void;

  /** Content to render (tab content) */
  children: ReactNode;
}

/**
 * Shared modal shell for Blog/News/Work editor modals.
 * Handles: overlay, escape key, scroll lock, header, tabs, error, footer.
 */
export default function ModalShell({
  isOpen,
  onClose,
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  error,
  onClearError,
  footerInfo,
  submitLabel,
  isSubmitting,
  onSubmit,
  onKeyDown,
  children,
}: ModalShellProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard: Escape + optional custom handler (undo/redo)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      onKeyDown?.(e);
    },
    [onClose, onKeyDown]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl flex flex-col"
        style={{
          width: 'calc(100vw - 60px)',
          maxWidth: '1600px',
          height: 'calc(100vh - 60px)',
          maxHeight: '960px',
        }}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-gray-200 px-6 flex gap-0 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden p-0">
          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={onClearError}
                className="text-red-400 hover:text-red-600 ml-2"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 bg-gray-50 rounded-b-xl">
          <div className="text-xs text-gray-400">{footerInfo}</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
