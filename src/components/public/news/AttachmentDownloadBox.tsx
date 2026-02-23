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
  // Handle null, undefined, empty array, and non-array values (e.g., empty object from Prisma)
  if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
    return null;
  }

  return (
    <div
      className="mt-6 sm:mt-8 lg:mt-12 border border-neutral-1450 p-4 sm:p-10 lg:p-6"
    >
      {/* Header with minimal design */}
      <h3
        className="text-[14px] sm:text-[15px] lg:text-[16px] font-semibold text-neutral-1450 mb-3 sm:mb-4 m-0"
      >
        Attached File
      </h3>

      {/* Horizontal line separator */}
      <div
        className="border-b border-gray-300 mb-3 sm:mb-4"
      />

      {/* Attachments List - Numbered format */}
      <div
        className="flex flex-col gap-3 sm:gap-4 lg:gap-3"
      >
        {attachments.map((attachment, index) => (
          <a
            key={attachment.id || `attachment-${index}`}
            href={attachment.filepath}
            download={attachment.filename}
            className="group flex items-center justify-between cursor-pointer no-underline transition-colors duration-300 ease-in hover:text-blue-600"
          >
            {/* Numbered filename */}
            <span
              className="text-[12px] sm:text-[13px] lg:text-[14px] text-neutral-1450 flex-1 group-hover:text-blue-600 transition-colors duration-300 ease-in"
            >
              {index + 1}. {attachment.filename}
            </span>

            {/* Download icon */}
            <Download
              className="w-[14px] h-[14px] sm:w-4 sm:h-4 text-gray-400 shrink-0 ml-2 sm:ml-4 transition-colors duration-300 ease-in group-hover:text-blue-600"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
