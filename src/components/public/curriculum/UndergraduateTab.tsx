'use client';

import { useState } from 'react';

interface Course {
  name: string;
  color: string;
}

interface Semester {
  year: number;
  term: number;
  courses: Course[];
}

const semesters: Semester[] = [
  {
    year: 1,
    term: 1,
    courses: [
      { name: '기초그래픽디자인I', color: '#ff5f5aff' },
      { name: '기초영상디자인I', color: '#ffcc54ff' },
      { name: '일러스트레이션과스토리텔링디자인 I', color: '#a24affff' },
    ],
  },
  {
    year: 1,
    term: 2,
    courses: [
      { name: '기초그래픽디자인II', color: '#ff5f5aff' },
      { name: '기초영상디자인II', color: '#ffcc54ff' },
      { name: '일러스트레이션과스토리텔링디자인 II', color: '#a24affff' },
      { name: '조형의기초', color: '#53c9ffff' },
      { name: '커뮤니케이션디자인', color: '#70d970ff' },
    ],
  },
  {
    year: 2,
    term: 1,
    courses: [
      { name: '그래픽디자인I', color: '#1e90ffff' },
      { name: '웹디자인입문I', color: '#ff6b9dff' },
      { name: '편집디자인I', color: '#ffa500ff' },
      { name: '사진학기초', color: '#32cd32ff' },
      { name: '인터랙션디자인I', color: '#ff1493ff' },
      { name: '스튜디오I', color: '#4b0082ff' },
      { name: '한국미술사', color: '#8b4513ff' },
    ],
  },
  {
    year: 2,
    term: 2,
    courses: [
      { name: '브랜드디자인II', color: '#0047abff' },
      { name: '모션그래픽스', color: '#ffd700ff' },
      { name: '영상편집', color: '#ff69b4ff' },
      { name: '사진학응용', color: '#00ced1ff' },
      { name: '전시디자인', color: '#ff8c00ff' },
      { name: '스튜디오II', color: '#800080ff' },
    ],
  },
  {
    year: 3,
    term: 1,
    courses: [
      { name: '광고디자인I', color: '#dc143cff' },
      { name: '사용자경험디자인I', color: '#228b22ff' },
      { name: '판화디자인I', color: '#4169e1ff' },
      { name: '유튜브영상디자인I', color: '#ff4500ff' },
      { name: 'AI메타버스디자인I', color: '#9932ccff' },
      { name: '졸업프로젝트스튜디오 I', color: '#20b2aaff' },
      { name: '마케팅디자인', color: '#ff6347ff' },
    ],
  },
  {
    year: 3,
    term: 2,
    courses: [
      { name: '광고디자인II', color: '#dc143cff' },
      { name: '사용자경험디자인II', color: '#228b22ff' },
      { name: '판화디자인II', color: '#4169e1ff' },
      { name: '유튜브영상디자인II', color: '#ff4500ff' },
      { name: 'AI메타버스디자인II', color: '#9932ccff' },
      { name: '졸업프로젝트스튜디오 II', color: '#20b2aaff' },
    ],
  },
  {
    year: 4,
    term: 1,
    courses: [
      { name: '글임프로젝트스튜디오 I', color: '#00ff7fff' },
      { name: '졸업프로젝트스튜디오 I', color: '#20b2aaff' },
    ],
  },
  {
    year: 4,
    term: 2,
    courses: [
      { name: '졸업프로젝트스튜디오 II', color: '#20b2aaff' },
      { name: '애니메이션', color: '#ff69b4ff' },
    ],
  },
];

export default function UndergraduateTab() {
  const [, ] = useState<string>('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        width: '100%',
      }}
    >
      {/* Filter Section */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          paddingBottom: '20px',
          borderBottom: '1px solid #e0e0e0ff',
        }}
      >
        <button
          style={{
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Pretendard',
            color: '#141414ff',
            backgroundColor: '#ffffffff',
            border: '1px solid #141414ff',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          분류
        </button>
        <button
          style={{
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'Pretendard',
            color: '#141414ff',
            backgroundColor: '#ffffffff',
            border: '1px solid #141414ff',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          트랙
        </button>
      </div>

      {/* Semesters Grid - 4 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          width: '100%',
        }}
      >
        {semesters.map((semester, index) => (
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
                fontWeight: '500',
                color: '#000000ff',
                fontFamily: 'Pretendard',
                margin: '0',
              }}
            >
              {semester.year}학년 {semester.term}학기
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
                    gap: '10px',
                    height: '95px',
                    padding: '35px 0',
                    backgroundColor: '#ffffffff',
                    borderTop: '1px solid #000000ff',
                    borderBottom: '1px solid #000000ff',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Color Tag */}
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      backgroundColor: course.color,
                      flexShrink: 0,
                      marginLeft: '10px',
                    }}
                  />

                  {/* Course Name */}
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#353030ff',
                      fontFamily: 'Pretendard',
                      margin: '0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'keep-all',
                      lineHeight: 1.4,
                    }}
                  >
                    {course.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
