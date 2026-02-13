'use client';

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

const CurriculumSectionComponent = ({ section }: { section: CurriculumSection }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
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
        paddingBottom: '20px',
        borderBottom: '3px solid #000000ff',
        width: '100%',
      }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1b1d1fff',
          fontFamily: 'Satoshi',
          margin: '0',
        }}
      >
        {section.title}
      </h2>
    </div>

    {/* Two Column Course Layout */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '10px',
        width: '100%',
      }}
    >
      {/* Left Column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          flex: 1,
          width: '50%',
        }}
      >
        {section.leftCourses.map((course, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '95px',
              padding: '35px 0',
              borderTop: '1px solid #000000ff',
              borderBottom: '1px solid #000000ff',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Course title */}
            <span
              style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#353030ff',
                fontFamily: 'Pretendard',
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
          gap: '20px',
          flex: 1,
          width: '50%',
        }}
      >
        {section.rightCourses.map((course, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '95px',
              padding: '35px 0',
              borderTop: '1px solid #000000ff',
              borderBottom: '1px solid #000000ff',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Course title */}
            <span
              style={{
                fontSize: '18px',
                fontWeight: '500',
                color: '#353030ff',
                fontFamily: 'Pretendard',
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

export default function GraduateTab() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '100px',
        width: '100%',
      }}
    >
      {/* SECTION 1: Master & Doctor Curriculum */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%',
        }}
      >
        <CurriculumSectionComponent section={masterCurriculum} />
        <CurriculumSectionComponent section={doctorCurriculum} />
      </div>

      {/* SECTION 2: Graduation Thesis Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: '20px',
            borderBottom: '3px solid #000000ff',
            width: '100%',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
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
          {thesisCards.map((thesis, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '95px',
                padding: '32px 0',
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
                  minWidth: '54px',
                  height: '28px',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#000000ff',
                    fontFamily: 'Satoshi',
                    letterSpacing: '-0.14px',
                  }}
                >
                  {thesis.category}
                </span>
              </div>

              {/* Title */}
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  lineHeight: '1.4',
                  flex: 1,
                }}
              >
                {thesis.title}
              </span>

              {/* Date */}
              <span
                style={{
                  fontSize: '18px',
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
