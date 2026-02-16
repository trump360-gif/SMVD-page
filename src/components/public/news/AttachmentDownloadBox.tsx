'use client';

import { Download, FileText } from 'lucide-react';

/**
 * Attachment data interface (NEW - 2026-02-16)
 * Matches the structure from useNewsEditor.AttachmentData
 */
interface Attachment {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

/**
 * AttachmentDownloadBox Component
 * Displays a list of downloadable attachments for a news article
 *
 * @param attachments - Array of attachment objects
 * @returns JSX element or null if no attachments
 *
 * Features:
 * - File icon display
 * - File size formatting
 * - Download link with proper attributes
 * - Responsive layout
 * - Clean, accessible design
 */
export default function AttachmentDownloadBox({ attachments }: { attachments?: Attachment[] | null }) {
  // Don't render if no attachments
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FileText size={20} className="text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">
          Attachments ({attachments.length})
        </h3>
      </div>

      {/* Attachments List */}
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.filepath}
            download={attachment.filename}
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            rel="noopener noreferrer"
          >
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {attachment.filename}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {(attachment.size / 1024).toFixed(1)} KB
              </p>
            </div>

            {/* Download Button */}
            <button
              className="ml-3 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
              title={`Download ${attachment.filename}`}
              onClick={(e) => {
                // Allow native download to proceed
                // No preventDefault needed for native download
              }}
            >
              <Download size={18} />
            </button>
          </a>
        ))}
      </div>

      {/* Footer Info */}
      <p className="text-xs text-gray-400 mt-4">
        All files are provided for educational purposes.
      </p>
    </div>
  );
}
