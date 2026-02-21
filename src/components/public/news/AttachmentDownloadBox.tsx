'use client';

import { Download } from 'lucide-react';
import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';

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
  const { isMobile, isTablet } = useResponsive();

  // Don't render if no attachments
  // Handle null, undefined, empty array, and non-array values (e.g., empty object from Prisma)
  if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
    return null;
  }

  const titleFontSize = isMobile ? '14px' : isTablet ? '15px' : '16px';
  const filenameFontSize = isMobile ? '12px' : isTablet ? '13px' : '14px';
  const downloadIconSize = isMobile ? 14 : 16;
  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : '24px';
  const containerMarginTop = isMobile ? '24px' : isTablet ? '32px' : '48px';

  return (
    <div
      style={{
        marginTop: containerMarginTop,
        border: '1px solid #141414',
        padding: containerPadding,
      }}
    >
      {/* Header with minimal design */}
      <h3
        style={{
          fontSize: titleFontSize,
          fontWeight: '600',
          color: '#141414',
          marginBottom: isMobile ? '12px' : '16px',
          margin: '0',
        }}
      >
        Attached File
      </h3>

      {/* Horizontal line separator */}
      <div
        style={{
          borderBottom: '1px solid #d1d5db',
          marginBottom: isMobile ? '12px' : '16px',
        }}
      />

      {/* Attachments List - Numbered format */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '12px' : isTablet ? '16px' : '12px',
        }}
      >
        {attachments.map((attachment, index) => (
          <a
            key={attachment.id || `attachment-${index}`}
            href={attachment.filepath}
            download={attachment.filename}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#2563eb';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'inherit';
            }}
          >
            {/* Numbered filename */}
            <span
              style={{
                fontSize: filenameFontSize,
                color: '#141414',
                flex: 1,
              }}
            >
              {index + 1}. {attachment.filename}
            </span>

            {/* Download icon */}
            <Download
              size={downloadIconSize}
              style={{
                color: '#9ca3af',
                flexShrink: 0,
                marginLeft: isMobile ? '8px' : '16px',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGElement).style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGElement).style.color = '#9ca3af';
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
