'use client';

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
        content={project.content as unknown as TiptapContent}
        previousProject={project.previousProject}
        nextProject={project.nextProject}
      />
    );
  }

  // NEW - 2026-02-20: Ensure description is a string (not JSON object/JSON string from DB)
  let descriptionStr = '';
  if (typeof project.description === 'string' && project.description.trim()) {
    try {
      const parsed = JSON.parse(project.description);
      // If it's a JSON object (blocks, version, etc), ignore it - it's block data
      if (parsed && typeof parsed === 'object' && ('blocks' in parsed || 'version' in parsed)) {
        descriptionStr = '';
      } else {
        // Valid string
        descriptionStr = project.description;
      }
    } catch {
      // Not JSON - use as is
      descriptionStr = project.description;
    }
  }

  // Try to parse block-based content from description
  const blockContent = parseBlockContent(descriptionStr);

  // Resolve display values with fallbacks to legacy hardcoded data
  const displayHero = blockContent?.hero || project.heroImage;
  const displayTitle = blockContent?.title?.title || project.title;
  const displayAuthor = blockContent?.title?.author || project.author;
  const displayEmail = blockContent?.title?.email || project.email;
  const displayDescription = blockContent?.mainDescription || descriptionStr;
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

  return (
    <div className="w-full pt-0 pb-10 sm:pb-[61px] px-4 sm:px-6 lg:px-10 bg-white">
      {/* Header Navigation */}
      <WorkHeader currentCategory={project.category} />

      <div className="max-w-[1440px] mx-auto flex flex-col gap-10 sm:gap-[60px] lg:gap-20 pt-0">
        <WorkDetailContent
          displayHero={displayHero}
          displayTitle={displayTitle}
          displayAuthor={displayAuthor}
          displayEmail={displayEmail}
          displayDescription={displayDescription}
          displayGalleryImages={displayGalleryImages}
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
