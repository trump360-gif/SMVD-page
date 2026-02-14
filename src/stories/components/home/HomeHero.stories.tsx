import type { Meta, StoryObj } from '@storybook/react';
import HomeHero from '@/components/public/home/HomeHero';

const meta = {
  title: 'Components/Home/HomeHero',
  component: HomeHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Hero 섹션
 * - Event 배지 + 날짜
 * - 졸업전시회 제목
 * - 하단 구분선
 */
export const Default: Story = {};

/**
 * 커스텀 이벤트
 */
export const CustomEvent: Story = {
  args: {
    eventLabel: 'News',
    eventDate: '2024.12.25',
    title: '2024 시각영상디자인과 워크샵',
  },
};

/**
 * 긴 제목
 */
export const LongTitle: Story = {
  args: {
    title: '2024 시각영상디자인과 졸업전시회 - 창의적 비전을 향한 여정',
  },
};

/**
 * 짧은 제목
 */
export const ShortTitle: Story = {
  args: {
    title: 'SMVD 2024',
  },
};

/**
 * 전체 뷰 (배경 이미지 포함)
 */
export const WithBackgroundImage = () => (
  <div
    style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundImage: 'url(/images/home/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '40px',
    }}
  >
    <HomeHero />
  </div>
);

/**
 * 데스크톱 뷰 (1440px)
 */
export const DesktopView = () => (
  <div style={{ maxWidth: '1440px', padding: '40px' }}>
    <HomeHero />
  </div>
);

/**
 * 태블릿 뷰 (768px)
 */
export const TabletView = () => (
  <div style={{ maxWidth: '768px', padding: '24px' }}>
    <HomeHero />
  </div>
);

/**
 * 모바일 뷰 (360px)
 */
export const MobileView = () => (
  <div style={{ maxWidth: '360px', padding: '16px' }}>
    <HomeHero />
  </div>
);

/**
 * 다크 모드 (배경색 어두움)
 */
export const DarkMode = () => (
  <div
    style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      padding: '40px',
    }}
  >
    <HomeHero />
  </div>
);
