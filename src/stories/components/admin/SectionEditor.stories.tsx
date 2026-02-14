import type { Meta, StoryObj } from '@storybook/react';
import SectionEditor from '@/components/admin/SectionEditor';

const meta = {
  title: 'Components/Admin/SectionEditor',
  component: SectionEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SectionEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSections = [
  {
    id: '1',
    type: 'HERO',
    title: 'Hero 배너',
    order: 0,
  },
  {
    id: '2',
    type: 'TEXT_BLOCK',
    title: '소개 텍스트',
    order: 1,
  },
  {
    id: '3',
    type: 'IMAGE_GALLERY',
    title: '이미지 갤러리',
    order: 2,
  },
  {
    id: '4',
    type: 'PORTFOLIO_GRID',
    title: '포트폴리오 섹션',
    order: 3,
  },
  {
    id: '5',
    type: 'TEAM_GRID',
    title: '교수진 소개',
    order: 4,
  },
];

const mockSectionsSmall = [
  {
    id: '1',
    type: 'HERO',
    title: 'Hero 배너',
    order: 0,
  },
  {
    id: '2',
    type: 'TEXT_BLOCK',
    order: 1,
  },
];

const mockSectionsLarge = [
  { id: '1', type: 'HERO', title: 'Hero 배너', order: 0 },
  { id: '2', type: 'TEXT_BLOCK', title: '소개 텍스트', order: 1 },
  { id: '3', type: 'IMAGE_GALLERY', title: '이미지 갤러리', order: 2 },
  { id: '4', type: 'TWO_COLUMN', title: '2열 레이아웃', order: 3 },
  { id: '5', type: 'THREE_COLUMN', title: '3열 카드', order: 4 },
  { id: '6', type: 'VIDEO_EMBED', title: '비디오 임베드', order: 5 },
  { id: '7', type: 'CTA_BUTTON', title: 'CTA 섹션', order: 6 },
  { id: '8', type: 'STATS', title: '통계', order: 7 },
  { id: '9', type: 'TEAM_GRID', title: '팀 멤버', order: 8 },
  { id: '10', type: 'PORTFOLIO_GRID', title: '포트폴리오', order: 9 },
];

/**
 * 기본 SectionEditor - 여러 섹션이 있는 상태
 * - 드래그 앤 드롭으로 순서 변경 가능
 * - 각 섹션의 편집/삭제 버튼 표시
 * - 섹션 타입별 라벨 표시
 */
export const Default: Story = {
  args: {
    pageId: 'home',
    initialSections: mockSections,
  },
};

/**
 * 빈 상태 (섹션 없음)
 * - "아직 섹션이 없습니다" 메시지
 * - 섹션 추가 버튼 표시
 */
export const Empty: Story = {
  args: {
    pageId: 'new-page',
    initialSections: [],
  },
};

/**
 * 적은 섹션 (2개)
 */
export const FewSections: Story = {
  args: {
    pageId: 'about',
    initialSections: mockSectionsSmall,
  },
};

/**
 * 많은 섹션 (10개)
 * - 긴 리스트에서 드래그 앤 드롭 동작 확인
 */
export const ManySections: Story = {
  args: {
    pageId: 'work',
    initialSections: mockSectionsLarge,
  },
};

/**
 * 다양한 섹션 타입
 * - 모든 섹션 타입의 라벨 표시 확인
 */
export const AllSectionTypes = () => (
  <SectionEditor
    pageId="showcase"
    initialSections={[
      { id: 'hero', type: 'HERO', title: 'Hero 배너', order: 0 },
      { id: 'text', type: 'TEXT_BLOCK', title: '텍스트', order: 1 },
      { id: 'gallery', type: 'IMAGE_GALLERY', title: '이미지 갤러리', order: 2 },
      { id: 'two-col', type: 'TWO_COLUMN', title: '2열 레이아웃', order: 3 },
      { id: 'three-col', type: 'THREE_COLUMN', title: '3열 카드', order: 4 },
      { id: 'video', type: 'VIDEO_EMBED', title: '비디오', order: 5 },
      { id: 'cta', type: 'CTA_BUTTON', title: 'CTA 섹션', order: 6 },
      { id: 'stats', type: 'STATS', title: '통계', order: 7 },
      { id: 'team', type: 'TEAM_GRID', title: '팀 멤버', order: 8 },
      { id: 'portfolio', type: 'PORTFOLIO_GRID', title: '포트폴리오', order: 9 },
      { id: 'news', type: 'NEWS_GRID', title: '뉴스', order: 10 },
      { id: 'curriculum', type: 'CURRICULUM_TABLE', title: '교과과정', order: 11 },
      { id: 'faculty', type: 'FACULTY_LIST', title: '교수진', order: 12 },
      { id: 'events', type: 'EVENT_LIST', title: '이벤트', order: 13 },
      { id: 'contact', type: 'CONTACT_FORM', title: '연락 폼', order: 14 },
    ]}
  />
);

/**
 * 홈페이지 예시
 * - 일반적인 홈페이지 섹션 구성
 */
export const HomepageExample: Story = {
  args: {
    pageId: 'home',
    initialSections: [
      { id: '1', type: 'HERO', title: 'Hero 배너', order: 0 },
      { id: '2', type: 'TEXT_BLOCK', title: '학과 소개', order: 1 },
      { id: '3', type: 'PORTFOLIO_GRID', title: '대표 작업', order: 2 },
      { id: '4', type: 'STATS', title: '통계', order: 3 },
      { id: '5', type: 'TEAM_GRID', title: '교수진', order: 4 },
      { id: '6', type: 'CTA_BUTTON', title: 'CTA 섹션', order: 5 },
    ],
  },
};

/**
 * About 페이지 예시
 */
export const AboutPageExample: Story = {
  args: {
    pageId: 'about',
    initialSections: [
      { id: '1', type: 'HERO', title: 'About Hero', order: 0 },
      { id: '2', type: 'TEXT_BLOCK', title: '학과 비전', order: 1 },
      { id: '3', type: 'IMAGE_GALLERY', title: '히스토리', order: 2 },
      { id: '4', type: 'TEAM_GRID', title: '교수진', order: 3 },
    ],
  },
};

/**
 * 커스텀 제목 없는 섹션
 * - type 라벨로만 표시되는 경우
 */
export const NoCustomTitles: Story = {
  args: {
    pageId: 'pages',
    initialSections: [
      { id: '1', type: 'HERO', order: 0 },
      { id: '2', type: 'TEXT_BLOCK', order: 1 },
      { id: '3', type: 'IMAGE_GALLERY', order: 2 },
      { id: '4', type: 'PORTFOLIO_GRID', order: 3 },
    ],
  },
};

/**
 * 커스텀 제목 있는 섹션
 * - 모든 섹션이 커스텀 제목을 가짐
 */
export const WithCustomTitles: Story = {
  args: {
    pageId: 'custom',
    initialSections: [
      { id: '1', type: 'HERO', title: '메인 배너 - 2025 봄 신입생 모집', order: 0 },
      { id: '2', type: 'TEXT_BLOCK', title: '학과 소개 - 시각영상디자인 미래', order: 1 },
      { id: '3', type: 'IMAGE_GALLERY', title: '2024 졸업전시회 갤러리', order: 2 },
      { id: '4', type: 'TEAM_GRID', title: '우리 교수진을 소개합니다', order: 3 },
    ],
  },
};

/**
 * 접근성 테스트
 * - 키보드 네비게이션 (Shift+Up/Down)
 * - 스크린 리더 지원 확인
 */
export const Accessible: Story = {
  args: {
    pageId: 'accessible',
    initialSections: mockSections,
  },
  parameters: {
    a11y: {
      config: {
        rules: {
          'button-name': { enabled: true },
          'image-alt': { enabled: false },
        },
      },
    },
  },
};

/**
 * 로딩 상태
 * - 섹션 순서 변경 중 로딩 표시
 */
export const LoadingState: Story = {
  args: {
    pageId: 'loading',
    initialSections: mockSections,
  },
  parameters: {
    docs: {
      description: {
        story: '섹션을 드래그할 때 로딩 상태가 표시됩니다',
      },
    },
  },
};

/**
 * 반응형 테스트
 * - 작은 화면에서의 동작
 */
export const ResponsiveMobile = () => (
  <div style={{ width: '375px', margin: '0 auto' }}>
    <SectionEditor
      pageId="mobile"
      initialSections={mockSections}
    />
  </div>
);

/**
 * 반응형 테스트
 * - 태블릿 크기
 */
export const ResponsiveTablet = () => (
  <div style={{ width: '768px', margin: '0 auto' }}>
    <SectionEditor
      pageId="tablet"
      initialSections={mockSections}
    />
  </div>
);

/**
 * 반응형 테스트
 * - 데스크탑 크기
 */
export const ResponsiveDesktop = () => (
  <div style={{ width: '1200px', margin: '0 auto' }}>
    <SectionEditor
      pageId="desktop"
      initialSections={mockSectionsLarge}
    />
  </div>
);
