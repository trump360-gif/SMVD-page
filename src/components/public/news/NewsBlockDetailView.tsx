'use client';

import { useResponsive } from '@/lib/responsive';
import NewsBlockRenderer from './NewsBlockRenderer';
import AttachmentDownloadBox from './AttachmentDownloadBox';

interface AttachmentData {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

interface NewsBlockData {
  id: string;
  category: string;
  date: string;
  title: string;
  blocks: Array<Record<string, unknown>>;
  version: string;
  attachments?: AttachmentData[] | null;
}

interface NewsBlockDetailViewProps {
  data: NewsBlockData;
}

/**
 * Responsive block-based detail view for news articles.
 * Extracted as a client component to use useResponsive hook.
 */
export default function NewsBlockDetailView({ data }: NewsBlockDetailViewProps) {
  const { isMobile, isTablet } = useResponsive();

  const blockGap = isMobile ? '24px' : isTablet ? '32px' : '40px';
  const titleFontSize = isMobile ? '24px' : isTablet ? '32px' : '48px';
  const titleLineHeight = isMobile ? '1.3' : '1.45';
  const headerFontSize = isMobile ? '18px' : '24px';
  const metaFontSize = isMobile ? '12px' : '14px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: blockGap,
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
      }}
    >
      {/* Title and Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingBottom: isMobile ? '12px' : '20px',
          borderBottom: '2px solid #141414ff',
        }}
      >
        <h1
          style={{
            fontSize: headerFontSize,
            fontWeight: '700',
            fontFamily: 'Satoshi',
            color: '#1b1d1fff',
            margin: '0',
          }}
        >
          News&Event
        </h1>
      </div>

      {/* Detail Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: blockGap,
          width: '100%',
          paddingBottom: isMobile ? '40px' : '80px',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '8px' : '12px',
            width: '100%',
            paddingBottom: isMobile ? '12px' : '20px',
            borderBottom: '2px solid #e5e7ebff',
          }}
        >
          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: metaFontSize,
                fontWeight: '500',
                fontFamily: 'Satoshi',
                color: '#141414ff',
                backgroundColor: '#ebecf0ff',
                padding: isMobile ? '3px 6px' : '4px 8px',
                borderRadius: '4px',
                minWidth: 'fit-content',
              }}
            >
              {data.category}
            </span>
            <span
              style={{
                fontSize: metaFontSize,
                fontWeight: '500',
                fontFamily: 'Pretendard',
                color: '#626872ff',
                letterSpacing: '-0.14px',
              }}
            >
              {data.date}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: titleFontSize,
              fontWeight: '700',
              fontFamily: 'Pretendard',
              color: '#000000ff',
              margin: '0',
              lineHeight: titleLineHeight,
              letterSpacing: '-0.48px',
              wordBreak: 'keep-all',
            }}
          >
            {data.title}
          </h1>
        </div>

        {/* Block content */}
        <NewsBlockRenderer blocks={data.blocks} />

        {/* Attachment Download Box */}
        <AttachmentDownloadBox attachments={data.attachments} />
      </div>
    </div>
  );
}
