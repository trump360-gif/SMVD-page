'use client';

import React from 'react';
import type { WorkTitleBlock } from '../types';

interface WorkTitleBlockEditorProps {
  block: WorkTitleBlock;
  onChange: (data: Partial<WorkTitleBlock>) => void;
}

/**
 * Work title block editor.
 * Edits the project title, author, and email that appear
 * in the 2-column layout on WorkDetailPage.
 */
export default function WorkTitleBlockEditor({ block, onChange }: WorkTitleBlockEditorProps) {
  const titleFontSize = block.titleFontSize ?? 60;
  const authorFontSize = block.authorFontSize ?? 14;
  const gap = block.gap ?? 24;
  const titleFontWeight = block.titleFontWeight ?? '700';
  const authorFontWeight = block.authorFontWeight ?? '500';
  const emailFontWeight = block.emailFontWeight ?? '400';
  const titleColor = block.titleColor ?? '#1b1d1f';
  const authorColor = block.authorColor ?? '#1b1d1f';
  const emailColor = block.emailColor ?? '#7b828e';

  return (
    <div className="space-y-4">
      {/* Content Section */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Content</h3>

        {/* Title */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Project Title
          </label>
          <input
            type="text"
            value={block.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="STUDIO KNOT"
            className="w-full px-3 py-2 text-lg font-bold border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            style={{ fontFamily: 'Satoshi, sans-serif' }}
          />
        </div>

        {/* Author + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Author
            </label>
            <input
              type="text"
              value={block.author}
              onChange={(e) => onChange({ author: e.target.value })}
              placeholder="Author name"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={block.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="contact@example.com"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Styling Section */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Title Styling</h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title Font Size
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="120"
                value={titleFontSize}
                onChange={(e) => onChange({ titleFontSize: parseInt(e.target.value) })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title Font Weight
            </label>
            <select
              value={titleFontWeight}
              onChange={(e) => onChange({ titleFontWeight: e.target.value as '400' | '500' | '700' })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Title Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={titleColor}
              onChange={(e) => onChange({ titleColor: e.target.value })}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={titleColor}
              onChange={(e) => onChange({ titleColor: e.target.value })}
              className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Author/Email Styling */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-3">Author/Email Styling</h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Font Size
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="32"
                value={authorFontSize}
                onChange={(e) => onChange({ authorFontSize: parseInt(e.target.value) })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Gap (Title to Author)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="8"
                max="64"
                value={gap}
                onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Author Font Weight
            </label>
            <select
              value={authorFontWeight}
              onChange={(e) => onChange({ authorFontWeight: e.target.value as '400' | '500' | '700' })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Font Weight
            </label>
            <select
              value={emailFontWeight}
              onChange={(e) => onChange({ emailFontWeight: e.target.value as '400' | '500' | '700' })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Author Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={authorColor}
                onChange={(e) => onChange({ authorColor: e.target.value })}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={authorColor}
                onChange={(e) => onChange({ authorColor: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={emailColor}
                onChange={(e) => onChange({ emailColor: e.target.value })}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={emailColor}
                onChange={(e) => onChange({ emailColor: e.target.value })}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live preview */}
      {block.title && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Live Preview
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
            <h1
              style={{
                fontSize: `${titleFontSize}px`,
                fontWeight: titleFontWeight,
                color: titleColor,
                fontFamily: 'Satoshi, sans-serif',
                margin: '0',
                letterSpacing: '-0.6px',
                lineHeight: '1.2',
              }}
            >
              {block.title}
            </h1>
            <p
              style={{
                fontSize: `${authorFontSize}px`,
                fontWeight: authorFontWeight,
                color: authorColor,
                margin: '0',
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              {block.author}
              {block.email && ' '}
              {block.email && (
                <span style={{ fontWeight: emailFontWeight, color: emailColor }}>
                  {block.email}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
