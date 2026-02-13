'use client';

interface GraduateModule {
  name: string;
  track: string;
  courses: string;
  requirements: string;
  credits: string;
}

const graduateModules: GraduateModule[] = [
  {
    name: '모듈B',
    track: '브랜드 커뮤니케이션 디자인',
    courses: '타이포그래피디자인Ⅰ,Ⅱ\n브랜드디자인Ⅰ,Ⅱ\n광고디자인Ⅰ,Ⅱ\n편집디자인Ⅰ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈C',
    track: 'UX 디자인',
    courses: '일러스트레이션과스토리텔링디자인Ⅰ,Ⅱ\nAI컴퓨터디자인Ⅰ,Ⅱ\n마케팅디자인Ⅰ\n유튜브영상디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈D',
    track: '영상 디자인',
    courses: '기초그래픽디자인Ⅰ,Ⅱ\n데이터시각화정보디자인Ⅰ,Ⅱ\n디자인심리학\n사용자정험디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈E',
    track: 'XR & 영상 디자인',
    courses: '기초영상디자인Ⅰ,Ⅱ\n모션디자인Ⅰ,Ⅱ\n에니메이션\nAI메타버스디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
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
        {graduateModules.map((module, index) => (
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
  );
}
