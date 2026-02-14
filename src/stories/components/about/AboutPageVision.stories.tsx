import type { Meta, StoryObj } from '@storybook/react';
import AboutPageVision from '@/components/public/about/AboutPageVision';

const meta = {
  title: 'Components/About/AboutPageVision',
  component: AboutPageVision,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AboutPageVision>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Vision 섹션
 * - 제목 "Vision"
 * - 7개 전공 분야 칩 (UX/UI, Graghic, Editorial, Illustration, Branding, CM/CF, Game)
 * - 학과 비전 본문
 */
export const Default: Story = {};

/**
 * 커스텀 제목
 */
export const CustomTitle: Story = {
  args: {
    title: 'Our Vision',
  },
};

/**
 * 커스텀 칩 (5개)
 */
export const CustomChips: Story = {
  args: {
    chips: ['UX/UI', 'Motion', 'Branding', 'Editorial', 'Game'],
  },
};

/**
 * 짧은 본문
 */
export const ShortContent: Story = {
  args: {
    content:
      '시각정보의 전달 및 상품과 서비스의 유통과정에서 직면하는 각종\n커뮤니케이션 문제를 분석하고 이를 대처해 나갈 수 있도록 다양한 분야에\n적용되고 있습니다.',
  },
};

/**
 * 칩 강조 뷰 (1360px 컨테이너)
 */
export const ChipsHighlight = () => (
  <div style={{ maxWidth: '1360px', padding: '40px' }}>
    <AboutPageVision />
  </div>
);

/**
 * 모바일 뷰 (360px)
 */
export const MobileView = () => (
  <div style={{ maxWidth: '360px', padding: '16px' }}>
    <AboutPageVision />
  </div>
);

/**
 * 태블릿 뷰 (768px)
 */
export const TabletView = () => (
  <div style={{ maxWidth: '768px', padding: '24px' }}>
    <AboutPageVision />
  </div>
);
