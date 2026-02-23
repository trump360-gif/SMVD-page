'use client';

import Image from 'next/image';
import type { Professor } from './types';

interface ProfessorHeaderProps {
  professor: Professor;
}

export default function ProfessorHeader({ professor }: ProfessorHeaderProps) {
  return (
    <div
      className="flex flex-col w-full sm:w-[200px] lg:w-[333px] shrink sm:shrink-0 pt-[40px] sm:pt-[100px] relative"
    >
      {/* Profile Image */}
      <div
        className="relative w-full h-auto sm:h-[280px] lg:h-[468px] aspect-[236/356] sm:aspect-auto bg-[#f3f4f6ff] mb-0"
      >
        <Image
          src={professor.profileImage}
          alt={professor.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 200px, 333px"
          style={{
            objectFit: 'cover',
          }}
          priority
        />
      </div>

      {/* Badge - Overlay on image */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#141414ff] py-[10px] sm:py-[12px] text-center w-full"
      >
        <span
          className="text-[14px] sm:text-[18px] font-normal text-[#ffffffff] font-helvetica tracking-[-0.27px]"
        >
          {professor.badge}
        </span>
      </div>
    </div>
  );
}
