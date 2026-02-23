'use client';

import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/public/home';
import type { Professor } from '@/components/public/people/types';
import ProfessorHeader from '@/components/public/people/ProfessorHeader';
import ProfessorInfo from '@/components/public/people/ProfessorInfo';
import ProfessorCourses from '@/components/public/people/ProfessorCourses';
import ProfessorBiography from '@/components/public/people/ProfessorBiography';

interface ProfessorDetailContentProps {
  professor: Professor;
}

export default function ProfessorDetailContent({ professor }: ProfessorDetailContentProps) {
  const router = useRouter();

  return (
    <div>
      <Header />

      {/* Tab Header Section - About Major / Our People */}
      <div
        className="w-full pt-6 sm:pt-8 lg:pt-[60px] pb-0 px-5 sm:px-10 lg:px-[55.5px] bg-[#ffffffff]"
      >
        <div
          className="flex flex-col gap-5"
        >
          {/* Tab Buttons */}
          <div
            className="flex gap-[20px] sm:gap-[30px] lg:gap-[40px] border-b border-neutral-1450 pb-[10px]"
          >
            <button
              onClick={() => router.push('/about')}
              className="bg-transparent border-none text-[16px] sm:text-[18px] lg:text-[24px] font-normal text-neutral-1450 font-inter cursor-pointer p-0 pb-[10px] -mb-[10px] transition-all duration-200 ease-in"
            >
              About Major
            </button>
            <button
              onClick={() => router.push('/about?tab=people')}
              className="bg-transparent border-none text-[16px] sm:text-[18px] lg:text-[24px] font-bold text-neutral-1450 font-inter cursor-pointer p-0 pb-[10px] -mb-[10px] border-b-2 border-neutral-1450 transition-all duration-200 ease-in"
            >
              Our People
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="w-full pt-0 pb-[60px] sm:pb-[100px] px-[16px] sm:px-[40px] lg:px-[95.5px] bg-[#ffffffff]"
      >
        <div
          className="max-w-[1360px] mx-auto flex flex-col sm:flex-row gap-[40px] lg:gap-[80px] items-start w-full"
        >
          {/* Left Panel - Professor Image & Badge */}
          <ProfessorHeader professor={professor} />

          {/* Right Panel - Details */}
          <div
            className="flex flex-col gap-[20px] sm:gap-[30px] flex-1 pt-0 sm:pt-[100px] w-full sm:w-auto"
          >
            <ProfessorInfo professor={professor} />
            <ProfessorCourses courses={professor.courses} />
            <ProfessorBiography biography={professor.biography} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
