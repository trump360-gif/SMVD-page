'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect, useCallback, useRef } from 'react';
import { TiptapEditorProps, ImageUploadResult } from './types';
import { TiptapContent, isTiptapContent } from '../BlockEditor/types';
import { markdownToTiptapJSON, tiptapJSONToText } from '@/lib/tiptap/markdown-converter';
import TiptapToolbar from './TiptapToolbar';
import CustomImage from './CustomImage';
import './styles.css';

const lowlight = createLowlight(common);

export default function TiptapEditor({
  content,
  contentFormat,
  onChange,
  onImageUpload,
  placeholder = 'Start typing...',
  fontSize = 16,
  fontWeight = '400',
  color = '#1b1d1f',
  lineHeight = 1.8,
  className = '',
  editorId,
}: TiptapEditorProps) {
  const uploadInProgressRef = useRef(false);
  const previousContentStringRef = useRef<string>('');
  const isInitializingRef = useRef(false);

  // Initialize editor with proper extensions
  const editor = useEditor({
    immediatelyRender: false, // ✅ Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'tiptap-image-node',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Only emit changes if upload is not in progress AND not initializing
      if (!uploadInProgressRef.current && !isInitializingRef.current) {
        const json = editor.getJSON() as TiptapContent;
        onChange(json);
      }
    },
  });

  // Handle initial content loading and external content changes
  useEffect(() => {
    if (!editor) return;

    let tiptapContent: TiptapContent;

    // Convert input content to Tiptap JSON
    if (typeof content === 'string') {
      // Legacy markdown format
      tiptapContent = markdownToTiptapJSON(content);
    } else if (isTiptapContent(content)) {
      // Already Tiptap JSON
      tiptapContent = content;
    } else {
      // Default to empty doc
      tiptapContent = { type: 'doc', content: [] };
    }

    // Compare JSON stringified content to detect external changes only
    const currentContentString = JSON.stringify(tiptapContent);
    if (previousContentStringRef.current !== currentContentString) {
      // Content has changed externally (from parent prop)
      // Only update if not currently initializing (prevent loops)
      previousContentStringRef.current = currentContentString;

      // Mark as initializing to prevent onChange firing during setContent
      isInitializingRef.current = true;
      editor.commands.setContent(tiptapContent);

      // Reset flag after a tick
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 0);
    }
  }, [content, editor]); // ✅ Detects external content changes from parent modals

  // Expose uploadInProgress to toolbar
  const handleImageUploadStart = useCallback(() => {
    uploadInProgressRef.current = true;
  }, []);

  const handleImageUploadEnd = useCallback(() => {
    uploadInProgressRef.current = false;
  }, []);

  if (!editor) {
    return <div className="tiptap-editor-loading">Loading editor...</div>;
  }

  return (
    <div
      className={`tiptap-editor-wrapper ${className}`}
      id={editorId}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        color: color,
        lineHeight: lineHeight,
      }}
    >
      <TiptapToolbar
        editor={editor}
        onUploadStart={handleImageUploadStart}
        onUploadEnd={handleImageUploadEnd}
      />
      <div className="tiptap-editor-content">
        <EditorContent editor={editor} className="ProseMirror" />
      </div>
    </div>
  );
}
