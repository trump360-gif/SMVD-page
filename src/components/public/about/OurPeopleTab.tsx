'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useResponsive } from '@/lib/responsive';

interface Professor {
  id: string;
  name: string;
  title: string;
  office?: string;
  email: string[];
  phone?: string;
  badge?: string;
  courses?: {
    undergraduate: string[];
    graduate: string[];
  };
  profileImage?: string;
}

interface Instructor {
  name: string;
  specialty: string;
}

interface OurPeopleTabProps {
  professors?: Professor[];
  instructors?: Instructor[];
}

const defaultProfessors: Professor[] = [
  {
    id: 'yun',
    name: '윤여종',
    title: '정교수',
    email: ['yyj@sookmyung.ac.kr'],
    phone: '+82-2-710-9682',
    badge: 'Research & Mentoring',
    courses: {
      undergraduate: ['브랜드디자인'],
      graduate: ['졸업프로젝트스튜디오 I/II'],
    },
    profileImage: '/images/people/yun-yeojong.png',
  },
  {
    id: 'kim',
    name: '김기영',
    title: '정교수',
    email: ['kiyoungkim@sookmyung.ac.kr'],
    phone: '+82-2-710-9683',
    badge: 'Vision & Marketing',
    courses: {
      undergraduate: ['마케팅디자인'],
      graduate: ['졸업프로젝트스튜디오 I/II'],
    },
    profileImage: '/images/people/kim-kiyoung.png',
  },
  {
    id: 'lee',
    name: '이지선',
    title: '정교수',
    email: ['jisun.lee@sookmyung.ac.kr'],
    phone: '+82-2-710-9684',
    badge: 'User Experience',
    courses: {
      undergraduate: ['사용자경험디자인'],
      graduate: ['졸업프로젝트스튜디오 I/II'],
    },
    profileImage: '/images/people/lee-jisun.png',
  },
  {
    id: 'na',
    name: '나유미',
    title: '정교수',
    email: ['youmi.na@sookmyung.ac.kr'],
    phone: '+82-2-710-9685',
    badge: 'User Experience',
    courses: {
      undergraduate: ['사용자경험디자인'],
      graduate: ['졸업프로젝트스튜디오 I/II'],
    },
    profileImage: '/images/people/na-youmi.png',
  },
];

const defaultInstructors: Instructor[] = [
  { name: '김아영', specialty: '기초그래픽디자인I' },
  { name: '신지영', specialty: '일러스트레이션과스토리텔링디자인 I/II' },
  { name: '최한솔', specialty: '기초그래픽디자인 I/II, 일러스트레이션과스토리텔링디자인 I/II' },
  { name: '전혜원', specialty: '일러스트레이션과스토리텔링디자인 I/II' },
  { name: '정승희', specialty: '일러스트레이션과스토리텔링디자인 I/II' },
  { name: '허주연', specialty: '기초그래픽디자인 I/II' },
  { name: '김태룡', specialty: '타이포그래피디자인 I/II' },
  { name: '권혁준', specialty: '브랜드디자인 I/II' },
  { name: '김연지', specialty: '사용자경험디자인 I/II' },
  { name: '이주형', specialty: '사용자경험디자인 I/II' },
  { name: '김도운', specialty: '사용자경험디자인 I/II' },
  { name: '장다윤', specialty: '모션디자인 I/II' },
];

