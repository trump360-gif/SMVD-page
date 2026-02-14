import type { Meta, StoryObj } from '@storybook/react';
import AboutPageHistory from '@/components/public/about/AboutPageHistory';

const meta = {
  title: 'Components/About/AboutPageHistory',
  component: AboutPageHistory,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AboutPageHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 History 섹션
 * - 제목 "History"
 * - 인트로 텍스트
 * - 타임라인 11개 항목 (1948-2021)
 */
export const Default: Story = {};

/**
 * 커스텀 제목
 */
export const CustomTitle: Story = {
  args: {
    title: 'Our History',
  },
};

/**
 * 커스텀 인트로
 */
export const CustomIntro: Story = {
  args: {
    introText:
      '1948년 설립 이래 시각영상디자인과는 끊임없이 혁신하며\n한국 디자인 교육의 중심 역할을 해왔습니다.',
  },
};

/**
 * 전체 타임라인 뷰 (1360px 컨테이너)
 */
export const FullTimeline = () => (
  <div style={{ maxWidth: '1360px', padding: '40px' }}>
    <AboutPageHistory />
  </div>
);

/**
 * 타임라인 강조 (스크롤 가능)
 */
export const TimelineScroll = () => (
  <div
    style={{
      maxWidth: '1360px',
      maxHeight: '800px',
      padding: '40px',
      overflow: 'auto',
      border: '1px solid #e1e1e1',
    }}
  >
    <AboutPageHistory />
  </div>
);

/**
 * 모바일 뷰 (360px)
 */
export const MobileView = () => (
  <div style={{ maxWidth: '360px', padding: '16px' }}>
    <AboutPageHistory />
  </div>
);

/**
 * 태블릿 뷰 (768px)
 */
export const TabletView = () => (
  <div style={{ maxWidth: '768px', padding: '24px' }}>
    <AboutPageHistory />
  </div>
);
