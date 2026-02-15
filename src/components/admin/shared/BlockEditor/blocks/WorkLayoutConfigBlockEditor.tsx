'use client';

import React from 'react';
import type { WorkLayoutConfigBlock } from '../types';

interface WorkLayoutConfigBlockEditorProps {
  block: WorkLayoutConfigBlock;
  onChange: (data: Partial<WorkLayoutConfigBlock>) => void;
}

/**
 * Work layout configuration editor.
 * Controls the column layout and spacing for the work detail page.
 */
export default function WorkLayoutConfigBlockEditor({
  block,
  onChange,
}: WorkLayoutConfigBlockEditorProps) {
  const columnGap = block.columnGap ?? 90;
  const textColumnWidth = block.textColumnWidth ?? 'auto';

  return (
    <div className="space-y-4">
      {/* Layout Configuration Section */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Layout Configuration</h3>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Column Layout
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="columnLayout"
                value="1"
                checked={block.columnLayout === 1}
                onChange={(e) => onChange({ columnLayout: parseInt(e.target.value) as 1 | 2 | 3 })}
                className="w-4 h-4"
              />
              <span className="text-xs font-medium text-gray-700">1 Column (Single column, full width)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="columnLayout"
                value="2"
                checked={block.columnLayout === 2}
                onChange={(e) => onChange({ columnLayout: parseInt(e.target.value) as 1 | 2 | 3 })}
                className="w-4 h-4"
              />
              <span className="text-xs font-medium text-gray-700">2 Columns (Title left, text right)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="columnLayout"
                value="3"
                checked={block.columnLayout === 3}
                onChange={(e) => onChange({ columnLayout: parseInt(e.target.value) as 1 | 2 | 3 })}
                className="w-4 h-4"
              />
              <span className="text-xs font-medium text-gray-700">3 Columns (Evenly distributed)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Spacing Configuration */}
      {block.columnLayout > 1 && (
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Spacing Configuration</h3>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Column Gap
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={columnGap}
                onChange={(e) => onChange({ columnGap: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="number"
                min="20"
                max="200"
                value={columnGap}
                onChange={(e) => onChange({ columnGap: parseInt(e.target.value) })}
                className="w-16 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Text Column Width
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="textColumnWidth"
                  value="narrow"
                  checked={textColumnWidth === 'narrow'}
                  onChange={(e) =>
                    onChange({ textColumnWidth: e.target.value as 'auto' | 'narrow' | 'wide' })
                  }
                  className="w-4 h-4"
                />
                <span className="text-xs font-medium text-gray-700">Narrow</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="textColumnWidth"
                  value="auto"
                  checked={textColumnWidth === 'auto'}
                  onChange={(e) =>
                    onChange({ textColumnWidth: e.target.value as 'auto' | 'narrow' | 'wide' })
                  }
                  className="w-4 h-4"
                />
                <span className="text-xs font-medium text-gray-700">Auto (Default)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="textColumnWidth"
                  value="wide"
                  checked={textColumnWidth === 'wide'}
                  onChange={(e) =>
                    onChange({ textColumnWidth: e.target.value as 'auto' | 'narrow' | 'wide' })
                  }
                  className="w-4 h-4"
                />
                <span className="text-xs font-medium text-gray-700">Wide</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Summary */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Configuration</p>
        <p className="text-xs text-gray-700">
          Layout: <span className="font-semibold">{block.columnLayout}-column</span>
          {block.columnLayout > 1 && (
            <>
              {' | Gap: '}
              <span className="font-semibold">{columnGap}px</span>
              {' | Width: '}
              <span className="font-semibold capitalize">{textColumnWidth}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
