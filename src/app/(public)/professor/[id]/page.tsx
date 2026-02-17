'use client';

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/public/home';
import { useResponsive } from '@/lib/responsive';

interface Professor {
  id: string;
  name: string;
  badge: string;
  office: string;
  email: string[];
  phone: string;
  homepage?: string;
  courses: {
    undergraduate: string[];
    graduate: string[];
  };
  biography: {
    cvText: string;
    position: string;
    education: string[];
    experience: string[];
  };
  profileImage: string;
}

const professorsData: Record<string, Professor> = {
  yun: {
    id: 'yun',
    name: '윤여종',
    badge: 'Brand & Advertising',
    office: '미술대학 711호',
    email: ['zoneidea@sookmyung.ac.kr', 'h7023@hanmail.net'],
    phone: '02-710-9688',
    courses: {
      undergraduate: ['브랜드디자인', '광고디자인', '졸업프로젝트스튜디오'],
      graduate: ['시각영상디자인'],
    },
    biography: {
      cvText: 'CV 다운로드',
      position: '숙명여자대학교 시각영상디자인학과 교수',
      education: [
        '• 홍익대학교 시각디자인과 및 동대학원 졸업',
        '• 대한민국 디자인전람회 초대디자이너',
      ],
      experience: [
        '• 평창동계올림픽/패럴림픽 예술포스터 수상',
        '• 대한민국 관광포스터 공모전 대통령상 수상',
        '• 한국방송 광고공사 광고공모전 대상 수상',
        '• 대한민국 디자인 전람회 산업자원부 장관상 수상',
        '• Asia Graphic Poster Triennale Best Designer',
        '• VIDAK 한국시각정보디자인협회 수석부회장 역임',
        '• KSBDA 한국기초조형학회 부회장 역임',
      ],
    },
    profileImage: '/images/people/yun-yeojong.png',
  },
  kim: {
    id: 'kim',
    name: '김기영',
    badge: 'Video & Marketing',
    office: '미술대학 702호',
    email: ['juice@sookmyung.ac.kr'],
    phone: '02-710-9683',
    homepage: 'https://smvd.sookmyung.ac.kr/?page_id=1033',
    courses: {
      undergraduate: ['영상콘텐츠디자인', '유튜브영상디자인', '졸업프로젝트스튜디오'],
      graduate: ['시각영상디자인'],
    },
    biography: {
      cvText: 'CV 다운로드',
      position: '숙명여자대학교 시각·영상디자인학과 교수',
      education: [
        '• 일본 무사시노미술대학 시각영상디자인학과 졸업',
        '• 일본 다마미술대학 대학원 미술연구과 영상 졸업',
      ],
      experience: [
        '• (주)제일기획 19기 공채입사',
        '• 삼성전자, 풀무원, 맥심커피 업무수행',
        '• (주) 하쿠호도제일 입사',
        '• SPC그룹 파리바게트 디자인고문',
        '• 국가브랜드 위원회, 정부통합디자인 GI(Government Identity) 전문위원',
        '• 신세계그룹 브랜드전략실 고문',
      ],
    },
    profileImage: '/images/people/kim-kiyoung.png',
  },
  lee: {
    id: 'lee',
    name: '이지선',
    badge: 'User Experience',
    office: '미술대학 724호',
    email: ['jisunlee@sookmyung.ac.kr'],
    phone: '02-710-9684',
    homepage: 'https://smvd.sookmyung.ac.kr/?page_id=1029',
    courses: {
      undergraduate: ['데이터시각화와정보디자인', '사용자경험디자인', '졸업프로젝트스튜디오'],
      graduate: ['졸업프로젝트스튜디오'],
    },
    biography: {
      cvText: 'CV 다운로드',
      position: '숙명여자대학교 시각·영상디자인학과 교수',
      education: [
        '• 서울대학교 디자인학 박사',
        '• New York University, Interactive Telecommunications Program, MPS 석사',
        '• Parsons School of Design, Design & Technology, 석사과정 이수',
        '• 숙명여자대학교 산업디자인과 학사',
      ],
      experience: [
        '• 숙명여자대학교 창의융합디자인연구소 소장',
        '• 카카오임팩트재단 이사',
        '• 디자인학회 상임이사',
        '• 빅데이터학회 이사',
      ],
    },
    profileImage: '/images/people/lee-jisun.png',
  },
  na: {
    id: 'na',
    name: '나유미',
    badge: 'User Experience',
    office: '미술대학 724호',
    email: ['yumina@sookmyung.ac.kr'],
    phone: '02-710-9685',
    homepage: 'https://www.yumina.ai/',
    courses: {
      undergraduate: ['데이터시각화와정보디자인', '사용자경험디자인', '졸업프로젝트스튜디오'],
      graduate: ['시각영상디자인'],
    },
    biography: {
      cvText: 'CV 다운로드',
      position: '숙명여자대학교 시각·영상디자인학과 교수',
      education: [
        '• 숙명여자대학교 시각영상디자인과 졸업',
        '• USC Roski School of Art and Design, MFA Design 졸업',
      ],
      experience: [
        '• LG전자 디자인경영센터 선행디자인 연구소 선임 연구원',
        '• 2025년 서울시청자미디어센터 캠퍼스온에어 ESG 영상 공모전 심사위원회',
        '• 25 강화 융합 프로젝트',
        '• 엔다이어트: AI기반 다이어트 관리 어플리케이션 컨셉 개발 프로젝트',
        '• Glub Next: Z세대를 위한 그룹 소셜미디어 어플리케이션 AI 융합 리뉴얼 프로젝트',
        '• 산한투자증권 산학 프로젝트. MZ세대를 위한 신한투자증권 서비스 UX/UI 디자인 가이드 (지도 책임자)',
        '• USC Roski X 3rd LA Project: AR 포스트카드 경험 디자인',
      ],
    },
    profileImage: '/images/people/na-youmi.png',
  },
};

