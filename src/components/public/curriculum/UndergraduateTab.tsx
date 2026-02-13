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

interface GraduateModule {
  name: string;
  track: string;
  courses: string;
  requirements: string;
  credits: string;
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

const undergraduateModules: GraduateModule[] = [
  {
    name: '모듈B',
    track: '브랜드 커뮤니케이션 디자인',
    courses: '타이포그래피디자인Ⅰ,Ⅱ\\n브랜드디자인Ⅰ,Ⅱ\\n광고디자인Ⅰ,Ⅱ\\n편집디자인Ⅰ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈C',
    track: 'UX 디자인',
    courses: '일러스트레이션과스토리텔링디자인Ⅰ,Ⅱ\\nAI컴퓨터디자인Ⅰ,Ⅱ\\n마케팅디자인Ⅰ\\n유튜브영상디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈D',
    track: '영상 디자인',
    courses: '기초그래픽디자인Ⅰ,Ⅱ\\n데이터시각화정보디자인Ⅰ,Ⅱ\\n디자인심리학\\n사용자정험디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈E',
    track: 'XR & 영상 디자인',
    courses: '기초영상디자인Ⅰ,Ⅱ\\n모션디자인Ⅰ,Ⅱ\\n에니메이션\\nAI메타버스디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
];

interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

const classificationOptions: FilterOption[] = [
  { label: '전공필수', value: 'required' },
  { label: '전공선택', value: 'elective' },
];

const trackOptions: FilterOption[] = [
  { label: '브랜드 커뮤니케이션 디자인', value: 'branding', color: '#489bffff' },
  { label: 'AI 디지털 마케팅 디자인', value: 'ai_marketing', color: '#ffcc54ff' },
  { label: 'UX 디자인', value: 'ux', color: '#ff5f5aff' },
  { label: 'XR & 영상 디자인', value: 'xr_video', color: '#a24affff' },
  { label: '공통과목', value: 'common', color: '#1abc9cff' },
];

export default function UndergraduateTab() {
  const [checkedClassification, setCheckedClassification] = useState<string>('required');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        width: '100%',
      }}
    >
      {/* SECTION 1: Semester Courses */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
        }}
      >
        {/* Filter Section */}
        <div
          style={{
            display: 'flex',
            gap: '60px',
            flexWrap: 'wrap',
            paddingBottom: '20px',
            borderBottom: '1px solid #e0e0e0ff',
            alignItems: 'flex-start',
          }}
        >
          {/* Classification Filter */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                fontWeight: '500',
                fontFamily: 'Pretendard',
                color: '#000000ff',
                margin: '0',
                whiteSpace: 'nowrap',
              }}
            >
              분류
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {classificationOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  color: '#000000ff',
                  margin: '0',
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedClassification === option.value}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedClassification(option.value);
                    }
                  }}
                  style={{
                    width: '14px',
                    height: '14px',
                    cursor: 'pointer',
                    accentColor: '#000000ff',
                  }}
                />
                {option.label}
              </label>
              ))}
            </div>
          </div>

          {/* Track Filter */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              alignItems: 'flex-start',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                fontWeight: '500',
                fontFamily: 'Pretendard',
                color: '#000000ff',
                margin: '0',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                width: '35px',
              }}
            >
              트랙
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, auto)',
                columnGap: '20px',
                rowGap: '20px',
              }}
            >
              {trackOptions.map((option) => (
                <div
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0',
                    borderRadius: '0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: option.color,
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: '500',
                      fontFamily: 'Pretendard',
                      color: '#000000ff',
                      margin: '0',
                      whiteSpace: 'nowrap',
                      wordBreak: 'keep-all',
                      lineHeight: 1.3,
                    }}
                  >
                    {option.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
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

      {/* SECTION 2: Track Information */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}
      >
        {/* Information Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Info Box 1 */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e0e0e0ff',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#4e535bff',
                fontFamily: 'Pretendard',
                margin: '0',
                width: '60px',
                flexShrink: 0,
              }}
            >
              트랙
            </p>
            <p
              style={{
                fontSize: '18px',
                fontWeight: '400',
                color: '#4e535bff',
                fontFamily: 'Pretendard',
                margin: '0',
                lineHeight: 1.6,
              }}
            >
              전공교육과정을 기반으로 한 전문 인재육성 교육커리큘럼, 진출분야 및 역량강화를 위한 모듈과 교과목으로 구성된 전공로드맵
            </p>
          </div>

          {/* Info Box 2 */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#4e535bff',
                fontFamily: 'Pretendard',
                margin: '0',
                width: '60px',
                flexShrink: 0,
              }}
            >
              모듈
            </p>
            <p
              style={{
                fontSize: '18px',
                fontWeight: '400',
                color: '#4e535bff',
                fontFamily: 'Pretendard',
                margin: '0',
                lineHeight: 1.6,
              }}
            >
              공통된 주제의 교과목으로 구성된 집합체
            </p>
          </div>
        </div>

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

        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 0.8fr',
            gap: '0',
            width: '100%',
            marginBottom: '0',
          }}
        >
          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '500',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'center',
            }}
          >
            트랙
          </div>
          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '500',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'center',
            }}
          >
            해당과목
          </div>
          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '500',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'center',
            }}
          >
            이수기준
          </div>
          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '500',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'center',
            }}
          >
            기초학점
          </div>
        </div>

        {/* Table Rows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {undergraduateModules.map((module, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1fr 0.8fr',
                gap: '0',
                alignItems: 'start',
                minHeight: '140px',
                padding: '20px 0',
                borderBottom: '1px solid #000000ff',
                boxSizing: 'border-box',
              }}
            >
              {/* Track Name */}
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                  lineHeight: 1.6,
                }}
              >
                {module.name}
                <br />
                {module.track}
              </p>

              {/* Courses */}
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#353030ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                  lineHeight: 1.6,
                }}
              >
                {module.courses}
              </p>

              {/* Requirements */}
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#353030ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                  lineHeight: 1.6,
                }}
              >
                {module.requirements}
              </p>

              {/* Credits */}
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'center',
                }}
              >
                {module.credits}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
