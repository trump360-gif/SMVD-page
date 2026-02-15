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
  return (
    <div className="space-y-3">
      {/* Title */}
      <div>
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

      {/* Live preview */}
      {block.title && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Preview (left column)
          </p>
          <h1
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Satoshi, sans-serif', letterSpacing: '-0.6px' }}
          >
            {block.title}
          </h1>
          <p className="text-sm text-gray-900">
            {block.author}
            {block.email && (
              <>
                {' '}
                <span className="text-gray-500">{block.email}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
