import type { Meta, StoryObj } from '@storybook/react';
import AboutPageIntro from '@/components/public/about/AboutPageIntro';

const meta = {
  title: 'Components/About/AboutPageIntro',
  component: AboutPageIntro,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AboutPageIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Intro 섹션
 * - 제목 "About SMVD"
 * - 학과 소개 본문
 * - 이미지 (1360x500px)
 */
export const Default: Story = {};

/**
 * 커스텀 제목
 */
export const CustomTitle: Story = {
  args: {
    title: 'About Our Department',
  },
};

/**
 * 이미지 포함 전체 뷰 (1360px 컨테이너)
 */
export const WithImage = () => (
  <div style={{ maxWidth: '1360px', padding: '40px' }}>
    <AboutPageIntro />
  </div>
);

/**
 * 이미지 없음 (대체 이미지)
 */
export const WithoutImage: Story = {
  args: {
    imageSrc: '/images/placeholder.png',
  },
};

/**
 * 모바일 뷰 (360px)
 */
export const MobileView = () => (
  <div style={{ maxWidth: '360px', padding: '16px' }}>
    <AboutPageIntro />
  </div>
);

/**
 * 태블릿 뷰 (768px)
 */
export const TabletView = () => (
  <div style={{ maxWidth: '768px', padding: '24px' }}>
    <AboutPageIntro />
  </div>
);

/**
 * 데스크톱 풀 뷰 (1440px)
 */
export const DesktopView = () => (
  <div style={{ maxWidth: '1440px', padding: '40px' }}>
    <AboutPageIntro />
  </div>
);
