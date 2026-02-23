'use client';

import type { GraduateContent } from '@/lib/validation/curriculum';

interface CourseItem {
  title: string;
}

interface CurriculumSection {
  id: string;
  title: string;
  leftCourses: CourseItem[];
  rightCourses: CourseItem[];
}

interface ThesisCard {
  category: string;
  title: string;
  date: string;
}

interface GraduateTabProps {
  content?: GraduateContent | null;
}

const masterCurriculum: CurriculumSection = {
  id: 'master',
  title: 'Master',
  leftCourses: [
    { title: '시각영상디자인' },
    { title: '시각영상디자인세미나' },
    { title: '시각영상디자인론' },
  ],
  rightCourses: [
    { title: '논문디자인&리서치' },
    { title: '디자인연구방법론' },
    { title: '논문연구' },
  ],
};

const doctorCurriculum: CurriculumSection = {
  id: 'doctor',
  title: 'Doctor',
  leftCourses: [
    { title: '뉴미디어컨텐츠디자인개발연구' },
    { title: '시각영상디자인론연구' },
    { title: '연구방법론세미나' },
  ],
  rightCourses: [
    { title: '시각영상디자인논문연구' },
    { title: '시각영상디자인스튜디오' },
    { title: '시각영상디자인세미나' },
  ],
};

const thesisCards: ThesisCard[] = [
  {
    category: 'UX/UI',
    title: 'AI 기반 3D 애니메이션 제작 기술의 프리 프로덕션 활용 연구',
    date: '2025 11.',
  },
  {
    category: 'UX/UI',
    title: '바이브 코딩 환경에서 디자이너의 역할 확장과 프로세스 재구',
    date: '2025. 11',
  },
  {
    category: 'UX/UI',
    title: '메타버스 상에서의 은둔형 외톨이 캐릭터 제작 연구',
    date: '2024. 10',
  },
  {
    category: 'UX/UI',
    title: '스타트업 UX 디자이너의 프로세스 분석을 통한 AI 활용 가능성 탐색',
    date: '2024. 07',
  },
  {
    category: 'UX/UI',
    title: '생성형 AI 도구를 활용한 게임 캐릭터 디자인 프로세스 연구',
    date: '2024. 06.',
  },
  {
    category: 'UX/UI',
    title: 'K-POP 및 C-POP 팝업스토어의 전략 차이 연구: 중국 Z세대의 소비 선호 분석을 바탕으로',
    date: '2024. 06',
  },
];

const CurriculumSectionComponent = ({ section }: { section: CurriculumSection }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      {/* Section Header */}
      <div className="flex flex-row justify-between items-center pb-3 sm:pb-5 border-b-[3px] border-neutral-1500 w-full">
        <h2 className="text-[18px] sm:text-[19px] lg:text-[20px] font-bold text-[#1b1d1f] font-satoshi my-0">
          {section.title}
        </h2>
      </div>

      {/* Two Column Course Layout / Mobile Single Column */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-[10px] w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-4 sm:gap-5 flex-1 w-full sm:w-1/2">
          {section.leftCourses.map((course, index) => (
            <div
              key={index}
              className="flex items-start sm:items-center h-auto sm:h-[95px] py-4 sm:py-[35px] border-t border-b border-neutral-1500 w-full box-border"
            >
              {/* Course title */}
              <span className="text-[14px] sm:text-[18px] font-medium text-[#353030] font-pretendard break-keep leading-[1.4] sm:leading-normal">
                {course.title}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 sm:gap-5 flex-1 w-full sm:w-1/2">
          {section.rightCourses.map((course, index) => (
            <div
              key={index}
              className="flex items-start sm:items-center h-auto sm:h-[95px] py-4 sm:py-[35px] border-t border-b border-neutral-1500 w-full box-border"
            >
              {/* Course title */}
              <span className="text-[14px] sm:text-[18px] font-medium text-[#353030] font-pretendard break-keep leading-[1.4] sm:leading-normal">
                {course.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function GraduateTab({ content }: GraduateTabProps) {
  // Use DB data if available, otherwise fall back to hardcoded defaults
  const displayMaster: CurriculumSection = content?.master
    ? { id: content.master.id ?? 'master', title: content.master.title, leftCourses: content.master.leftCourses, rightCourses: content.master.rightCourses }
    : masterCurriculum;
  const displayDoctor: CurriculumSection = content?.doctor
    ? { id: content.doctor.id ?? 'doctor', title: content.doctor.title, leftCourses: content.doctor.leftCourses, rightCourses: content.doctor.rightCourses }
    : doctorCurriculum;
  const displayTheses: ThesisCard[] = content?.theses ?? thesisCards;

  return (
    <div className="flex flex-col gap-10 sm:gap-[70px] lg:gap-[100px] w-full">
      {/* SECTION 1: Master & Doctor Curriculum */}
      <div className="flex flex-col gap-8 sm:gap-[35px] lg:gap-10 w-full">
        <div id="section-master">
          <CurriculumSectionComponent section={displayMaster} />
        </div>
        <div id="section-doctor">
          <CurriculumSectionComponent section={displayDoctor} />
        </div>
      </div>

      {/* SECTION 2: Graduation Thesis Cards */}
      <div id="section-thesis" className="flex flex-col gap-4 sm:gap-5 w-full">
        {/* Section Header */}
        <div className="flex flex-row justify-between pb-3 sm:pb-5 border-b-[3px] border-neutral-1500 w-full">
          <h2 className="text-[18px] sm:text-[19px] lg:text-[20px] font-bold text-[#1b1d1f] font-satoshi my-0">
            Graduation thesis
          </h2>
        </div>

        {/* Thesis Cards */}
        <div className="flex flex-col gap-0 w-full">
          {displayTheses.map((thesis, index) => (
            <div
              key={index}
              className="flex items-start sm:items-center flex-col sm:flex-row gap-2 sm:gap-[10px] h-auto sm:h-[95px] py-4 sm:py-8 border-t border-b border-neutral-1500 w-full box-border"
            >
              {/* Category chip */}
              <div className="flex items-center justify-center min-w-auto sm:min-w-[54px] h-6 sm:h-7 rounded-sm px-[6px] py-[2px] sm:px-2 sm:py-1 shrink-0">
                <span className="text-[12px] sm:text-[14px] font-medium text-neutral-1500 font-satoshi tracking-[-0.14px] whitespace-nowrap">
                  {thesis.category}
                </span>
              </div>

              {/* Title */}
              <span className="text-[14px] sm:text-[18px] font-medium text-neutral-1500 font-pretendard leading-normal sm:leading-[1.4] flex-1 break-keep">
                {thesis.title}
              </span>

              {/* Date */}
              <span className="text-[14px] sm:text-[18px] font-medium text-neutral-1500 font-pretendard whitespace-nowrap shrink-0">
                {thesis.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
