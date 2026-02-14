'use client';

import { useState } from 'react';
import {
  semesters,
  undergraduateModules,
  moduleDetails,
  classificationOptions,
  trackOptions,
  type UndergraduateModule,
} from '@/data/curriculum/undergraduate';
import CurriculumFooterNote from './CurriculumFooterNote';

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
          {undergraduateModules.map((module: UndergraduateModule, index) => {
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
                  {String(module.courses).replace(/\\n/g, '\n')}
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

      <CurriculumFooterNote
        href="https://www.sookmyung.ac.kr/kr/university-life/curriculum01.do"
        text="[숙명여자대학교 홈페이지]-[대학생활]-[학사정보]-[교육과정]"
      />
    </div>
  );
}
