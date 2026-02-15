'use client';

import React from 'react';
import type { SpacerBlock } from '../types';

interface SpacerBlockEditorProps {
  block: SpacerBlock;
  onChange: (data: Partial<SpacerBlock>) => void;
}

const HEIGHT_OPTIONS: { value: SpacerBlock['height']; label: string; px: number }[] = [
  { value: 'small', label: 'Small (20px)', px: 20 },
  { value: 'medium', label: 'Medium (40px)', px: 40 },
  { value: 'large', label: 'Large (80px)', px: 80 },
];

/**
 * Spacer block editor with height selection and visual preview.
 */
export default function SpacerBlockEditor({ block, onChange }: SpacerBlockEditorProps) {
  const currentOption = HEIGHT_OPTIONS.find((opt) => opt.value === block.height) ?? HEIGHT_OPTIONS[1];

  return (
    <div className="space-y-3">
      {/* Height selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Spacer Height
        </label>
        <select
          value={block.height}
          onChange={(e) => onChange({ height: e.target.value as SpacerBlock['height'] })}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          {HEIGHT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Height preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider px-3 pt-2">
          Preview ({currentOption.px}px)
        </p>
        <div className="px-3 py-2">
          <div
            className="bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center"
            style={{ height: `${currentOption.px}px` }}
          >
            <span className="text-[10px] text-gray-400">{currentOption.px}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
