'use client';

import type { Semester } from './types';

interface SemesterGridProps {
  semesters: Semester[];
  checkedClassification: string;
}

export default function SemesterGrid({
  semesters,
  checkedClassification,
}: SemesterGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] gap-y-[60px] w-full auto-rows-fr">
      {semesters.map((semester, index) => (
        <div
          key={index}
          className="flex flex-col gap-5"
        >
          {/* Semester Title */}
          <h3 className="text-[14px] sm:text-[18px] font-medium text-neutral-1500 font-pretendard m-0">
            {semester.year}학년 {semester.term}학기
          </h3>

          {/* Courses List */}
          <div className="flex flex-col gap-0">
            {semester.courses.map((course, courseIndex) => {
              const isMatchedClassification =
                course.classification === checkedClassification;
              return (
                <div
                  key={courseIndex}
                  className={`flex items-center gap-[10px] h-auto sm:h-[95px] py-4 sm:py-[35px] border-b border-neutral-1500 box-border ${
                    isMatchedClassification ? 'bg-[#f0f0f0]' : 'bg-[#ffffff]'
                  }`}
                >
                  {/* Color Tag */}
                  <div
                    className="w-[14px] h-[14px] shrink-0 ml-[10px]"
                    style={{ backgroundColor: course.color }}
                  />

                  {/* Course Name */}
                  <p className="text-[14px] sm:text-[18px] font-medium text-[#353030] font-pretendard m-0 whitespace-pre-wrap break-words leading-[1.4]">
                    {course.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
