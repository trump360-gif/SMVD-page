'use client';

import type { Professor } from './types';

interface ProfessorInfoProps {
  professor: Professor;
}

export default function ProfessorInfo({ professor }: ProfessorInfoProps) {
  return (
    <>
      {/* Name */}
      <div
        className="h-auto sm:h-[66px] flex items-end"
      >
        <h1
          className="text-[36px] sm:text-[60px] font-normal text-[#0a0a0aff] font-helvetica m-0 tracking-[-0.6px] leading-[1.1]"
        >
          {professor.name}
        </h1>
      </div>

      {/* Office */}
      <div className="flex gap-3 sm:gap-[30px] items-center">
        <div
          className="bg-[#ebecf0ff] px-3 rounded-none w-[70px] sm:w-[80px] shrink-0 flex items-center justify-center min-h-[28px]"
        >
          <span
            className="text-[12px] sm:text-[14px] font-normal text-[#141414] font-helvetica leading-[1.5]"
          >
            연구실
          </span>
        </div>
        <p
          className="text-[15px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5]"
        >
          {professor.office}
        </p>
      </div>

      {/* Email */}
      <div className="flex gap-3 sm:gap-[30px] flex-col sm:flex-row items-start sm:items-center">
        <div
          className="bg-[#ebecf0ff] px-3 rounded-none w-[70px] sm:w-[80px] shrink-0 flex items-center justify-center min-h-[28px]"
        >
          <span
            className="text-[12px] sm:text-[14px] font-normal text-[#141414] font-helvetica leading-[1.5]"
          >
            이메일
          </span>
        </div>
        <p
          className="text-[14px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5] break-all sm:break-normal"
        >
          <span className="sm:hidden">{professor.email.join('\n')}</span>
          <span className="hidden sm:inline">{professor.email.join(' ')}</span>
        </p>
      </div>

      {/* Homepage */}
      {professor.homepage && (
        <div className="flex gap-3 sm:gap-[30px] flex-col sm:flex-row items-start sm:items-center">
          <div
            className="bg-[#ebecf0ff] px-3 rounded-none w-[70px] sm:w-[80px] shrink-0 flex items-center justify-center min-h-[28px]"
          >
            <span
              className="text-[12px] sm:text-[14px] font-normal text-[#141414] font-helvetica leading-[1.5]"
            >
              홈페이지
            </span>
          </div>
          <a
            href={professor.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] sm:text-[18px] font-normal text-[#141414] font-inter m-0 tracking-[-0.44px] leading-[1.5] underline cursor-pointer break-all sm:break-normal"
          >
            {professor.homepage}
          </a>
        </div>
      )}
    </>
  );
}