export default function ProfessorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const professor = professorsData[id];
  const { isMobile, isTablet } = useResponsive();

  // -- Responsive values --
  const tabHeaderPadding = isMobile ? '16px' : isTablet ? '24px' : '40px';
  const tabFontSize = isMobile ? '18px' : '24px';
  const tabGap = isMobile ? '20px' : '40px';

  const mainPaddingX = isMobile ? '16px' : isTablet ? '40px' : '95.5px';
  const mainPaddingBottom = isMobile ? '60px' : '100px';
  const contentDirection = isMobile ? 'column' : 'row' as const;
  const contentGap = isMobile ? '40px' : isTablet ? '40px' : '80px';
  const contentPaddingTop = isMobile ? '40px' : '100px';

  const imageWidth = isMobile ? '100%' : isTablet ? '200px' : '333px';
  const imageHeight = isMobile ? '350px' : isTablet ? '280px' : '468px';
  const imageFlexShrink = isMobile ? undefined : 0;

  const nameFontSize = isMobile ? '36px' : isTablet ? '48px' : '60px';
  const nameHeight = isMobile ? 'auto' : '66px';

  const labelGap = isMobile ? '12px' : '30px';
  const detailFontSize = isMobile ? '15px' : '18px';
  const labelFontSize = isMobile ? '12px' : '14px';
  const detailGap = isMobile ? '20px' : '30px';

  const badgeFontSize = isMobile ? '14px' : '18px';

  if (!professor) {
    return (
      <div>
        <Header />
        <div style={{ padding: `60px ${tabHeaderPadding}`, textAlign: 'center' }}>
          <h1>교수 정보를 찾을 수 없습니다.</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />

      {/* Main Content */}
      <div
        style={{
          width: '100%',
          paddingTop: '0px',
          paddingBottom: mainPaddingBottom,
          paddingLeft: mainPaddingX,
          paddingRight: mainPaddingX,
          backgroundColor: '#ffffffff',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: contentDirection,
            gap: contentGap,
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {/* Left Panel - Professor Image & Badge */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: imageWidth,
              flexShrink: imageFlexShrink,
              paddingTop: contentPaddingTop,
              position: 'relative',
            }}
          >
            {/* Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: imageHeight,
                backgroundColor: '#f3f4f6ff',
                marginBottom: '0px',
              }}
            >
              <Image
                src={professor.profileImage}
                alt={professor.name}
                fill
                sizes={isMobile ? '100vw' : isTablet ? '200px' : '333px'}
                style={{
                  objectFit: 'cover',
                }}
                priority
              />
            </div>

            {/* Badge - Overlay on image */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                backgroundColor: '#141414ff',
                padding: isMobile ? '10px 0' : '12px 0',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <span
                style={{
                  fontSize: badgeFontSize,
                  fontWeight: 'normal',
                  color: '#ffffffff',
                  fontFamily: 'Helvetica',
                  letterSpacing: '-0.27px',
                }}
              >
                {professor.badge}
              </span>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: detailGap,
              flex: 1,
              paddingTop: isMobile ? '0px' : contentPaddingTop,
              width: isMobile ? '100%' : undefined,
            }}
          >
            {/* Name */}
            <div
              style={{
                height: nameHeight,
                display: 'flex',
                alignItems: 'flex-end',
              }}
            >
              <h1
                style={{
                  fontSize: nameFontSize,
                  fontWeight: 'normal',
                  color: '#0a0a0aff',
                  fontFamily: 'Helvetica',
                  margin: '0',
                  letterSpacing: '-0.6px',
                  lineHeight: 1.1,
                }}
              >
                {professor.name}
              </h1>
            </div>

            {/* Office */}
            <div style={{ display: 'flex', gap: labelGap, alignItems: 'center' }}>
              <div
                style={{
                  backgroundColor: '#ebecf0ff',
                  padding: '0 12px',
                  borderRadius: '0px',
                  width: isMobile ? '70px' : '80px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '28px',
                }}
              >
                <span
                  style={{
                    fontSize: labelFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Helvetica',
                    lineHeight: 1.5,
                  }}
                >
                  연구실
                </span>
              </div>
              <p
                style={{
                  fontSize: detailFontSize,
                  fontWeight: 'normal',
                  color: '#141414ff',
                  fontFamily: 'Inter',
                  margin: '0',
                  letterSpacing: '-0.44px',
                  lineHeight: 1.5,
                }}
              >
                {professor.office}
              </p>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: labelGap, alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
              <div
                style={{
                  backgroundColor: '#ebecf0ff',
                  padding: '0 12px',
                  borderRadius: '0px',
                  width: isMobile ? '70px' : '80px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '28px',
                }}
              >
                <span
                  style={{
                    fontSize: labelFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Helvetica',
                    lineHeight: 1.5,
                  }}
                >
                  이메일
                </span>
              </div>
              <p
                style={{
                  fontSize: isMobile ? '14px' : detailFontSize,
                  fontWeight: 'normal',
                  color: '#141414ff',
                  fontFamily: 'Inter',
                  margin: '0',
                  letterSpacing: '-0.44px',
                  lineHeight: 1.5,
                  wordBreak: isMobile ? 'break-all' : undefined,
                }}
              >
                {professor.email.join(isMobile ? '\n' : ' ')}
              </p>
            </div>

            {/* Homepage */}
            {professor.homepage && (
              <div style={{ display: 'flex', gap: labelGap, alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                <div
                  style={{
                    backgroundColor: '#ebecf0ff',
                    padding: '0 12px',
                    borderRadius: '0px',
                    width: isMobile ? '70px' : '80px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '28px',
                  }}
                >
                  <span
                    style={{
                      fontSize: labelFontSize,
                      fontWeight: 'normal',
                      color: '#141414ff',
                      fontFamily: 'Helvetica',
                      lineHeight: 1.5,
                    }}
                  >
                    홈페이지
                  </span>
                </div>
                <a
                  href={professor.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: isMobile ? '14px' : detailFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Inter',
                    margin: '0',
                    letterSpacing: '-0.44px',
                    lineHeight: 1.5,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    wordBreak: isMobile ? 'break-all' : undefined,
                  }}
                >
                  {professor.homepage}
                </a>
              </div>
            )}

            {/* Courses */}
            <div style={{ display: 'flex', gap: labelGap, alignItems: 'flex-start' }}>
              <div
                style={{
                  backgroundColor: '#ebecf0ff',
                  padding: '0 12px',
                  borderRadius: '0px',
                  width: isMobile ? '70px' : '90px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '28px',
                }}
              >
                <span
                  style={{
                    fontSize: labelFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Helvetica',
                    lineHeight: 1.5,
                  }}
                >
                  담당과목
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0px',
                }}
              >
                {/* Undergraduate */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <p
                    style={{
                      fontSize: detailFontSize,
                      fontWeight: 'normal',
                      color: '#353030ff',
                      fontFamily: 'Inter',
                      margin: '0',
                      letterSpacing: '-0.44px',
                      lineHeight: 1.5,
                      minWidth: '30px',
                      flexShrink: 0,
                    }}
                  >
                    학사
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0px',
                    }}
                  >
                    {professor.courses.undergraduate.map((course, idx) => (
                      <p
                        key={idx}
                        style={{
                          fontSize: detailFontSize,
                          fontWeight: 'normal',
                          color: '#141414ff',
                          fontFamily: 'Inter',
                          margin: '0',
                          letterSpacing: '-0.44px',
                          lineHeight: 1.5,
                        }}
                      >
                        {course}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Graduate */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                >
                  <p
                    style={{
                      fontSize: detailFontSize,
                      fontWeight: 'normal',
                      color: '#353030ff',
                      fontFamily: 'Inter',
                      margin: '0',
                      letterSpacing: '-0.44px',
                      lineHeight: 1.5,
                      minWidth: '30px',
                      flexShrink: 0,
                    }}
                  >
                    석사
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0px',
                    }}
                  >
                    {professor.courses.graduate.map((course, idx) => (
                      <p
                        key={idx}
                        style={{
                          fontSize: detailFontSize,
                          fontWeight: 'normal',
                          color: '#141414ff',
                          fontFamily: 'Inter',
                          margin: '0',
                          letterSpacing: '-0.44px',
                          lineHeight: 1.5,
                        }}
                      >
                        {course}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div style={{ display: 'flex', gap: labelGap, alignItems: 'flex-start' }}>
              <div
                style={{
                  backgroundColor: '#ebecf0ff',
                  padding: '0 12px',
                  borderRadius: '0px',
                  width: isMobile ? '60px' : '70px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '28px',
                }}
              >
                <span
                  style={{
                    fontSize: labelFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Helvetica',
                    lineHeight: 1.5,
                  }}
                >
                  약력
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* CV Download */}
                <a
                  href="#"
                  style={{
                    fontSize: detailFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Inter',
                    margin: '0',
                    letterSpacing: '-0.44px',
                    lineHeight: 1.5,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {professor.biography.cvText}
                </a>

                {/* Position */}
                <p
                  style={{
                    fontSize: detailFontSize,
                    fontWeight: 'normal',
                    color: '#141414ff',
                    fontFamily: 'Inter',
                    margin: '0',
                    letterSpacing: '-0.44px',
                    lineHeight: 1.5,
                  }}
                >
                  {professor.biography.position}
                </p>

                {/* Education */}
                <div>
                  {professor.biography.education.map((edu, idx) => (
                    <p
                      key={idx}
                      style={{
                        fontSize: detailFontSize,
                        fontWeight: 'normal',
                        color: '#141414ff',
                        fontFamily: 'Inter',
                        margin: '0',
                        letterSpacing: '-0.44px',
                        lineHeight: 1.5,
                      }}
                    >
                      {edu}
                    </p>
                  ))}
                </div>

                {/* Experience */}
                <div>
                  {professor.biography.experience.map((exp, idx) => (
                    <p
                      key={idx}
                      style={{
                        fontSize: detailFontSize,
                        fontWeight: 'normal',
                        color: '#141414ff',
                        fontFamily: 'Inter',
                        margin: '0',
                        letterSpacing: '-0.44px',
                        lineHeight: 1.5,
                      }}
                    >
                      {exp}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
