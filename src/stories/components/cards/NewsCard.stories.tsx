import type { Meta, StoryObj } from '@storybook/react';
import NewsCard from '@/components/ui/NewsCard';

const meta = {
  title: 'Components/Cards/NewsCard',
  component: NewsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NewsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const newsItems = [
  {
    id: '1',
    title: '미술대학 2024년도 학생경비 집행내역 공개',
    category: 'Notice',
    date: '2025-01-05',
    description: '',
    image: '/Group-27.svg',
  },
  {
    id: '5',
    title: '2024 시각·영상디자인과 졸업전시회',
    category: 'Event',
    date: '2025-01-05',
    description: '이번 전시 주제인 "Ready, Set, Go!" KICK OFF는 들을 제기 한전을 넘어 새로운 도약을 준비하는 결심을 담고 있습니다...',
    image: '/images/news/Image-1.png',
  },
  {
    id: '6',
    title: '2024 시각·영상디자인과 동문의 밤',
    category: 'Event',
    date: '2025-01-05',
    description: '2024년 10월 28일, 백주년기념관 한상은 라운지에서 2024 시각·영상디자인과 동문의 밤 행사를 진행했습니다. 1부에는 동문 특강을, 2부에는 황순선 교수님의 서프라이즈 퇴임식을 진행했습니다...',
    image: '/images/news/Image.png',
  },
];

/**
 * 기본 NewsCard - 뉴스/이벤트 카드
 * - 썸네일 이미지 (160x160px)
 * - 카테고리 배지
 * - 날짜
 * - 제목
 * - 설명 (선택)
 */
export const Default: Story = {
  args: {
    ...newsItems[1],
  },
};

/**
 * 링크 포함 (href 속성)
 * - 클릭시 상세 페이지로 이동
 */
export const WithLink: Story = {
  args: {
    ...newsItems[1],
    href: '/news/5',
  },
};

/**
 * Notice 카테고리 - 설명 없음
 */
export const NoticeCategory: Story = {
  args: {
    ...newsItems[0],
  },
};

/**
 * Event 카테고리 - 설명 포함
 */
export const EventCategory: Story = {
  args: {
    ...newsItems[1],
  },
};

/**
 * 설명이 긴 경우 (2줄 이상 자르기)
 */
export const LongDescription: Story = {
  args: {
    ...newsItems[2],
  },
};

/**
 * 설명 없음 (빈 문자열)
 */
export const NoDescription: Story = {
  args: {
    ...newsItems[0],
  },
};

/**
 * 기본 아이콘 이미지 (Group-27.svg)
 */
export const DefaultThumbnail: Story = {
  args: {
    id: '99',
    title: '공지사항 제목',
    category: 'Notice',
    date: '2025-01-05',
    description: '',
    image: '/Group-27.svg',
  },
};

/**
 * 실제 이미지 썸네일
 */
export const RealThumbnail: Story = {
  args: {
    id: '100',
    title: '졸업전시회 개최 안내',
    category: 'Event',
    date: '2025-01-15',
    description: '2024 졸업전시회 개최 안내',
    image: '/images/news/Image-1.png',
  },
};

/**
 * 카테고리별 모든 뉴스 항목
 */
export const AllCategories = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '600px' }}>
    {newsItems.map((item) => (
      <NewsCard
        key={item.id}
        {...item}
        href={`/news/${item.id}`}
      />
    ))}
  </div>
);

/**
 * 2열 그리드 레이아웃
 */
export const GridLayout = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '1000px' }}>
    {newsItems.map((item) => (
      <NewsCard
        key={item.id}
        {...item}
        href={`/news/${item.id}`}
      />
    ))}
  </div>
);

/**
 * Hover 상태 표시
 * - translateY(-4px)로 변경되는 상태 확인
 */
export const HoverState: Story = {
  args: {
    ...newsItems[1],
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const card = canvasElement.querySelector('div');
    if (card) {
      card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

/**
 * 다양한 날짜 형식
 */
export const DifferentDates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '600px' }}>
    <NewsCard
      id="d1"
      title="최근 뉴스"
      category="News"
      date="2025-01-15"
      description="가장 최근 게시물"
      image="/images/news/Image-1.png"
    />
    <NewsCard
      id="d2"
      title="지난달 뉴스"
      category="Notice"
      date="2024-12-05"
      description="지난달 게시물"
      image="/Group-27.svg"
    />
    <NewsCard
      id="d3"
      title="작년 뉴스"
      category="Event"
      date="2024-01-05"
      description="작년 게시물"
      image="/images/news/Image.png"
    />
  </div>
);

/**
 * 접근성 테스트
 * - 카테고리 배지와 날짜 가독성
 * - 이미지 alt 텍스트
 */
export const Accessible: Story = {
  args: {
    ...newsItems[1],
  },
  parameters: {
    a11y: {
      config: {
        rules: {
          'color-contrast': { enabled: true },
          'image-alt': { enabled: true },
        },
      },
    },
  },
};

/**
 * 반응형 테스트
 */
export const ResponsiveLayout = () => (
  <div style={{ width: '100%', maxWidth: '800px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {newsItems.map((item) => (
        <NewsCard key={item.id} {...item} />
      ))}
    </div>
  </div>
);
