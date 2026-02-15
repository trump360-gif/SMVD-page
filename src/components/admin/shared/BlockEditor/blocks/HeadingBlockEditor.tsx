'use client';

import React from 'react';
import type { HeadingBlock } from '../types';

interface HeadingBlockEditorProps {
  block: HeadingBlock;
  onChange: (data: Partial<HeadingBlock>) => void;
}

const LEVEL_OPTIONS: { value: HeadingBlock['level']; label: string }[] = [
  { value: 1, label: 'H1 - Large' },
  { value: 2, label: 'H2 - Medium' },
  { value: 3, label: 'H3 - Small' },
];

/**
 * Heading block editor with level selection and text input.
 * Shows a real-time preview of the heading at the selected level.
 */
export default function HeadingBlockEditor({ block, onChange }: HeadingBlockEditorProps) {
  return (
    <div className="space-y-3">
      {/* Level selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Heading Level
        </label>
        <select
          value={block.level}
          onChange={(e) => onChange({ level: Number(e.target.value) as HeadingBlock['level'] })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content input */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Heading Text
        </label>
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Enter heading text..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Live preview */}
      {block.content && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Preview
          </p>
          {block.level === 1 && (
            <h1 className="text-4xl font-bold text-gray-900">{block.content}</h1>
          )}
          {block.level === 2 && (
            <h2 className="text-2xl font-bold text-gray-900">{block.content}</h2>
          )}
          {block.level === 3 && (
            <h3 className="text-xl font-semibold text-gray-900">{block.content}</h3>
          )}
        </div>
      )}
    </div>
  );
}
