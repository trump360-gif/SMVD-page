import {
  Header,
  Footer,
} from '@/components/public/home';
import { NewsEventDetailContent } from '@/components/public/news';
import { prisma } from '@/lib/db';

interface NewsDetailData {
  id: string;
  category: string;
  date: string;
  title: string;
  introTitle?: string;
  introText?: string;
  images?: {
    main: string;
    centerLeft: string;
    centerRight: string;
    bottomLeft: string;
    bottomCenter: string;
    bottomRight: string;
  };
}

async function getNewsDetail(slug: string): Promise<NewsDetailData | null> {
  try {
    const article = await prisma.newsEvent.findUnique({
      where: { slug },
    });

    if (article) {
      const content = article.content as Record<string, unknown> | null;
      const gallery = content?.gallery as Record<string, string> | undefined;

      return {
        id: article.slug,
        category: article.category,
        date: article.publishedAt
          ? new Date(article.publishedAt).toISOString().split('T')[0]
          : '2025-01-05',
        title: article.title,
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
      };
    }
  } catch (error) {
    console.error('Failed to fetch news detail from DB:', error);
  }

  // Return null (component will use hardcoded data)
  return null;
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbDetail = await getNewsDetail(id);

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
          {/* News&Event Detail Component */}
          <NewsEventDetailContent itemId={id} dbData={dbDetail} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