export default function OurPeopleTab({
  professors = defaultProfessors,
  instructors = defaultInstructors,
}: OurPeopleTabProps) {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();

  const handleProfessorClick = (profId: string) => {
    router.push(`/professor/${profId}`);
  };

  // -- Responsive values --
  const sectionGap = isMobile ? '30px' : isTablet ? '40px' : '60px';
  const sectionPaddingBottom = isMobile ? '30px' : isTablet ? '40px' : '60px';
  const headingFontSize = isMobile ? '28px' : isTablet ? '36px' : '48px';
  const headingWidth = isMobile ? '100%' : isTablet ? '150px' : '333px';
  const headingFlexShrink = isMobile ? undefined : 0;
  const profSectionDirection = isMobile ? 'column' : 'row' as const;
  const profListGap = isMobile ? '24px' : isTablet ? '12px' : '20px';
  const profListWrap = isMobile ? 'wrap' : isTablet ? 'wrap' : 'nowrap' as const;
  const cardWidth = isMobile ? '100%' : isTablet ? '160px' : '236px';
  const cardFlexShrink = isMobile ? undefined : 0;
  const imageHeight = isMobile ? '300px' : isTablet ? '240px' : '356px';
  const imageSizes = isMobile ? '100vw' : isTablet ? '160px' : '236px';
  const infoPadding = isMobile ? '20px 16px 0 16px' : isTablet ? '20px 12px 0 12px' : '37px 30px 0 30px';
  const profNameFontSize = isMobile ? '16px' : '18px';
  const profCourseFontSize = isMobile ? '14px' : '18px';
  const profCourseMarginTop = isMobile ? '12px' : '20px';

  // Instructor responsive
  const instrSectionDirection = isMobile ? 'column' : 'row' as const;
  const instrNameWidth = isMobile ? 'auto' : isTablet ? '200px' : '332px';
  const instrNameFlexShrink = isMobile ? undefined : 0;
  const instrGap = isMobile ? '8px' : isTablet ? '24px' : '40px';
  const instrDirection = isMobile ? 'column' : 'row' as const;
  const instrPaddingY = isMobile ? '20px' : isTablet ? '28px' : '34px';
  const instrMinHeight = isMobile ? 'auto' : '95px';
  const instrFontSize = isMobile ? '15px' : '18px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: sectionGap,
        width: '100%',
      }}
    >
      {/* Professor Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: profSectionDirection,
          gap: isMobile ? '20px' : '10px',
          alignItems: 'flex-start',
          width: '100%',
          paddingBottom: sectionPaddingBottom,
          borderBottom: '1px solid #000000ff',
        }}
      >
        <h2
          style={{
            fontSize: headingFontSize,
            fontWeight: '400',
            color: '#000000ff',
            fontFamily: 'Helvetica',
            margin: '0',
            letterSpacing: '-0.48px',
            width: headingWidth,
            flexShrink: headingFlexShrink,
          }}
        >
          Professor
        </h2>

        {/* Professor List - Desktop 4col / Tablet 2col / Mobile 1col */}
        <div
          style={{
            display: 'flex',
            flexWrap: profListWrap,
            gap: profListGap,
            flex: 1,
            width: isMobile ? '100%' : undefined,
          }}
        >
          {professors.map((prof) => (
            <div
              key={prof.id}
              onClick={() => handleProfessorClick(prof.id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                width: cardWidth,
                flexShrink: cardFlexShrink,
                flexBasis: isTablet ? 'calc(50% - 6px)' : undefined,
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Image Container */}
              <div
                style={{
                  cursor: 'pointer',
                  position: 'relative',
                  width: '100%',
                  height: imageHeight,
                  backgroundColor: '#ffffff',
                  borderRadius: '0px',
                  overflow: 'hidden',
                  border: 'none',
                }}
              >
                {prof.profileImage ? (
                  <Image
                    src={prof.profileImage}
                    alt={prof.name}
                    fill
                    sizes={imageSizes}
                    style={{
                      objectFit: 'cover',
                    }}
                    priority={false}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#e5e5e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Info Container */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                  backgroundColor: '#ffffff',
                  padding: infoPadding,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <h3
                  style={{
                    fontSize: profNameFontSize,
                    fontWeight: '400',
                    color: '#000000ff',
                    fontFamily: 'Helvetica',
                    margin: '0',
                    letterSpacing: '-0.18px',
                    lineHeight: 1.5,
                  }}
                >
                  {prof.name}
                </h3>
                {prof.courses && (
                  <p
                    style={{
                      fontSize: profCourseFontSize,
                      fontWeight: '400',
                      color: '#353030ff',
                      fontFamily: 'Helvetica',
                      margin: `${profCourseMarginTop} 0 0 0`,
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'keep-all',
                    }}
                  >
                    {prof.courses.undergraduate?.join('\n') ||
                      prof.courses.graduate?.join('\n') ||
                      ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: instrSectionDirection,
          gap: isMobile ? '20px' : '10px',
          alignItems: 'flex-start',
          width: '100%',
          paddingBottom: sectionPaddingBottom,
        }}
      >
        <h2
          style={{
            fontSize: headingFontSize,
            fontWeight: '400',
            color: '#000000ff',
            fontFamily: 'Helvetica',
            margin: '0',
            letterSpacing: '-0.48px',
            width: headingWidth,
            flexShrink: headingFlexShrink,
          }}
        >
          Instructor
        </h2>

        {/* Instructor List - 1 column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            width: isMobile ? '100%' : undefined,
          }}
        >
          {instructors.map((instructor, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: instrDirection,
                gap: instrGap,
                alignItems: isMobile ? 'flex-start' : 'center',
                paddingBottom: instrPaddingY,
                paddingTop: instrPaddingY,
                borderBottom: '1px solid #e5e5e5ff',
                backgroundColor: '#ffffffff',
                minHeight: instrMinHeight,
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  fontSize: instrFontSize,
                  fontWeight: isMobile ? '500' : '400',
                  color: '#353030ff',
                  fontFamily: 'Helvetica',
                  margin: '0',
                  width: instrNameWidth,
                  flexShrink: instrNameFlexShrink,
                }}
              >
                {instructor.name}
              </h3>
              <p
                style={{
                  fontSize: isMobile ? '14px' : instrFontSize,
                  fontWeight: '400',
                  color: isMobile ? '#666666' : '#353030ff',
                  fontFamily: 'Helvetica',
                  margin: '0',
                  lineHeight: 1.4,
                }}
              >
                {instructor.specialty}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
