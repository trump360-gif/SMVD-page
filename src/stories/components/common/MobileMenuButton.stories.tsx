import type { Meta, StoryObj } from '@storybook/react';
import { MobileMenuButton } from '@/components/common/Header/MobileMenuButton';

const meta = {
  title: 'Components/Common/MobileMenuButton',
  component: MobileMenuButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
} satisfies Meta<typeof MobileMenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 상태의 MobileMenuButton
 * - 버튼은 보이지만 메뉴는 닫혀있음
 * - md: 이상의 화면에서는 숨김
 * - 햄버거 아이콘 표시
 */
export const Default: Story = {};

/**
 * 메뉴가 열린 상태
 * - 클릭하여 메뉴 열림
 * - X 아이콘으로 변경
 * - 모바일 네비게이션 메뉴 펼침
 */
export const MenuOpen: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/',
        query: {},
        asPath: '/',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (button) {
      button.click();
    }
  },
};

/**
 * Home 경로에서의 MobileMenuButton
 * - Home 항목이 활성 상태로 표시됨
 */
export const HomeActive: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/',
        query: {},
        asPath: '/',
      },
    },
  },
};

/**
 * About 경로에서의 MobileMenuButton
 * - About 항목이 활성 상태로 표시됨
 */
export const AboutActive: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/about',
        query: {},
        asPath: '/about',
      },
    },
  },
};

/**
 * Curriculum 경로에서의 MobileMenuButton
 * - Curriculum 항목이 활성 상태로 표시됨
 */
export const CurriculumActive: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/curriculum',
        query: {},
        asPath: '/curriculum',
      },
    },
  },
};

/**
 * People 경로에서의 MobileMenuButton
 * - People 항목이 활성 상태로 표시됨
 */
export const PeopleActive: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/people',
        query: {},
        asPath: '/people',
      },
    },
  },
};

/**
 * Work 경로에서의 MobileMenuButton
 * - Work 항목이 활성 상태로 표시됨
 */
export const WorkActive: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/work',
        query: {},
        asPath: '/work',
      },
    },
  },
};

/**
 * News&Event 경로에서의 MobileMenuButton
 * - News & Event 항목이 활성 상태로 표시됨
 */
export const NewsActive: Story = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/news',
        query: {},
        asPath: '/news',
      },
    },
  },
};

/**
 * Accessibility 테스트
 * - aria-label과 aria-expanded 속성 확인
 * - 키보드 네비게이션 가능
 */
export const Accessible: Story = {
  parameters: {
    a11y: {
      config: {
        rules: {
          'button-name': { enabled: true },
          'aria-required-attr': { enabled: true },
        },
      },
    },
  },
};

/**
 * 다양한 뷰포트 크기에서의 동작
 * - 모바일 사이즈(md: 이하)에서만 표시됨
 */
export const ResponsiveMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      router: {
        pathname: '/',
      },
    },
  },
};

/**
 * 태블릿 뷰포트
 * - md: 이상에서는 숨김
 */
export const ResponsiveTablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
