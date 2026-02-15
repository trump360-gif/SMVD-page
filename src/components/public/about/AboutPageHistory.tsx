'use client';

const DEFAULT_TIMELINE_ITEMS = [
  { year: '2021', description: '디자인학부로 통합되었던 학과가 시각영상디자인전공, 산업디자인전공,\n환경디자인학과로 나누어져 1학년 때부터 전공을 심화하여 학습할 수 있도록 개편' },
  { year: '2006', description: '3개 전공 (시각영상디자인전공, 산업디자인전공, 환경디자인전공)\n영역으로 통합 개편' },
  { year: '2002', description: '디자인학부내 6개 전공(시각정보디자인전공, 영상애니메이션전공,\n산업디자인전공, 실내디자인전공, 도시조경 건축 디자인전공, 건축디자인전공)으로\n세분화하여 전공제로 개편\n\n실시된 전국 디자인계열 대학 종합 평가에서 최우수 대학으로\n선정되는 성과를 거둠' },
  { year: '2000', description: '학과제를 학부제로 통합하면서 산업디자인전공, 영상애니메이션전공,\n환경디자인전공의 3개 세부전공으로 운영' },
  { year: '1997', description: '야간에 신설된 환경디자인학과가 미술대학으로 편입되면서\n산업디자인과, 환경디자인과 구조로 확대 운영' },
  { year: '1993', description: '9월 미술대학의 산업미술과에서 산업디자인과로 학과 명칭을 변경,\n시각디자인 분야와 제품디자인 분야로 세부전공을 운영' },
  { year: '1980', description: '12월 산업미술대학을 미술대학으로 명칭을 변경' },
  { year: '1973', description: '12월 응용미술과를 산업미술과 산업공예과로 분과하여\n산업미술대학을 신설' },
  { year: '1968', description: '응용 미술과로 변경' },
  { year: '1962', description: '문리과대학 생활미술과로 구체화' },
  { year: '1948', description: '문학부 미술학과가 설립' },
];

interface AboutPageHistoryProps {
  title?: string;
  introText?: string;
  timelineItems?: Array<{ year: string; description: string }>;
}

export default function AboutPageHistory({
  title = 'History',
  introText = '숙명여자대학교 시각영상디자인과는 설립 이래 디지털 시대가 요구하는 창의적 시각 커뮤니케이션의 중심에서 인재를 배출해 왔습니다.\n축적된 전통과 혁신을 바탕으로 미래 디자인 교육을 선도하고 있습니다.',
  timelineItems = DEFAULT_TIMELINE_ITEMS,
}: AboutPageHistoryProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        width: '100%',
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontSize: '48px',
          fontWeight: '500',
          color: '#141414ff',
          fontFamily: 'Inter',
          margin: '0',
          letterSpacing: '-0.128px',
          lineHeight: 1.1,
          minWidth: '333px',
          flex: '0 0 333px',
        }}
      >
        {title}
      </h2>

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '60px',
          flex: 1,
        }}
      >
        {/* Intro Text */}
        <p
          style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#141414ff',
            fontFamily: 'Inter',
            margin: '0',
            letterSpacing: '-0.619px',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            alignSelf: 'flex-start',
            wordBreak: 'keep-all',
          }}
        >
          {introText}
        </p>

        {/* Timeline Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '504px',
          }}
        >
          {timelineItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {/* Year Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '28px',
                  padding: '0 8px',
                  backgroundColor: '#ebecf0ff',
                  borderRadius: '0px',
                  width: 'fit-content',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#141414ff',
                    fontFamily: 'Inter',
                    letterSpacing: '-0.29px',
                    lineHeight: 1.5,
                  }}
                >
                  {item.year}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#141414ff',
                  fontFamily: 'Inter',
                  margin: '0',
                  letterSpacing: '-0.619px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
