import type { Meta, StoryObj } from '@storybook/react';
import WorkCard from '@/components/ui/WorkCard';

const meta = {
  title: 'Components/Cards/WorkCard',
  component: WorkCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WorkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const workItems = [
  { id: '1', title: 'Vora', subtitle: '이름', category: 'UX/UI', image: '/images/work/portfolio-12.png' },
  { id: '2', title: 'BICHAE', subtitle: '이름', category: 'Branding', image: '/images/work/portfolio-5.png' },
  { id: '3', title: 'StarNew Valley', subtitle: '이름', category: 'Game', image: '/images/work/portfolio-9.png' },
  { id: '4', title: 'Pave', subtitle: '이름', category: 'UX/UI', image: '/images/work/portfolio-11.png' },
  { id: '5', title: 'Bolio', subtitle: '이름', category: 'UX/UI', image: '/images/work/portfolio-7.png' },
  { id: '6', title: 'Morae', subtitle: '이름', category: 'UX/UI', image: '/images/work/portfolio-4.png' },
  { id: '7', title: 'MIST AWAY', subtitle: '이름', category: 'Branding', image: '/images/work/portfolio-6.png' },
  {
    id: '8',
    title: 'Nightmare in Neverland',
    subtitle: '이름',
    category: 'Motion',
    image: '/images/work/portfolio-2.png',
  },
  { id: '9', title: '고군분투', subtitle: '이름', category: 'Game', image: '/images/work/portfolio-1.png' },
  { id: '10', title: '시도', subtitle: '이름', category: 'Graphic', image: '/images/work/Rectangle 240652487.png' },
];

/**
 * 기본 WorkCard - 포트폴리오 카드
 * - 프로젝트 이미지 (332x240 비율)
 * - 제목
 * - 카테고리
 */
export const Default: Story = {
  args: {
    ...workItems[0],
  },
};

/**
 * 링크 포함 (href 속성)
 * - 클릭시 상세 페이지로 이동
 */
export const WithLink: Story = {
  args: {
    ...workItems[0],
    href: '/work/1',
  },
};

/**
 * UX/UI 카테고리
 */
export const UxUiCategory: Story = {
  args: {
    ...workItems[0],
  },
};

/**
 * Branding 카테고리
 */
export const BrandingCategory: Story = {
  args: {
    ...workItems[1],
  },
};

/**
 * Game 카테고리
 */
export const GameCategory: Story = {
  args: {
    ...workItems[2],
  },
};

/**
 * Motion 카테고리
 */
export const MotionCategory: Story = {
  args: {
    ...workItems[7],
  },
};

/**
 * Graphic 카테고리
 */
export const GraphicCategory: Story = {
  args: {
    ...workItems[9],
  },
};

/**
 * 한글 제목
 */
export const KoreanTitle: Story = {
  args: {
    ...workItems[8],
  },
};

/**
 * 긴 제목
 */
export const LongTitle: Story = {
  args: {
    id: '99',
    title: 'This is a Very Long Project Title That Might Wrap',
    subtitle: '이름',
    category: 'UX/UI',
    image: '/images/work/portfolio-12.png',
  },
};

/**
 * 모든 카테고리별 카드 그리드
 */
export const AllCategories = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
    {workItems.map((item) => (
      <WorkCard
        key={item.id}
        {...item}
        href={`/work/${item.id}`}
      />
    ))}
  </div>
);

/**
 * 2x2 그리드 레이아웃
 */
export const GridLayout = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', width: '800px' }}>
    {workItems.slice(0, 4).map((item) => (
      <WorkCard key={item.id} {...item} href={`/work/${item.id}`} />
    ))}
  </div>
);

/**
 * Hover 상태 표시
 */
export const HoverState: Story = {
  args: {
    ...workItems[0],
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const card = canvasElement.querySelector('div');
    if (card) {
      card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};

/**
 * 접근성 테스트
 * - alt 텍스트와 이미지 최적화 확인
 */
export const Accessible: Story = {
  args: {
    ...workItems[0],
  },
  parameters: {
    a11y: {
      config: {
        rules: {
          'image-alt': { enabled: true },
        },
      },
    },
  },
};

/**
 * 다양한 이미지 종류
 * - 모든 포트폴리오 항목의 이미지 렌더링 테스트
 */
export const AllWorkItems = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
    {workItems.map((item) => (
      <WorkCard key={item.id} {...item} />
    ))}
  </div>
);
