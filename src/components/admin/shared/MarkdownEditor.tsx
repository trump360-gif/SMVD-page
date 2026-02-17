'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeContent } from '@/lib/sanitize';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS = [
  { label: 'B', md: '**', tooltip: 'Bold' },
  { label: 'I', md: '*', tooltip: 'Italic' },
  { label: 'H1', md: '# ', tooltip: 'Heading 1', prefix: true },
  { label: 'H2', md: '## ', tooltip: 'Heading 2', prefix: true },
  { label: 'H3', md: '### ', tooltip: 'Heading 3', prefix: true },
  { label: 'UL', md: '- ', tooltip: 'Unordered List', prefix: true },
  { label: 'OL', md: '1. ', tooltip: 'Ordered List', prefix: true },
  { label: '---', md: '\n---\n', tooltip: 'Horizontal Rule', insert: true },
  { label: 'Link', md: '[text](url)', tooltip: 'Link', insert: true },
];

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write in Markdown...',
  minHeight = '300px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split');

  const handleToolbarClick = useCallback(
    (button: (typeof TOOLBAR_BUTTONS)[number]) => {
      const textarea = document.getElementById('md-editor-textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);

      let newValue: string;
      let newCursorPos: number;

      if (button.insert) {
        newValue = value.substring(0, start) + button.md + value.substring(end);
        newCursorPos = start + button.md.length;
      } else if (button.prefix) {
        // Line prefix: add to beginning of current line
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        newValue = value.substring(0, lineStart) + button.md + value.substring(lineStart);
        newCursorPos = start + button.md.length;
      } else {
        // Wrap selection
        newValue =
          value.substring(0, start) +
          button.md +
          (selectedText || 'text') +
          button.md +
          value.substring(end);
        newCursorPos = start + button.md.length + (selectedText || 'text').length + button.md.length;
      }

      onChange(newValue);

      // Restore cursor position
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [value, onChange]
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {TOOLBAR_BUTTONS.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => handleToolbarClick(btn)}
              className="px-2 py-1 text-xs font-mono text-gray-700 hover:bg-gray-200 rounded transition-colors"
              title={btn.tooltip}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-0.5 bg-gray-200 rounded p-0.5">
          {(['edit', 'split', 'preview'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'edit' ? 'Edit' : tab === 'preview' ? 'Preview' : 'Split'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview */}
      <div
        className={`flex ${activeTab === 'split' ? 'divide-x divide-gray-200' : ''}`}
        style={{ minHeight }}
      >
        {/* Editor */}
        {(activeTab === 'edit' || activeTab === 'split') && (
          <textarea
            id="md-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${
              activeTab === 'split' ? 'w-1/2' : 'w-full'
            } p-4 resize-none outline-none font-mono text-sm leading-relaxed text-gray-900 bg-white`}
            style={{ minHeight }}
          />
        )}

        {/* Preview */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div
            className={`${
              activeTab === 'split' ? 'w-1/2' : 'w-full'
            } p-4 overflow-y-auto prose prose-sm max-w-none bg-gray-50`}
            style={{ minHeight }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{sanitizeContent(value)}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 text-sm italic">Preview will appear here...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
