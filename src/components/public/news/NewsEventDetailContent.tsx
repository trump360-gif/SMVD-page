'use client';

import { useState } from 'react';

interface NewsDetailItem {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  images: {
    main: string;
    centerLeft: string;
    centerRight: string;
    bottomLeft: string;
    bottomCenter: string;
    bottomRight: string;
  };
  introTitle?: string;
  introText?: string;
}

// 졸업전시회 상세 데이터
const newsDetailData: { [key: string]: NewsDetailItem } = {
  '5': {
    id: '5',
    category: 'Event',
    date: '2025-01-05',
    title: '2024 시각·영상디자인과 졸업전시회',
    description: '',
    introTitle: '2024 시각영상디자인과 졸업전시회',
    introText:
      `이번 전시 주제인 'Ready, Set, Go!' KICK OFF는 틀을 깨고 한계를 넘어 새로운 도약을 준비하는 결심을 담아 진행되었습니다.\n필드를 넘어서 더 넓은 세계로 나아가는 여정을 함께해주신 교수님들과 관객 분들께 감사 인사를 전합니다.`,
    images: {
      main: '/images/work-detail/Rectangle 240652481.png',
      centerLeft: '/images/work-detail/Rectangle 240652482.png',
      centerRight: '/images/work-detail/Rectangle 240652483.png',
      bottomLeft: '/images/work-detail/Rectangle 240652486.png',
      bottomCenter: '/images/work-detail/Rectangle 240652485.png',
      bottomRight: '/images/work-detail/Rectangle 240652484.png',
    },
  },
};

const categories = ['ALL', 'Notice', 'Event', 'Awards', 'Recruiting'];

export default function NewsEventDetailContent({ itemId }: { itemId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const item = newsDetailData[itemId];

  if (!item) {
    return (
      <div
        style={{
          width: '100%',
          padding: '40px',
          textAlign: 'center',
          color: '#666',
        }}
      >
        상세 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
      }}
    >
      {/* Title and Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingBottom: '20px',
          borderBottom: '2px solid #141414ff',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            fontFamily: 'Satoshi',
            color: '#1b1d1fff',
            margin: '0',
          }}
        >
          News&Event
        </h1>

        {/* Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                fontSize: '16px',
                fontWeight: selectedCategory === category ? '600' : '400',
                fontFamily: 'Satoshi',
                color:
                  selectedCategory === category ? '#141414ff' : '#7b828eff',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderBottom:
                  selectedCategory === category
                    ? '2px solid #141414ff'
                    : 'none',
                paddingBottom: '4px',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%',
          paddingBottom: '80px',
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            paddingBottom: '20px',
            borderBottom: '2px solid #e5e7ebff',
          }}
        >
          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Satoshi',
                color: '#141414ff',
                backgroundColor: '#ebecf0ff',
                padding: '4px 8px',
                borderRadius: '4px',
                minWidth: 'fit-content',
              }}
            >
              {item.category}
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Pretendard',
                color: '#626872ff',
                letterSpacing: '-0.14px',
              }}
            >
              {item.date}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '700',
              fontFamily: 'Pretendard',
              color: '#000000ff',
              margin: '0',
              lineHeight: '1.45',
              letterSpacing: '-0.48px',
            }}
          >
            {item.introTitle || item.title}
          </h1>
        </div>

        {/* Description Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '181px',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              fontWeight: '500',
              fontFamily: 'Pretendard',
              color: '#1b1d1fff',
              margin: '0',
              lineHeight: '1.5',
              letterSpacing: '-0.18px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
            }}
          >
            {item.introText}
          </p>
        </div>

        {/* Image Gallery */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            width: '100%',
          }}
        >
          {/* Main Image */}
          <div
            style={{
              width: '100%',
              height: '765px',
              backgroundColor: '#f0f0f0ff',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <img
              src={item.images.main}
              alt="Main gallery image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Center Two Images */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '670px',
                height: '670px',
                backgroundColor: '#f0f0f0ff',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.images.centerLeft}
                alt="Center left gallery image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div
              style={{
                width: '670px',
                height: '670px',
                backgroundColor: '#f0f0f0ff',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.images.centerRight}
                alt="Center right gallery image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>

          {/* Bottom Three Images */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                width: '440px',
                height: '440px',
                backgroundColor: '#f0f0f0ff',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.images.bottomLeft}
                alt="Bottom left gallery image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div
              style={{
                width: '440px',
                height: '440px',
                backgroundColor: '#f0f0f0ff',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.images.bottomCenter}
                alt="Bottom center gallery image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div
              style={{
                width: '440px',
                height: '440px',
                backgroundColor: '#f0f0f0ff',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <img
                src={item.images.bottomRight}
                alt="Bottom right gallery image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
