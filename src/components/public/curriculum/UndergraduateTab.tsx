'use client';

interface CourseCell {
  name: string;
  credit?: string;
  hasBackground?: boolean;
}

interface Semester {
  title: string;
  courses: CourseCell[];
}

const undergraduate: Semester[] = [
  {
    title: '1학년 1학기',
    courses: [
      { name: '기초드로잉', credit: '3' },
      { name: '타이포그래피기초', credit: '3' },
      { name: '영상의이해', credit: '3' },
    ],
  },
  {
    title: '1학년 2학기',
    courses: [
      { name: '색채학', credit: '3', hasBackground: true },
      { name: '일러스트레이션기초', credit: '3' },
      { name: '디지털이미지처리기초', credit: '3' },
      { name: '조형의기초', credit: '3' },
      { name: '커뮤니케이션디자인', credit: '3' },
    ],
  },
  {
    title: '2학년 1학기',
    courses: [
      { name: '그래픽디자인', credit: '3', hasBackground: true },
      { name: '웹디자인입문', credit: '3' },
      { name: '편집디자인', credit: '3' },
      { name: '사진학기초', credit: '3' },
      { name: '인터랙션디자인', credit: '3' },
      { name: '스튜디오I', credit: '3' },
      { name: '한국미술사', credit: '3' },
    ],
  },
  {
    title: '2학년 2학기',
    courses: [
      { name: '브랜드디자인', credit: '3', hasBackground: true },
      { name: '모션그래픽스', credit: '3' },
      { name: '영상편집', credit: '3' },
      { name: '사진학응용', credit: '3' },
      { name: '전시디자인', credit: '3' },
      { name: '스튜디오II', credit: '3' },
    ],
  },
];

export default function UndergraduateTab() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        width: '100%',
      }}
    >
      {/* Semester Grid - 2 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          width: '100%',
        }}
      >
        {undergraduate.map((semester, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Semester Title */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#000000ff',
                fontFamily: 'Pretendard',
                margin: '0',
              }}
            >
              {semester.title}
            </h3>

            {/* Courses List */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              {semester.courses.map((course, courseIndex) => (
                <div
                  key={courseIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '95px',
                    padding: '35px 0',
                    backgroundColor: course.hasBackground ? '#e8e8e8ff' : '#ffffffff',
                    borderTop: '1px solid #000000ff',
                    borderBottom: '1px solid #000000ff',
                    boxSizing: 'border-box',
                    gap: '10px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#000000ff',
                      fontFamily: 'Pretendard',
                      margin: '0',
                      textAlign: 'center',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {course.name}
                  </p>
                  {course.credit && (
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: '#7b828eff',
                        fontFamily: 'Pretendard',
                        margin: '0',
                      }}
                    >
                      {course.credit}학점
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
