'use client';

import { CurriculumTab } from '@/components/public/curriculum';
import type { UndergraduateContent, GraduateContent } from '@/lib/validation/curriculum';

interface CurriculumContentProps {
  undergraduateContent?: UndergraduateContent | null;
  graduateContent?: GraduateContent | null;
}

export default function CurriculumContent({
  undergraduateContent,
  graduateContent,
}: CurriculumContentProps) {
  return (
    <div className="w-full box-border pt-0 pb-[61px] bg-white px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10">
        {/* Curriculum Tab Component */}
        <CurriculumTab
          undergraduateContent={undergraduateContent}
          graduateContent={graduateContent}
        />
      </div>
    </div>
  );
}
