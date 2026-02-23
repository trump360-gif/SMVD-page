'use client';

import { useState } from 'react';
import type { UndergraduateContent } from '@/lib/validation/curriculum';
import type { Semester, GraduateModule, ModuleDetail } from './types';
import {
  semesters as defaultSemesters,
  undergraduateModules as defaultModules,
  moduleDetails as defaultModuleDetails,
  classificationOptions,
  trackOptions,
} from './data';
import FilterSection from './FilterSection';
import SemesterGrid from './SemesterGrid';
import TrackTable from './TrackTable';
import ModuleDetailsTable from './ModuleDetailsTable';

interface UndergraduateTabProps {
  content?: UndergraduateContent | null;
}

export default function UndergraduateTab({ content }: UndergraduateTabProps) {
  const [checkedClassification] = useState<string>('required');

  // Use DB data if available, otherwise fall back to hardcoded defaults
  const displaySemesters: Semester[] = content?.semesters ?? defaultSemesters;
  const displayModules: GraduateModule[] = (content?.tracks as GraduateModule[]) ?? defaultModules;
  const displayModuleDetails: ModuleDetail[] =
    content?.modules ?? defaultModuleDetails;

  return (
    <div className="flex flex-col gap-10 sm:gap-[50px] lg:gap-[60px] w-full">
      {/* SECTION 1: Semester Courses */}
      <div className="flex flex-col gap-[60px]">
        {/* Filter Section */}
        <FilterSection
          checkedClassification={checkedClassification}
          classificationOptions={classificationOptions}
          trackOptions={trackOptions}
        />

        {/* Semesters Grid - 4 columns */}
        <SemesterGrid
          semesters={displaySemesters}
          checkedClassification={checkedClassification}
        />
      </div>

      {/* SECTION 2: Track Information */}
      <div className="flex flex-col gap-0">
        <TrackTable modules={displayModules} />
        <ModuleDetailsTable moduleDetails={displayModuleDetails} />
      </div>

      {/* Footer Note - Right aligned, above footer */}
      <div className="text-right -mt-[55px] p-0">
        <p className="text-[16px] font-normal text-[#666666] font-pretendard m-0 leading-none p-0">
          *
          <a
            href="https://www.sookmyung.ac.kr/kr/university-life/curriculum01.do"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666666] underline cursor-pointer"
          >
            [숙명여자대학교 홈페이지]-[대학생활]-[학사정보]-[교육과정]
          </a>
          {' '}에서 확인 가능
        </p>
      </div>
    </div>
  );
}
