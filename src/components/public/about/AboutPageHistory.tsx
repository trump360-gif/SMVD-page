'use client';

interface AboutPageHistoryProps {
  title?: string;
  introText?: string;
}

export default function AboutPageHistory({
  title = 'History',
  introText = '숙명여자대학교 시각영상디자인과는 설립 이래 디지털 시대가 요구하는 창의적 시각 커뮤니케이션의 중심에서 인재를 \n배출해 왔습니다. 축적된 전통과 혁신을 바탕으로 미래 디자인 교육을 선도하고 있습니다.',
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
          fontWeight: '700',
          color: '#141414ff',
          fontFamily: 'Satoshi',
          margin: '0',
          letterSpacing: '-0.48px',
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
            fontFamily: 'Pretendard',
            margin: '0',
            letterSpacing: '-0.18px',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            alignSelf: 'flex-start',
          }}
        >
          {introText}
        </p>

        {/* Timeline Container - Placeholder for timeline content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '100%',
            maxWidth: '504px',
          }}
        >
          {/* Timeline items would be rendered here */}
          <div
            style={{
              fontSize: '14px',
              color: '#666666ff',
              fontFamily: 'Pretendard',
            }}
          >
            {/* Timeline data to be added */}
          </div>
        </div>
      </div>
    </div>
  );
}
