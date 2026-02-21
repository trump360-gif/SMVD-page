'use client';

import { useResponsive } from '@/lib/responsive';
import WorkHeader from './WorkHeader';
import WorkProjectNavigation from './WorkProjectNavigation';
import TiptapContentRenderer from '../news/TiptapContentRenderer';

interface TiptapContent {
  type: 'doc';
  content: Array<Record<string, unknown>>;
}

interface ProjectNavigation {
  id: string;
  title: string;
}

interface TiptapWorkDetailViewProps {
  title: string;
  author: string;
  email?: string;
  category: string;
  heroImage: string;
  content: TiptapContent;
  previousProject?: ProjectNavigation;
  nextProject?: ProjectNavigation;
}

/**
 * Responsive Tiptap JSON content detail view for work projects.
 * Renders migrated Tiptap content for work portfolio items.
 */
export default function TiptapWorkDetailView({
  category,
  content,
  previousProject,
  nextProject,
}: TiptapWorkDetailViewProps) {
  const { isMobile, isTablet } = useResponsive();

  const containerPaddingX = isMobile ? '16px' : isTablet ? '24px' : '40px';
  const containerPaddingBottom = isMobile ? '40px' : '61px';
  const sectionGap = isMobile ? '40px' : isTablet ? '60px' : '80px';

  return (
    <div
      style={{
        width: '100%',
        paddingTop: '0px',
        paddingBottom: containerPaddingBottom,
        paddingLeft: containerPaddingX,
        paddingRight: containerPaddingX,
        backgroundColor: '#ffffffff',
      }}
    >
      {/* Header Navigation */}
      <WorkHeader currentCategory={category} />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: sectionGap,
          paddingTop: '0px',
        }}
      >
        {/* All content rendered from Tiptap JSON (hero image is included in content) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '100%',
          }}
        >
          <TiptapContentRenderer content={content as unknown as Record<string, unknown>} />
        </div>

        {/* Project Navigation */}
        <WorkProjectNavigation
          previousProject={previousProject}
          nextProject={nextProject}
        />
      </div>
    </div>
  );
}
