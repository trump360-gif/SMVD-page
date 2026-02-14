import type { Meta, StoryObj } from '@storybook/react';
import VisionSection from '@/components/public/home/VisionSection';

const meta = {
  title: 'Components/Home/VisionSection',
  component: VisionSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof VisionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Vision 섹션
 * - 2줄 텍스트
 * - Helvetica 폰트
 */
export const Default: Story = {};

/**
 * 커스텀 텍스트 (짧은 버전)
 */
export const ShortText: Story = {
  args: {
    line1: 'FROM VISUAL DESIGN',
    line2: 'TO CREATIVE SOLUTIONS',
  },
};

/**
 * 커스텀 텍스트 (긴 버전)
 */
export const LongText: Story = {
  args: {
    line1: 'FROM VISUAL DELIVERY AND SYSTEMATIC APPROACH',
    line2:
      'TO SYSTEMIC SOLUTIONS SOLVING PROBLEMS. SHAPING THE FUTURE OF VISUALS AND BEYOND THE BOUNDARIES',
  },
};

/**
 * 한글 텍스트
 */
export const KoreanText: Story = {
  args: {
    line1: '시각적 전달에서',
    line2: '체계적 문제해결까지. 비주얼의 미래를 만들다',
  },
};

/**
 * 데스크톱 뷰 (1440px)
 */
export const DesktopView = () => (
  <div style={{ maxWidth: '1440px', padding: '40px' }}>
    <VisionSection />
  </div>
);

/**
 * 태블릿 뷰 (768px)
 */
export const TabletView = () => (
  <div style={{ maxWidth: '768px', padding: '24px' }}>
    <VisionSection />
  </div>
);

/**
 * 모바일 뷰 (360px)
 */
export const MobileView = () => (
  <div style={{ maxWidth: '360px', padding: '16px' }}>
    <VisionSection />
  </div>
);

/**
 * 다크 배경
 */
export const DarkBackground = () => (
  <div style={{ backgroundColor: '#1a1a1a', padding: '40px', maxWidth: '1440px' }}>
    <div style={{ color: '#ffffff' }}>
      <VisionSection />
    </div>
  </div>
);
