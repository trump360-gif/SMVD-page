'use client';

import React from 'react';
import type { WorkMetadataBlock } from '../types';

interface WorkMetadataBlockEditorProps {
  block: WorkMetadataBlock;
  onChange: (data: Partial<WorkMetadataBlock>) => void;
}

/**
 * Work metadata block editor for author + email display.
 * Shown in the left column of the 2-column layout.
 */
export default function WorkMetadataBlockEditor({ block, onChange }: WorkMetadataBlockEditorProps) {
  return (
    <div className="space-y-3">
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

      {/* Preview */}
      {(block.author || block.email) && (
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
            Preview
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 500 }}
          >
            <span style={{ color: '#1b1d1f' }}>{block.author}</span>
            {block.email && (
              <span style={{ color: '#7b828e', marginLeft: '16px', fontWeight: 400 }}>
                {block.email}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
