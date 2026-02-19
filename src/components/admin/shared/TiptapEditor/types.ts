/**
 * Tiptap Editor specific type definitions
 * Complements BlockEditor/types.ts with editor-specific interfaces
 */

import { TiptapContent } from '../BlockEditor/types';

export interface ImageUploadResult {
  id: string;
  src: string;
  originalSrc?: string;
  thumbnailSrc?: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  altText?: string;
}

export interface TiptapEditorProps {
  /** Content in markdown string or Tiptap JSON format */
  content: string | TiptapContent;

  /** Format of the content */
  contentFormat?: 'markdown' | 'tiptap';

  /** Callback when editor content changes */
  onChange: (content: TiptapContent) => void;

  /** Optional callback for image upload */
  onImageUpload?: (file: File) => Promise<ImageUploadResult>;

  /** Placeholder text */
  placeholder?: string;

  /** Styling props passed from TextBlock */
  fontSize?: number;
  fontWeight?: '400' | '500' | '700';
  color?: string;
  lineHeight?: number;

  /** Optional CSS class */
  className?: string;

  /** Optional editor ID for accessibility */
  editorId?: string;
}

export interface CustomImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  align?: 'left' | 'center' | 'right' | 'full';
  originalSrc?: string;
  uploadingState?: 'uploading' | 'error';
}

export interface ToolbarButtonConfig {
  name: string;
  label: string;
  icon: string;
  command: () => boolean;
  isActive?: () => boolean;
  divider?: boolean;
}
