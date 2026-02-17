'use client';

import { useResponsive } from '@/lib/responsive';
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
  const { isMobile, isTablet } = useResponsive();

  const sectionGap = isMobile ? '16px' : '20px';
  const columnGap = isMobile ? '8px' : '10px';
  const courseHeight = isMobile ? 'auto' : '95px';
  const coursePadding = isMobile ? '16px 0' : '35px 0';
  const courseFontSize = isMobile ? '14px' : '18px';
  const titleFontSize = isMobile ? '18px' : isTablet ? '19px' : '20px';
  const titleGap = isMobile ? '12px' : '20px';
  const titlePaddingBottom = isMobile ? '12px' : '20px';
  const courseDirection = isMobile ? 'column' : 'row';
  const courseWidth = isMobile ? '100%' : '50%';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: sectionGap,
        width: '100%',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: titlePaddingBottom,
          borderBottom: '3px solid #000000ff',
          width: '100%',
        }}
      >
        <h2
          style={{
            fontSize: titleFontSize,
            fontWeight: '700',
            color: '#1b1d1fff',
            fontFamily: 'Satoshi',
            margin: '0',
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Two Column Course Layout / Mobile Single Column */}
      <div
        style={{
          display: 'flex',
          flexDirection: courseDirection,
          justifyContent: 'space-between',
          gap: columnGap,
          width: '100%',
        }}
      >
        {/* Left Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sectionGap,
            flex: 1,
            width: courseWidth,
          }}
        >
          {section.leftCourses.map((course, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                height: courseHeight,
                padding: coursePadding,
                borderTop: '1px solid #000000ff',
                borderBottom: '1px solid #000000ff',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Course title */}
              <span
                style={{
                  fontSize: courseFontSize,
                  fontWeight: '500',
                  color: '#353030ff',
                  fontFamily: 'Pretendard',
                  wordBreak: 'keep-all',
                  lineHeight: isMobile ? 1.4 : 1.5,
                }}
              >
                {course.title}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: sectionGap,
            flex: 1,
            width: courseWidth,
          }}
        >
          {section.rightCourses.map((course, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                height: courseHeight,
                padding: coursePadding,
                borderTop: '1px solid #000000ff',
                borderBottom: '1px solid #000000ff',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Course title */}
              <span
                style={{
                  fontSize: courseFontSize,
                  fontWeight: '500',
                  color: '#353030ff',
                  fontFamily: 'Pretendard',
                  wordBreak: 'keep-all',
                  lineHeight: isMobile ? 1.4 : 1.5,
                }}
              >
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
  const { isMobile, isTablet } = useResponsive();

  // Use DB data if available, otherwise fall back to hardcoded defaults
  const displayMaster: CurriculumSection = content?.master
    ? { id: content.master.id ?? 'master', title: content.master.title, leftCourses: content.master.leftCourses, rightCourses: content.master.rightCourses }
    : masterCurriculum;
  const displayDoctor: CurriculumSection = content?.doctor
    ? { id: content.doctor.id ?? 'doctor', title: content.doctor.title, leftCourses: content.doctor.leftCourses, rightCourses: content.doctor.rightCourses }
    : doctorCurriculum;
  const displayTheses: ThesisCard[] = content?.theses ?? thesisCards;

  // Responsive variables
  const mainGap = isMobile ? '40px' : isTablet ? '70px' : '100px';
  const curriculumSectionGap = isMobile ? '32px' : isTablet ? '35px' : '40px';
  const thesisSectionGap = isMobile ? '16px' : '20px';
  const thesisHeaderPaddingBottom = isMobile ? '12px' : '20px';
  const thesisTitleFontSize = isMobile ? '18px' : isTablet ? '19px' : '20px';
  const thesisItemHeight = isMobile ? 'auto' : '95px';
  const thesisItemPadding = isMobile ? '16px 0' : '32px 0';
  const thesisCategoryMinWidth = isMobile ? 'auto' : '54px';
  const thesisItemGap = isMobile ? '8px' : '10px';
  const thesisTextFontSize = isMobile ? '14px' : '18px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: mainGap,
        width: '100%',
      }}
    >
      {/* SECTION 1: Master & Doctor Curriculum */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: curriculumSectionGap,
          width: '100%',
        }}
      >
        <div id="section-master">
          <CurriculumSectionComponent section={displayMaster} />
        </div>
        <div id="section-doctor">
          <CurriculumSectionComponent section={displayDoctor} />
        </div>
      </div>

      {/* SECTION 2: Graduation Thesis Cards */}
      <div
        id="section-thesis"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: thesisSectionGap,
          width: '100%',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: thesisHeaderPaddingBottom,
            borderBottom: '3px solid #000000ff',
            width: '100%',
          }}
        >
          <h2
            style={{
              fontSize: thesisTitleFontSize,
              fontWeight: '700',
              color: '#1b1d1fff',
              fontFamily: 'Satoshi',
              margin: '0',
            }}
          >
            Graduation thesis
          </h2>
        </div>

        {/* Thesis Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            width: '100%',
          }}
        >
          {displayTheses.map((thesis, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: thesisItemGap,
                height: thesisItemHeight,
                padding: thesisItemPadding,
                borderTop: '1px solid #000000ff',
                borderBottom: '1px solid #000000ff',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Category chip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: thesisCategoryMinWidth,
                  height: isMobile ? '24px' : '28px',
                  borderRadius: '4px',
                  padding: isMobile ? '2px 6px' : '4px 8px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: '500',
                    color: '#000000ff',
                    fontFamily: 'Satoshi',
                    letterSpacing: '-0.14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {thesis.category}
                </span>
              </div>

              {/* Title */}
              <span
                style={{
                  fontSize: thesisTextFontSize,
                  fontWeight: '500',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  lineHeight: isMobile ? 1.5 : 1.4,
                  flex: 1,
                  wordBreak: 'keep-all',
                }}
              >
                {thesis.title}
              </span>

              {/* Date */}
              <span
                style={{
                  fontSize: thesisTextFontSize,
                  fontWeight: '500',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {thesis.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
