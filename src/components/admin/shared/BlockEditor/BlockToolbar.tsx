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
} from 'lucide-react';
import type { BlockType } from './types';

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void;
  /** When true, shows Work-specific block types */
  showWorkBlocks?: boolean;
}

interface BlockOption {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  group?: 'generic' | 'work';
}

const GENERIC_BLOCK_OPTIONS: BlockOption[] = [
  { type: 'text', label: 'Text Block', icon: <Type size={14} />, group: 'generic' },
  { type: 'heading', label: 'Heading Block', icon: <Heading2 size={14} />, group: 'generic' },
  { type: 'image', label: 'Image Block', icon: <ImageIcon size={14} />, group: 'generic' },
  { type: 'gallery', label: 'Gallery Block', icon: <Grid3X3 size={14} />, group: 'generic' },
  { type: 'spacer', label: 'Spacer', icon: <ArrowDownFromLine size={14} />, group: 'generic' },
  { type: 'divider', label: 'Divider', icon: <Minus size={14} />, group: 'generic' },
];

const WORK_BLOCK_OPTIONS: BlockOption[] = [
  { type: 'hero-image', label: 'Hero Image (860px)', icon: <Maximize size={14} />, group: 'work' },
  { type: 'work-title', label: 'Work Title + Author', icon: <Tag size={14} />, group: 'work' },
  { type: 'work-metadata', label: 'Author / Email', icon: <User size={14} />, group: 'work' },
  { type: 'work-gallery', label: 'Work Gallery (Stack)', icon: <Layers size={14} />, group: 'work' },
];

/**
 * Toolbar for adding new blocks to the editor.
 * Dropdown menu with all available block types.
 * When showWorkBlocks is true, also shows Work-specific blocks in a separate section.
 */
export default function BlockToolbar({ onAddBlock, showWorkBlocks = false }: BlockToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
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
        Add Block
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 max-h-80 overflow-y-auto">
          {/* Generic blocks */}
          {GENERIC_BLOCK_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => {
                onAddBlock(opt.type);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}

          {/* Work-specific blocks */}
          {showWorkBlocks && (
            <>
              <div className="border-t border-gray-100 my-1" />
              <div className="px-3 py-1">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  Work Detail
                </span>
              </div>
              {WORK_BLOCK_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => {
                    onAddBlock(opt.type);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
