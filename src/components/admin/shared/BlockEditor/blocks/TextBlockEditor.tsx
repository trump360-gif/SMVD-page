'use client';

import React from 'react';
import type { TextBlock } from '../types';

interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (data: Partial<TextBlock>) => void;
}

/**
 * Text block editor.
 * Edits markdown content and styling for right column (description text).
 */
export default function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  const fontSize = block.fontSize ?? 18;
  const fontWeight = block.fontWeight ?? '400';
  const color = block.color ?? '#1b1d1f';
  const lineHeight = block.lineHeight ?? 1.8;

  return (
    <div className="space-y-4">
      {/* Content Section */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Content</h3>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Text Content (Markdown supported)
          </label>
          <textarea
            value={block.content}
            onChange={(e) => onChange({ content: e.target.value })}
            placeholder="Enter text content... Markdown syntax is supported."
            rows={8}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
          />
        </div>
      </div>

      {/* Styling Section */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Text Styling</h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Font Size
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="48"
                value={fontSize}
                onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Font Weight
            </label>
            <select
              value={fontWeight}
              onChange={(e) => onChange({ fontWeight: e.target.value as '400' | '500' | '700' })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => onChange({ color: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Line Height
            </label>
            <input
              type="number"
              min="1"
              max="3"
              step="0.1"
              value={lineHeight}
              onChange={(e) => onChange({ lineHeight: parseFloat(e.target.value) })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Live preview */}
      {block.content && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Live Preview
          </p>
          <div
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
              color: color,
              lineHeight: `${lineHeight}`,
              fontFamily: 'Pretendard, sans-serif',
            }}
          >
            {block.content.substring(0, 100)}{block.content.length > 100 ? '...' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
