import {
  Header,
  Footer,
} from '@/components/public/home';
import { NewsEventDetailContent } from '@/components/public/news';
import NewsBlockRenderer from '@/components/public/news/NewsBlockRenderer';
import AttachmentDownloadBox from '@/components/public/news/AttachmentDownloadBox'; // NEW - 2026-02-16
import { prisma } from '@/lib/db';

// ⚠️ CRITICAL: Disable ISR caching to always fetch latest DB data
// When admin saves changes via CMS, they should appear immediately on public page
export const revalidate = 0;

// ---- Types ----

interface AttachmentData {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

interface NewsLegacyData {
  id: string;
  category: string;
  date: string;
  title: string;
  introTitle?: string;
  introText?: string;
  attachments?: AttachmentData[] | null; // NEW - 2026-02-16
  images?: {
    main: string;
    centerLeft: string;
    centerRight: string;
    bottomLeft: string;
    bottomCenter: string;
    bottomRight: string;
  };
}

interface NewsBlockData {
  id: string;
  category: string;
  date: string;
  title: string;
  blocks: Array<Record<string, unknown>>;
  version: string;
  attachments?: AttachmentData[] | null; // NEW - 2026-02-16
}

type NewsDetailResult =
  | { type: 'legacy'; data: NewsLegacyData }
  | { type: 'blocks'; data: NewsBlockData }
  | null;

// ---- Data fetching ----

async function getNewsDetail(slug: string): Promise<NewsDetailResult> {
  try {
    const article = await prisma.newsEvent.findUnique({
      where: { slug },
    });

    if (article) {
      const content = article.content as Record<string, unknown> | null;

      const baseData = {
        id: article.slug,
        category: article.category,
        date: article.publishedAt
          ? new Date(article.publishedAt).toISOString().split('T')[0]
          : '2025-01-05',
        title: article.title,
        attachments: article.attachments as AttachmentData[] | null | undefined, // NEW - 2026-02-16
      };

      // Check if content is in block format (has blocks[] array with items)
      if (
        content &&
        'blocks' in content &&
        Array.isArray(content.blocks) &&
        content.blocks.length > 0
      ) {
        return {
          type: 'blocks',
          data: {
            ...baseData,
            blocks: content.blocks as Array<Record<string, unknown>>,
            version: (content.version as string) || '1.0',
          },
        };
      }

      // Legacy format (introTitle, introText, gallery)
      const gallery = content?.gallery as Record<string, string> | undefined;

      return {
        type: 'legacy',
        data: {
          ...baseData,
          introTitle: (content?.introTitle as string) || undefined,
          introText: (content?.introText as string) || undefined,
          images: gallery
            ? {
                main: gallery.main || '',
                centerLeft: gallery.centerLeft || '',
                centerRight: gallery.centerRight || '',
                bottomLeft: gallery.bottomLeft || '',
                bottomCenter: gallery.bottomCenter || '',
                bottomRight: gallery.bottomRight || '',
              }
            : undefined,
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch news detail from DB:', error);
  }

  // Return null (component will use hardcoded data)
  return null;
}

// ---- Page component ----

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getNewsDetail(id);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div
        style={{
          width: '100%',
          paddingTop: '0px',
          paddingBottom: '61px',
          paddingLeft: '40px',
          paddingRight: '40px',
          backgroundColor: '#ffffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '100px',
          }}
        >
          {result?.type === 'blocks' ? (
            // Block-based content rendering
            <NewsBlockDetailView data={result.data} />
          ) : (
            // Legacy content rendering (or fallback to hardcoded)
            <>
              <NewsEventDetailContent
                itemId={id}
                dbData={result?.data ?? null}
              />
              {/* Attachment Download Box for legacy format (NEW - 2026-02-16) */}
              <AttachmentDownloadBox attachments={result?.data?.attachments} />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ---- Block-based detail view ----

function NewsBlockDetailView({ data }: { data: NewsBlockData }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
      }}
    >
      {/* Title and Filter Tabs (matching NewsEventDetailContent layout) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingBottom: '20px',
          borderBottom: '2px solid #141414ff',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
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
          gap: '40px',
          width: '100%',
          paddingBottom: '80px',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            paddingBottom: '20px',
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
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Satoshi',
                color: '#141414ff',
                backgroundColor: '#ebecf0ff',
                padding: '4px 8px',
                borderRadius: '4px',
                minWidth: 'fit-content',
              }}
            >
              {data.category}
            </span>
            <span
              style={{
                fontSize: '14px',
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
              fontSize: '48px',
              fontWeight: '700',
              fontFamily: 'Pretendard',
              color: '#000000ff',
              margin: '0',
              lineHeight: '1.45',
              letterSpacing: '-0.48px',
            }}
          >
            {data.title}
          </h1>
        </div>

        {/* Block content */}
        <NewsBlockRenderer blocks={data.blocks} />

        {/* Attachment Download Box (NEW - 2026-02-16) */}
        <AttachmentDownloadBox attachments={data.attachments} />
      </div>
    </div>
  );
}
