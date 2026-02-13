'use client';

interface AboutPageVisionProps {
  title?: string;
  content?: string;
  chips?: string[];
}

export default function AboutPageVision({
  title = 'Vision',
  content = '시각정보의 전달 및 상품과 서비스의 유통과정에서 직면하는 각종 커뮤니케이션 문제를 분석하고 이를 대처해 나갈 수 있도록\n다양한 분야에 적용되고 있습니다. 시각영상디자인과는 현대산업사회에서 보다 다양하고 광범위한 양상으로 변모되고 있습니다. \n이러한 시대와 사회적 요구에 부응하기 위해 건실한 예술적 기량과 개성적이며 창의적인 조형감각을 지닌 디자이너를 \n양성하는 것에 교육 목표를 두고 있습니다.',
  chips = ['UX/UI', 'Graghic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
}: AboutPageVisionProps) {
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
          gap: '8px',
          flex: 1,
        }}
      >
        {/* Chips/Tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '28px',
                padding: '4px 8px',
                backgroundColor: '#ebecf0ff',
                border: '1px solid #141414ff',
                borderRadius: '0px',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#141414ff',
                  fontFamily: 'Satoshi',
                  letterSpacing: '-0.14px',
                  lineHeight: 1.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {chip}
              </span>
            </div>
          ))}
        </div>

        {/* Text Content */}
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
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
