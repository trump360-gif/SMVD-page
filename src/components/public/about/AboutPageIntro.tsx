'use client';

import Image from 'next/image';

interface AboutPageIntroProps {
  title?: string;
  imageSrc?: string;
}

export default function AboutPageIntro({
  title = 'About SMVD',
  imageSrc = '/images/about/e5c4cf027162eec5560ea533a7856322ccd3f614.png',
}: AboutPageIntroProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '16px',
        width: '100%',
      }}
    >
      {/* Title Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#141414ff',
            fontFamily: 'Satoshi',
            margin: '0',
            letterSpacing: '-0.48px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {/* Icon placeholder or actual icon */}
          <span
            style={{
              fontSize: '18px',
              fontWeight: '400',
              color: '#141414ff',
              fontFamily: 'Pretendard',
              letterSpacing: '-0.18px',
              lineHeight: 1.5,
            }}
          >
            {/* Icon would go here */}
          </span>
        </div>
      </div>

      {/* Image Section - image 32 (1017 x 500px) */}
      <div
        style={{
          position: 'relative',
          width: '1017px',
          height: '500px',
          backgroundColor: '#e1e1e1ff',
          overflow: 'hidden',
          maxWidth: '100%',
        }}
      >
        <Image
          src={imageSrc}
          alt="About SMVD Hero Image"
          width={1017}
          height={500}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          priority
        />
      </div>
    </div>
  );
}
