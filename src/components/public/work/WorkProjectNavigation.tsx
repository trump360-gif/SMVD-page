'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProjectNav {
  id: string | number;
  title: string;
}

interface WorkProjectNavigationProps {
  previousProject?: ProjectNav | null;
  nextProject?: ProjectNav | null;
}

export default function WorkProjectNavigation({ previousProject, nextProject }: WorkProjectNavigationProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto py-10 md:py-[60px] border-t border-[#1b1d1f]">
      {previousProject ? (
        <button
          type="button"
          onClick={() => router.push(`/work/${previousProject.id}`)}
          className="flex items-center gap-[15px] sm:gap-[30px] group text-left max-w-[45%]"
        >
          <div className="w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-full border border-[#1b1d1f] flex items-center justify-center shrink-0 group-hover:bg-[#1b1d1f] transition-colors overflow-hidden relative">
            <Image src="/arrow-left.svg" alt="Previous" width={24} height={24} unoptimized className="sm:w-8 sm:h-8 group-hover:invert transition-all" />
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <span className="text-[12px] sm:text-[14px] text-[#666666] font-medium tracking-[1.4px]">PREV</span>
            <span className="text-[16px] sm:text-[24px] font-bold text-[#1b1d1f] font-pretendard line-clamp-2 md:line-clamp-1 break-keep">{previousProject.title}</span>
          </div>
        </button>
      ) : (
        <div className="max-w-[45%]"></div>
      )}

      <button
        type="button"
        onClick={() => router.push('/work')}
        className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px] shrink-0 hover:opacity-70 transition-opacity"
      >
        <Image src="/grid-icon.svg" alt="List" width={24} height={24} unoptimized className="w-full h-full" />
      </button>

      {nextProject ? (
        <button
          type="button"
          onClick={() => router.push(`/work/${nextProject.id}`)}
          className="flex items-center gap-[15px] sm:gap-[30px] group text-right justify-end max-w-[45%]"
        >
          <div className="flex flex-col gap-1 sm:gap-2 items-end">
            <span className="text-[12px] sm:text-[14px] text-[#666666] font-medium tracking-[1.4px]">NEXT</span>
            <span className="text-[16px] sm:text-[24px] font-bold text-[#1b1d1f] font-pretendard line-clamp-2 md:line-clamp-1 break-keep">{nextProject.title}</span>
          </div>
          <div className="w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-full border border-[#1b1d1f] flex items-center justify-center shrink-0 group-hover:bg-[#1b1d1f] transition-colors overflow-hidden relative">
            <Image src="/arrow-right.svg" alt="Next" width={24} height={24} unoptimized className="sm:w-8 sm:h-8 group-hover:invert transition-all" />
          </div>
        </button>
      ) : (
        <div className="max-w-[45%]"></div>
      )}
    </div>
  );
}
