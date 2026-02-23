'use client';

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

  return (
    <div
      className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full max-w-[1440px] mx-auto"
    >
      {/* Title and Filter Tabs */}
      <div
        className="flex justify-between items-center w-full pb-3 sm:pb-5 border-b-2 border-neutral-1450"
      >
        <h1
          className="text-[18px] sm:text-[24px] font-bold font-satoshi text-[#1b1d1f] m-0"
        >
          News&Event
        </h1>
      </div>

      {/* Detail Content */}
      <div
        className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full pb-10 sm:pb-20"
      >
        {/* Header Section */}
        <div
          className="flex flex-col gap-2 sm:gap-3 w-full pb-3 sm:pb-5 border-b-2 border-[#e5e7eb]"
        >
          {/* Meta Info */}
          <div
            className="flex items-center gap-2"
          >
            <span
              className="text-[12px] sm:text-[14px] font-medium font-satoshi text-neutral-1450 bg-[#ebecf0] py-[3px] px-[6px] sm:py-1 sm:px-2 rounded min-w-max"
            >
              {data.category}
            </span>
            <span
              className="text-[12px] sm:text-[14px] font-medium font-pretendard text-[#626872] tracking-[-0.14px]"
            >
              {data.date}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-[24px] sm:text-[32px] lg:text-[48px] font-bold font-pretendard text-black m-0 leading-[1.3] sm:leading-[1.45] tracking-[-0.48px] break-keep"
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
