'use client';

import React from 'react';
import type { DividerBlock } from '../types';

interface DividerBlockEditorProps {
  block: DividerBlock;
  onChange: (data: Partial<DividerBlock>) => void;
}

const STYLE_OPTIONS: { value: NonNullable<DividerBlock['style']>; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

/**
 * Divider block editor with line style selection and visual preview.
 */
export default function DividerBlockEditor({ block, onChange }: DividerBlockEditorProps) {
  const currentStyle = block.style ?? 'solid';

  return (
    <div className="space-y-3">
      {/* Style selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Divider Style
        </label>
        <select
          value={currentStyle}
          onChange={(e) => onChange({ style: e.target.value as DividerBlock['style'] })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          {STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Style preview */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
          Preview
        </p>
        <hr
          className="border-gray-300"
          style={{ borderStyle: currentStyle }}
        />
      </div>
    </div>
  );
}
