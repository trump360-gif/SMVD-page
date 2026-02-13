import {
  Header,
  Footer,
} from '@/components/public/home';
import { NewsEventDetailContent } from '@/components/public/news';

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <NewsEventDetailContent itemId={id} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
