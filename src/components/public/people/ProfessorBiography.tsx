'use client';

import type { Professor } from './types';

interface ProfessorBiographyProps {
  biography: Professor['biography'];
}

export default function ProfessorBiography({ biography }: ProfessorBiographyProps) {
  return (
    <div className="flex gap-[12px] sm:gap-[30px] items-start">
      <div
        className="bg-[#ebecf0ff] px-3 rounded-none w-[60px] sm:w-[70px] shrink-0 flex items-center justify-center min-h-[28px]"
      >
        <span
          className="text-[12px] sm:text-[14px] font-normal text-[#141414] font-helvetica leading-[1.5]"
        >
          약력
        </span>
      </div>

      <div
        className="flex flex-col gap-3"
      >
        {/* CV Download */}
        <a
          href="#"
          className="text-[15px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5] underline cursor-pointer"
        >
          {biography.cvText}
        </a>

        {/* Position */}
        <p
          className="text-[15px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5]"
        >
          {biography.position}
        </p>

        {/* Education */}
        <div>
          {biography.education.map((edu, idx) => (
            <p
              key={idx}
              className="text-[15px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5]"
            >
              {edu}
            </p>
          ))}
        </div>

        {/* Experience */}
        <div>
          {biography.experience.map((exp, idx) => (
            <p
              key={idx}
              className="text-[15px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5]"
            >
              {exp}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
