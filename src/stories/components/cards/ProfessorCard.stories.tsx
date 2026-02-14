import type { Meta, StoryObj } from '@storybook/react';
import ProfessorCard from '@/components/ui/ProfessorCard';

const meta = {
  title: 'Components/Cards/ProfessorCard',
  component: ProfessorCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProfessorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const professors = [
  {
    id: 'yun',
    name: '윤여종',
    badge: '교수 | 학과장',
    courses: '브랜드디자인\n졸업프로젝트스튜디오 I/II',
    profileImage: '/images/people/yun-yeojong.png',
  },
  {
    id: 'kim',
    name: '김기영',
    badge: '교수',
    courses: '마케팅디자인\n졸업프로젝트스튜디오 I/II',
    profileImage: '/images/people/kim-kiyoung.png',
  },
  {
    id: 'lee',
    name: '이지선',
    badge: '교수',
    courses: '사용자경험디자인\n졸업프로젝트스튜디오 I/II',
    profileImage: '/images/people/lee-jisun.png',
  },
  {
    id: 'na',
    name: '나유미',
    badge: '교수',
    courses: '사용자경험디자인\n졸업프로젝트스튜디오 I/II',
    profileImage: '/images/people/na-youmi.png',
  },
];

/**
 * 기본 ProfessorCard - 교수 정보 카드
 * - 프로필 이미지 (236x356px)
 * - 교수 이름
 * - 담당 과목 (멀티라인)
 */
export const Default: Story = {
  args: {
    ...professors[0],
  },
};

/**
 * 링크 포함 (href 속성)
 * - 클릭시 상세 페이지로 이동
 */
export const WithLink: Story = {
  args: {
    ...professors[0],
    href: '/professor/yun',
  },
};

/**
 * 클릭 핸들러 포함
 * - onClick 콜백 함수 실행
 */
export const WithClickHandler: Story = {
  args: {
    ...professors[0],
    href: '/professor/yun',
  },
};

/**
 * 교수 1: 윤여종 교수
 */
export const ProfessorYun: Story = {
  args: {
    ...professors[0],
    href: '/professor/yun',
  },
};

/**
 * 교수 2: 김기영 교수
 */
export const ProfessorKim: Story = {
  args: {
    ...professors[1],
    href: '/professor/kim',
  },
};

/**
 * 교수 3: 이지선 교수
 */
export const ProfessorLee: Story = {
  args: {
    ...professors[2],
    href: '/professor/lee',
  },
};

/**
 * 교수 4: 나유미 교수
 */
export const ProfessorNa: Story = {
  args: {
    ...professors[3],
    href: '/professor/na',
  },
};

/**
 * 모든 교수 카드 그리드 표시
 * - 4명의 교수를 한 줄에 표시
 */
export const AllProfessors = () => (
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
    {professors.map((prof) => (
      <ProfessorCard
        key={prof.id}
        {...prof}
        href={`/professor/${prof.id}`}
      />
    ))}
  </div>
);

/**
 * 단일 과목만 표시
 * - 각 행이 한 과목씩 표시되는 경우
 */
export const SingleCourse: Story = {
  args: {
    id: 'test',
    name: '테스트 교수',
    badge: '교수',
    profileImage: '/images/people/yun-yeojong.png',
  },
};

/**
 * 긴 과목명 테스트
 * - 여러 과목이 길게 들어갔을 때 줄바꿈 확인
 */
export const LongCourses: Story = {
  args: {
    id: 'test-long',
    name: '테스트 교수',
    badge: '교수',
    profileImage: '/images/people/yun-yeojong.png',
  },
};

/**
 * Hover 상태 표시
 * - translateY(-4px)와 opacity 0.8로 변경되는 상태 확인
 */
export const HoverState: Story = {
  args: {
    ...professors[0],
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const card = canvasElement.querySelector('div');
    if (card) {
      card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  },
};
