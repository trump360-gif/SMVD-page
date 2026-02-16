'use client';

import { Download } from 'lucide-react';

/**
 * Attachment data interface (NEW - 2026-02-16)
 * Matches the structure from useNewsEditor.AttachmentData
 */
interface Attachment {
  id: string;
  filename: string;
  filepath: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

/**
 * AttachmentDownloadBox Component (Minimal Design)
 * Displays a minimalist list of downloadable attachments for a news article
 *
 * Design:
 * - Simple "Attached File" title (no icon)
 * - Horizontal line separator
 * - Numbered list (1. filename)
 * - Download icon on the right
 * - No background color, no borders, no extra info
 *
 * @param attachments - Array of attachment objects
 * @returns JSX element or null if no attachments
 */
export default function AttachmentDownloadBox({ attachments }: { attachments?: Attachment[] | null }) {
  // Don't render if no attachments
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      {/* Header with minimal design */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Attached File
      </h3>

      {/* Horizontal line separator */}
      <div className="border-b border-gray-300 mb-4" />

      {/* Attachments List - Numbered format */}
      <div className="space-y-3">
        {attachments.map((attachment, index) => (
          <a
            key={attachment.id}
            href={attachment.filepath}
            download={attachment.filename}
            className="flex items-center justify-between group cursor-pointer"
          >
            {/* Numbered filename */}
            <span className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
              {index + 1}. {attachment.filename}
            </span>

            {/* Download icon */}
            <Download
              size={18}
              className="text-gray-400 group-hover:text-blue-600 shrink-0 ml-4 transition-colors"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
