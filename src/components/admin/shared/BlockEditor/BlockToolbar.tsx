'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Type,
  ImageIcon,
  Heading2,
  Grid3X3,
  ArrowDownFromLine,
  Minus,
  Plus,
  Maximize,
  Tag,
  User,
  Layers,
  Columns3,
  LayoutGrid,
} from 'lucide-react';
import type { BlockType } from './types';

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void;
  /** When true, shows Work-specific block types */
  showWorkBlocks?: boolean;
  /** When true, dropdown menu is initially open */
  initialOpen?: boolean;
}

interface BlockOption {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  group?: 'generic' | 'work';
}

const GENERIC_BLOCK_OPTIONS: BlockOption[] = [
  { type: 'text', label: '텍스트', icon: <Type size={14} />, group: 'generic' },
  { type: 'heading', label: '제목', icon: <Heading2 size={14} />, group: 'generic' },
  { type: 'image', label: '이미지', icon: <ImageIcon size={14} />, group: 'generic' },
  { type: 'gallery', label: '갤러리', icon: <Grid3X3 size={14} />, group: 'generic' },
  { type: 'spacer', label: '여백', icon: <ArrowDownFromLine size={14} />, group: 'generic' },
  { type: 'divider', label: '구분선', icon: <Minus size={14} />, group: 'generic' },
  { type: 'layout-row', label: '행 레이아웃 (2-3열)', icon: <Columns3 size={14} />, group: 'generic' },
  { type: 'layout-grid', label: '그리드 레이아웃', icon: <LayoutGrid size={14} />, group: 'generic' },
  { type: 'image-row', label: '이미지 행 (1-3)', icon: <Columns3 size={14} />, group: 'generic' },
  { type: 'image-grid', label: '이미지 그리드', icon: <LayoutGrid size={14} />, group: 'generic' },
];

const WORK_BLOCK_OPTIONS: BlockOption[] = [
  { type: 'hero-image', label: '히어로 이미지 (860px)', icon: <Maximize size={14} />, group: 'work' },
  { type: 'hero-section', label: '히어로 섹션 (이미지 + 텍스트)', icon: <Maximize size={14} />, group: 'work' },
  { type: 'work-title', label: '작품명 + 작가', icon: <Tag size={14} />, group: 'work' },
  { type: 'work-metadata', label: '작가 / 이메일', icon: <User size={14} />, group: 'work' },
  { type: 'work-layout-config', label: '레이아웃 설정', icon: <Grid3X3 size={14} />, group: 'work' },
];

/**
 * Toolbar for adding new blocks to the editor.
 * Dropdown menu with all available block types.
 * When showWorkBlocks is true, also shows Work-specific blocks in a separate section.
 */
export default function BlockToolbar({ onAddBlock, showWorkBlocks = false, initialOpen = false }: BlockToolbarProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative py-3 px-1" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-colors"
      >
        <Plus size={14} />
        블록 추가
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 max-h-96 overflow-y-auto">
          {/* Generic blocks - 3 column grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {GENERIC_BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  onAddBlock(opt.type);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center gap-1 px-2 py-2 text-[10px] text-gray-700 hover:bg-blue-50 hover:text-blue-900 border border-gray-200 rounded-md transition-colors"
              >
                {opt.icon}
                <span className="text-center line-clamp-2">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Work-specific blocks */}
          {showWorkBlocks && (
            <>
              <div className="border-t border-gray-200 my-2 pt-2">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-2">
                  작품 상세
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {WORK_BLOCK_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        onAddBlock(opt.type);
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center gap-1 px-2 py-2 text-[10px] text-blue-700 hover:bg-blue-50 hover:text-blue-900 border border-blue-200 rounded-md transition-colors"
                    >
                      {opt.icon}
                      <span className="text-center line-clamp-2">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
