'use client';

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
  return (
    <div className="w-full pt-0 pb-10 sm:pb-[61px] px-4 sm:px-6 lg:px-10 bg-white">
      {/* Header Navigation */}
      <WorkHeader currentCategory={category} />

      <div className="max-w-[1440px] mx-auto flex flex-col gap-10 sm:gap-[60px] lg:gap-20 pt-0">
        {/* All content rendered from Tiptap JSON (hero image is included in content) */}
        <div className="flex flex-col gap-10 w-full">
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
