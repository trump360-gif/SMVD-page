'use client';

import type { Professor } from './types';

interface ProfessorCoursesProps {
  courses: Professor['courses'];
}

export default function ProfessorCourses({ courses }: ProfessorCoursesProps) {
  return (
    <div className="flex gap-3 sm:gap-[30px] items-start">
      <div
        className="bg-[#ebecf0ff] px-3 rounded-none w-[70px] sm:w-[90px] shrink-0 flex items-center justify-center min-h-[28px]"
      >
        <span
          className="text-[12px] sm:text-[14px] font-normal text-[#141414ff] font-helvetica leading-[1.5]"
        >
          담당과목
        </span>
      </div>
      <div
        className="flex flex-col gap-0"
      >
        {/* Undergraduate */}
        <div
          className="flex gap-3 items-start mb-2"
        >
          <p
            className="text-[15px] sm:text-[18px] font-normal text-[#353030ff] font-inter m-0 tracking-[-0.44px] leading-[1.5] min-w-[30px] shrink-0"
          >
            학사
          </p>
          <div
            className="flex flex-col gap-0"
          >
            {courses.undergraduate.map((course, idx) => (
              <p
                key={idx}
                className="text-[15px] sm:text-[18px] font-normal text-[#141414ff] font-inter m-0 tracking-[-0.44px] leading-[1.5]"
              >
                {course}
              </p>
            ))}
          </div>
        </div>

        {/* Graduate */}
        <div
          className="flex gap-3 items-start"
        >
          <p
            className="text-[15px] sm:text-[18px] font-normal text-[#353030ff] font-inter m-0 tracking-[-0.44px] leading-[1.5] min-w-[30px] shrink-0"
          >
            석사
          </p>
          <div
            className="flex flex-col gap-0"
          >
            {courses.graduate.map((course, idx) => (
              <p
                key={idx}
                className="text-[15px] sm:text-[18px] font-normal text-[#141414ff] font-inter m-0 tracking-[-0.44px] leading-[1.5]"
              >
                {course}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
