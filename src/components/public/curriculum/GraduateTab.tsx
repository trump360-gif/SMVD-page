'use client';

interface GraduateCourse {
  name: string;
  credit?: string;
  track: string;
  hasBackground?: boolean;
}

const graduateCourses: GraduateCourse[] = [
  { name: '디자인세미나', credit: '3', track: 'UX/UI Track', hasBackground: true },
  { name: '고급그래픽디자인', credit: '3', track: 'Visual Design Track' },
  { name: '인터랙션설계', credit: '3', track: 'UX/UI Track' },
  { name: '브랜드전략세미나', credit: '3', track: 'Brand Track', hasBackground: true },
  { name: '모션영상심화', credit: '3', track: 'Motion Track' },
  { name: '디지털콘텐츠제작', credit: '3', track: 'Content Track', hasBackground: true },
  { name: '디자인리서치방법론', credit: '3', track: 'Research Track' },
  { name: '전시공간디자인', credit: '3', track: 'Spatial Design Track' },
];

export default function GraduateTab() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
      }}
    >
      {/* Section Title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: '20px',
          borderBottom: '3px solid #000000ff',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1b1d1fff',
            fontFamily: 'Pretendard',
            margin: '0',
          }}
        >
          트랙별 과목 및 이수기준
        </h2>
      </div>

      {/* Graduate Courses Table */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {graduateCourses.map((course, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.2fr 1fr',
              alignItems: 'center',
              minHeight: '95px',
              padding: '35px 20px',
              backgroundColor: course.hasBackground ? '#e8e8e8ff' : '#ffffffff',
              borderTop: '1px solid #000000ff',
              borderBottom: '1px solid #000000ff',
              boxSizing: 'border-box',
              gap: '20px',
            }}
          >
            {/* Course Name */}
            <p
              style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#000000ff',
                fontFamily: 'Pretendard',
                margin: '0',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all',
              }}
            >
              {course.name}
            </p>

            {/* Credit */}
            {course.credit && (
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#7b828eff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'center',
                }}
              >
                {course.credit}
              </p>
            )}

            {/* Track */}
            <p
              style={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#353030ff',
                fontFamily: 'Pretendard',
                margin: '0',
                textAlign: 'right',
                whiteSpace: 'pre-wrap',
                wordBreak: 'keep-all',
              }}
            >
              {course.track}
            </p>
          </div>
        ))}
      </div>

      {/* Requirements Info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '20px',
          backgroundColor: '#f5f5f5ff',
          borderRadius: '4px',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#000000ff',
            fontFamily: 'Pretendard',
            margin: '0',
          }}
        >
          수료 기준
        </p>
        <ul
          style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '14px',
            fontWeight: '400',
            color: '#353030ff',
            fontFamily: 'Pretendard',
            lineHeight: 1.6,
          }}
        >
          <li>총 36학점 이상 이수</li>
          <li>필수과목 3학점 (디자인세미나) 포함</li>
          <li>선택 과목 최소 2개 트랙 이상 수강</li>
          <li>학위논문 또는 졸업 프로젝트 필수</li>
        </ul>
      </div>
    </div>
  );
}
