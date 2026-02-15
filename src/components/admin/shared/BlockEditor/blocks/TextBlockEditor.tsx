'use client';

import React from 'react';
import MarkdownEditor from '@/components/admin/shared/MarkdownEditor';
import type { TextBlock } from '../types';

interface TextBlockEditorProps {
  block: TextBlock;
  onChange: (content: string) => void;
}

/**
 * Text block editor that reuses the shared MarkdownEditor component.
 * Supports Markdown with split-view editing and preview.
 */
export default function TextBlockEditor({ block, onChange }: TextBlockEditorProps) {
  return (
    <div className="w-full">
      <MarkdownEditor
        value={block.content}
        onChange={onChange}
        placeholder="Write your content in Markdown..."
        minHeight="200px"
      />
    </div>
  );
}
