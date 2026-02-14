import type { Meta, StoryObj } from '@storybook/react';
import ExhibitionSection from '@/components/public/home/ExhibitionSection';

const meta = {
  title: 'Components/Home/ExhibitionSection',
  component: ExhibitionSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ExhibitionSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Exhibition 섹션
 * - 3개 전시 카드 (2025, 2024, 2023)
 * - 3열 그리드
 * - More 링크
 */
export const Default: Story = {};

/**
 * 커스텀 전시 2개
 */
export const TwoItems: Story = {
  args: {
    items: [
      {
        year: '2024',
        src: '/images/home/exhibition-2024.png',
        alt: 'Exhibition 2024',
      },
      {
        year: '2023',
        src: '/images/home/exhibition-2023.png',
        alt: 'Exhibition 2023',
      },
    ],
  },
};

/**
 * 전시 1개만
 */
export const SingleItem: Story = {
  args: {
    items: [
      {
        year: '2025',
        src: '/images/home/exhibition-2025.png',
        alt: 'Latest Exhibition 2025',
      },
    ],
  },
};

/**
 * 전시 4개 (확장)
 */
export const FourItems: Story = {
  args: {
    items: [
      {
        year: '2025',
        src: '/images/home/exhibition-2025.png',
        alt: 'SMVD Grad Exhibition 2025',
      },
      {
        year: '2024',
        src: '/images/home/exhibition-2024.png',
        alt: 'Visual Media Design Graduation Show 2024',
      },
      {
        year: '2023',
        src: '/images/home/exhibition-2023.png',
        alt: 'Kickoff 2023',
      },
      {
        year: '2022',
        src: '/images/home/exhibition-2024.png',
        alt: 'Exhibition 2022',
      },
    ],
  },
};

/**
 * 전체 갤러리 뷰 (1440px 컨테이너)
 */
export const FullGallery = () => (
  <div style={{ maxWidth: '1440px', padding: '40px' }}>
    <ExhibitionSection />
  </div>
);

/**
 * 데스크톱 뷰 (1360px)
 */
export const DesktopView = () => (
  <div style={{ maxWidth: '1360px', padding: '40px' }}>
    <ExhibitionSection />
  </div>
);

/**
 * 태블릿 뷰 (768px) - 2열 그리드
 */
export const TabletView = () => (
  <div style={{ maxWidth: '768px', padding: '24px' }}>
    <ExhibitionSection />
  </div>
);

/**
 * 모바일 뷰 (360px) - 1열 그리드
 */
export const MobileView = () => (
  <div style={{ maxWidth: '360px', padding: '16px' }}>
    <ExhibitionSection />
  </div>
);

/**
 * 스크롤 가능 뷰
 */
export const ScrollableView = () => (
  <div
    style={{
      maxWidth: '1440px',
      maxHeight: '800px',
      padding: '40px',
      overflow: 'auto',
      border: '1px solid #e1e1e1',
    }}
  >
    <ExhibitionSection />
  </div>
);

/**
 * 이미지 로딩 상태 (회색 배경)
 */
export const LoadingState = () => (
  <div style={{ maxWidth: '1440px', padding: '40px' }}>
    <ExhibitionSection
      items={[
        { year: '2025', src: '', alt: 'Loading...' },
        { year: '2024', src: '', alt: 'Loading...' },
        { year: '2023', src: '', alt: 'Loading...' },
      ]}
    />
  </div>
);
