import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@/components/common/Header/Header';

const meta = {
  title: 'Components/Common/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockNavigation = [
  { id: '1', label: 'Home', href: '/', order: 0 },
  { id: '2', label: 'About Major', href: '/about', order: 1 },
  { id: '3', label: 'Curriculum', href: '/curriculum', order: 2 },
  { id: '4', label: 'People', href: '/people', order: 3 },
  { id: '5', label: 'Work', href: '/work', order: 4 },
  { id: '6', label: 'News&Event', href: '/news', order: 5 },
];

/**
 * 기본 Header - 모든 네비게이션 항목과 로고 표시
 */
export const Default: Story = {
  args: {
    navigation: mockNavigation,
  },
};

/**
 * Home 탭 활성 상태 - Home 링크가 강조됨
 */
export const HomeActive: Story = {
  args: {
    navigation: mockNavigation,
  },
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
 * About Major 탭 활성 상태 - About Major 링크가 강조됨
 */
export const AboutActive: Story = {
  args: {
    navigation: mockNavigation,
  },
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
 * Curriculum 탭 활성 상태 - Curriculum 링크가 강조됨
 */
export const CurriculumActive: Story = {
  args: {
    navigation: mockNavigation,
  },
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
 * People 탭 활성 상태 - People 링크가 강조됨
 */
export const PeopleActive: Story = {
  args: {
    navigation: mockNavigation,
  },
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
 * Work 탭 활성 상태 - Work 링크가 강조됨
 */
export const WorkActive: Story = {
  args: {
    navigation: mockNavigation,
  },
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
 * News&Event 탭 활성 상태 - News&Event 링크가 강조됨
 */
export const NewsActive: Story = {
  args: {
    navigation: mockNavigation,
  },
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
 * 네비게이션 항목이 적은 경우
 */
export const MinimalNavigation: Story = {
  args: {
    navigation: [
      { id: '1', label: 'Home', href: '/', order: 0 },
      { id: '2', label: 'About', href: '/about', order: 1 },
    ],
  },
};

/**
 * 네비게이션 항목이 많은 경우
 */
export const ExtendedNavigation: Story = {
  args: {
    navigation: [
      { id: '1', label: 'Home', href: '/', order: 0 },
      { id: '2', label: 'About Major', href: '/about', order: 1 },
      { id: '3', label: 'Curriculum', href: '/curriculum', order: 2 },
      { id: '4', label: 'People', href: '/people', order: 3 },
      { id: '5', label: 'Work', href: '/work', order: 4 },
      { id: '6', label: 'News&Event', href: '/news', order: 5 },
      { id: '7', label: 'Exhibitions', href: '/exhibitions', order: 6 },
      { id: '8', label: 'Contact', href: '/contact', order: 7 },
    ],
  },
};
