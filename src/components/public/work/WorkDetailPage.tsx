'use client';

import { useResponsive } from '@/lib/responsive';
import { WorkDetail, type TiptapContent } from '@/constants/work-details';
import WorkHeader from './WorkHeader';
import WorkDetailContent from './WorkDetailContent';
import WorkProjectNavigation from './WorkProjectNavigation';
import TiptapWorkDetailView from './TiptapWorkDetailView'; // NEW - 2026-02-19
import { parseBlockContent } from './WorkDetailTypes';

interface WorkDetailPageProps {
  project: WorkDetail;
}

export default function WorkDetailPage({ project }: WorkDetailPageProps) {
  const { isMobile, isTablet } = useResponsive();

  // NEW - 2026-02-19: Check if content is Tiptap format
  const isTiptapContent = project.content &&
    typeof project.content === 'object' &&
    'type' in project.content &&
    (project.content as unknown as Record<string, unknown>).type === 'doc' &&
    'content' in project.content;

  // If Tiptap content, render with TiptapWorkDetailView
  if (isTiptapContent) {
    return (
      <TiptapWorkDetailView
        title={project.title}
        author={project.author}
        email={project.email}
        category={project.category}
        heroImage={project.heroImage}
        description={project.description}
        content={project.content as unknown as TiptapContent}
        previousProject={project.previousProject}
        nextProject={project.nextProject}
      />
    );
  }

  // Try to parse block-based content from description
  const blockContent = parseBlockContent(project.description);

  // Resolve display values with fallbacks to legacy hardcoded data
  const displayHero = blockContent?.hero || project.heroImage;
  const displayTitle = blockContent?.title?.title || project.title;
  const displayAuthor = blockContent?.title?.author || project.author;
  const displayEmail = blockContent?.title?.email || project.email;
  const displayDescription = blockContent?.mainDescription || project.description;
  const displayGalleryImages =
    blockContent?.galleryImages && blockContent.galleryImages.length > 0
      ? blockContent.galleryImages
      : project.galleryImages;

  // Extract layout configuration with defaults
  const columnLayout = blockContent?.layoutConfig?.columnLayout ?? 2;
  const columnGap = blockContent?.layoutConfig?.columnGap ?? 90;
  const textColumnWidth = blockContent?.layoutConfig?.textColumnWidth ?? 'auto';

  // Extract text styling from description block with defaults
  const descFontSize = blockContent?.mainDescriptionBlock?.fontSize ?? 18;
  const descFontWeight = blockContent?.mainDescriptionBlock?.fontWeight ?? '400';
  const descColor = blockContent?.mainDescriptionBlock?.color ?? '#1b1d1fff';
  const descLineHeight = blockContent?.mainDescriptionBlock?.lineHeight ?? 1.8;

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
      <WorkHeader currentCategory={project.category} />

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
        <WorkDetailContent
          displayHero={displayHero}
          displayTitle={displayTitle}
          displayAuthor={displayAuthor}
          displayEmail={displayEmail}
          displayDescription={displayDescription}
          displayGalleryImages={displayGalleryImages}
          columnLayout={columnLayout}
          columnGap={columnGap}
          textColumnWidth={textColumnWidth}
          descFontSize={descFontSize}
          descFontWeight={descFontWeight}
          descColor={descColor}
          descLineHeight={descLineHeight}
        />
        <WorkProjectNavigation
          previousProject={project.previousProject}
          nextProject={project.nextProject}
        />
      </div>
    </div>
  );
}
