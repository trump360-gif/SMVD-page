'use client';

import { useState } from 'react';

interface Course {
  name: string;
  color: string;
  classification?: 'required' | 'elective';
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
      { name: '기초그래픽디자인I', color: '#ff5f5aff', classification: 'elective' },
      { name: '기초영상디자인I', color: '#ffcc54ff', classification: 'elective' },
      { name: '일러스트레이션과스토리텔링디자인 I', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 1,
    term: 2,
    courses: [
      { name: '기초그래픽디자인II', color: '#ff5f5aff', classification: 'required' },
      { name: '기초영상디자인II', color: '#ffcc54ff', classification: 'elective' },
      { name: '일러스트레이션과스토리텔링디자인 II', color: '#a24affff', classification: 'elective' },
      { name: '타이포그래피디자인I', color: '#53c9ffff', classification: 'elective' },
      { name: '디자인과문화', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 2,
    term: 1,
    courses: [
      { name: 'AI창업디자인I', color: '#ffcc54ff', classification: 'required' },
      { name: '브랜드디자인I', color: '#1e90ffff', classification: 'elective' },
      { name: '데이터시각화와정보보디자인I', color: '#ff6b9dff', classification: 'elective' },
      { name: '모션디자인I', color: '#a24affff', classification: 'elective' },
      { name: '애니메이션I', color: '#32cd32ff', classification: 'elective' },
      { name: '타이포그래피디자인I', color: '#1e90ffff', classification: 'elective' },
      { name: '마케팅디자인', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 2,
    term: 2,
    courses: [
      { name: 'AI창업디자인II', color: '#ffcc54ff', classification: 'required' },
      { name: '브랜드디자인II', color: '#1e90ffff', classification: 'elective' },
      { name: '데이터시각화와정보보디자인II', color: '#ff6b9dff', classification: 'elective' },
      { name: '모션디자인III', color: '#a24affff', classification: 'elective' },
      { name: '애니메이션II', color: '#32cd32ff', classification: 'elective' },
      { name: '디자인심리학', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 3,
    term: 1,
    courses: [
      { name: '광고디자인I', color: '#1e90ffff', classification: 'required' },
      { name: '사용자경험디자인I', color: '#ff5f5aff', classification: 'required' },
      { name: '편집디자인I', color: '#70d970ff', classification: 'elective' },
      { name: '유튜브영상디자인I', color: '#ffcc54ff', classification: 'elective' },
      { name: 'AI메타버스디자인I', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 3,
    term: 2,
    courses: [
      { name: '광고디자인II', color: '#1e90ffff', classification: 'required' },
      { name: '사용자경험디자인II', color: '#ff5f5aff', classification: 'required' },
      { name: '편집디자인II', color: '#70d970ff', classification: 'elective' },
      { name: '유튜브영상디자인II', color: '#ffcc54ff', classification: 'elective' },
      { name: 'AI메타버스디자인II', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 4,
    term: 1,
    courses: [
      { name: '졸업프로젝트스튜디오 I', color: '#20b2aaff', classification: 'required' },
    ],
  },
  {
    year: 4,
    term: 2,
    courses: [
      { name: '졸업프로젝트스튜디오 II', color: '#20b2aaff', classification: 'required' },
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
    track: 'AI 디지털 마케팅 디자인',
    courses: '일러스트레이션과스토리텔링디자인Ⅰ,Ⅱ\\nAI창업디자인Ⅰ,Ⅱ\\n마케팅디자인\\n유튜브영상디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈D',
    track: 'UX 디자인',
    courses: '기초그래픽디자인Ⅰ,Ⅱ\\n데이터시각화와정보디자인Ⅰ,Ⅱ\\n디자인심리학\\n사용자경험디자인Ⅰ,Ⅱ',
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

interface ModuleDetail {
  module: string;
  title: string;
  description: string;
  courses: string;
}

const moduleDetails: ModuleDetail[] = [
  {
    module: '모듈 A',
    title: '브랜드 디자인',
    description: '시각디자인의 기본이되는 그래픽 커뮤니케이션 영역으로, 국내외 사례 및 현 디자인의 트랜드를 이해하고 프로젝트에 맞는 창의적 아이디어를 도출하여 자기화한다. 향후 각자의 진로 방향을 모색하여 디자인프로세스를 배우고 포트폴리오화 시키는 과정이다.',
    courses: '브랜드디자인I, II\n광고디자인I, II',
  },
  {
    module: '모듈 B',
    title: '브랜드 커뮤니케이션 디자인',
    description: '인스타, 유튜브 중심의 개인이 발신하는 SNS가 시각영상의 핵심으로 AI를 활용하여 자신을 브랜딩하고 크리에이티브한 마케팅 컨텐츠 제작을 연구한다.',
    courses: 'AI창업디자인I, II\n유튜브영상디자인I, II',
  },
  {
    module: '모듈 C',
    title: 'UX 디자인',
    description: '데이터 수집, 분석을 통한 데이터 시각화와 정보 디자인을 통하여 데이터 주도 디자인의 기초를 다진다. 이 위에 디자인 사고를 바탕으로하는 AI를 접목한 사용자 경험 디자인 프로세스로 구현 되는 서비스 및 제품 컨텐츠를 웹, 모바일, 스마트 기기, 게임, 메타버스 등의 새로운 미디어 상의 UX / UI / 인터랙션 디자인하는 능력을 갖춘다.',
    courses: '데이터시각화정보디자인I, II\n사용자경험디자인I, II',
  },
  {
    module: '모듈 D',
    title: '영상 디자인',
    description: '기초 영상디자인부터 모션디자인 심화까지 단계적으로 다루며, 국내·외 사례 분석과 프로젝트 중심 수업을 통해 현대 영상과 모션디자인의 흐름을 이해하고 창의적 문제 해결 능력을 기른다. 학생은 자신만의 시각 언어를 구축하고 포트폴리오로 확장할 수 있는 실무 기반 학습을 받는다.',
    courses: '기초영상디자인I, II\n모션디자인I, II',
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
                  disabled
                  style={{
                    appearance: 'none',
                    width: '14px',
                    height: '14px',
                    cursor: 'not-allowed',
                    backgroundColor: checkedClassification === option.value ? '#d0d0d0ff' : '#ffffffff',
                    border: '1px solid #ccc',
                    borderRadius: '2px',
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
            rowGap: '60px',
            width: '100%',
            gridAutoRows: '1fr',
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
                {semester.courses.map((course, courseIndex) => {
                  const isMatchedClassification = course.classification === checkedClassification;
                  return (
                  <div
                    key={courseIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '95px',
                      padding: '35px 0',
                      backgroundColor: isMatchedClassification ? '#f0f0f0ff' : '#ffffffff',
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
                );
                })}
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
          gap: '0px',
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

        {/* Information Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            marginTop: '40px',
          }}
        >
          {/* Info Box 1 */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              paddingBottom: '20px',
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

        {/* First Table Header (Track Table) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr',
            gap: '20px',
            width: '100%',
            marginBottom: '0',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              padding: '0px 0 4px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            트랙명
          </div>
          <div
            style={{
              padding: '0px 0 4px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            해당과목
          </div>
          <div
            style={{
              padding: '0px 0 4px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            이수기준
          </div>
          <div
            style={{
              padding: '0px 0 4px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            기준학점
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
          {undergraduateModules.map((module, index) => {
            const colors = ['#489bffff', '#ffcc54ff', '#ff5f5aff', '#a24affff'];
            const moduleColor = colors[index % colors.length];

            return (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr',
                gap: '20px',
                alignItems: 'center',
                minHeight: '80px',
                borderBottom: '1px solid #000000ff',
                borderTop: '1px solid #000000ff',
                boxSizing: 'border-box',
              }}
            >
              {/* Track Name with Color Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  height: '100%',
                  padding: '20px 12px',
                  borderRight: 'none',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: moduleColor,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    lineHeight: 1.6,
                  }}
                >
                  {module.track}
                </p>
              </div>

              {/* Courses */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  height: '100%',
                  padding: '20px 12px',
                  borderRight: 'none',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    lineHeight: 1.6,
                  }}
                >
                  {module.courses.replace(/\\n/g, '\n')}
                </p>
              </div>

              {/* Requirements */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: '100%',
                  padding: '20px 12px',
                  borderRight: 'none',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                  }}
                >
                  {module.requirements}
                </p>
              </div>

              {/* Credits */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: '100%',
                  padding: '20px 12px',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                  }}
                >
                  {module.credits}
                </p>
              </div>
            </div>
          );
          })}
        </div>

        {/* Module Details Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr 1fr',
            gap: '0',
            width: '100%',
            marginBottom: '0',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            구분
          </div>
          <div
            style={{
              padding: '12px 0 12px 12px',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            설명
          </div>
          <div
            style={{
              padding: '12px 0 12px 12px',
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            해당과목
          </div>
        </div>

        {/* Module Details Rows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {moduleDetails.map((detail, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr 1fr',
                gap: '0',
                alignItems: 'center',
                minHeight: '150px',
                borderBottom: '1px solid #000000ff',
                borderTop: '1px solid #000000ff',
                boxSizing: 'border-box',
              }}
            >
              {/* Module & Title */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '0px 0px',
                  height: '100%',
                  gap: '8px',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#000000ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                  }}
                >
                  {detail.module}
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#000000ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                  }}
                >
                  {detail.title}
                </p>
              </div>

              {/* Description */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '0px 12px',
                  height: '100%',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                    lineHeight: 1.5,
                  }}
                >
                  {detail.description}
                </p>
              </div>

              {/* Courses */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '0px 12px',
                  height: '100%',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'keep-all',
                    lineHeight: 1.6,
                  }}
                >
                  {detail.courses}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note - Right aligned, above footer */}
      <div
        style={{
          textAlign: 'right',
          marginTop: '-60px',
          padding: '0',
        }}
      >
        <p
          style={{
            fontSize: '16px',
            fontWeight: '400',
            color: '#666666',
            fontFamily: 'Pretendard',
            margin: '0',
            lineHeight: 1,
            padding: '0',
          }}
        >
          *[숙명여자대학교 홈페이지]-[대학생활]-[학사정보]-[교육과정] 에서 확인 가능
        </p>
      </div>
    </div>
  );
}
