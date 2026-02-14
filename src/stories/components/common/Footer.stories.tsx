import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from '@/components/common/Footer/Footer';

const meta = {
  title: 'Components/Common/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFooterData = {
  id: 'footer-1',
  title: '시각영상디자인과',
  content: '서울특별시 용산구 청파로47길 100\n숙명여자대학교 미술대학\n전화: 02-710-9240',
  links: [
    { text: '입학안내', href: 'https://admission.sookmyung.ac.kr' },
    { text: '학사정보', href: 'https://portal.sookmyung.ac.kr' },
    { text: '도서관', href: 'https://library.sookmyung.ac.kr' },
  ],
};

const mockFooterDataSmall = {
  id: 'footer-2',
  title: 'Visual & Media Design',
  content: 'Sookmyung Women\'s University',
  links: [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },
  ],
};

const mockFooterDataExtended = {
  id: 'footer-3',
  title: '숙명여자대학교 시각영상디자인과',
  content: '주소: 서울특별시 용산구 청파로47길 100 미술대학 711호\n전화: 02-710-9240\n이메일: smvd@sookmyung.ac.kr\n운영시간: 월-금 09:00 - 18:00',
  links: [
    { text: '입학안내', href: 'https://admission.sookmyung.ac.kr' },
    { text: '학사정보', href: 'https://portal.sookmyung.ac.kr' },
    { text: '도서관', href: 'https://library.sookmyung.ac.kr' },
    { text: '캠퍼스맵', href: 'https://map.sookmyung.ac.kr' },
    { text: '학생지원', href: 'https://student.sookmyung.ac.kr' },
  ],
};

/**
 * 풀 데이터가 있는 기본 Footer
 * - 제목, 본문 내용, 빠른 링크, 연락처 정보 모두 표시
 */
export const Default: Story = {
  args: {
    data: mockFooterData,
  },
};

/**
 * 최소한의 데이터만 있는 Footer
 * - 제목, 본문, 2개의 링크만 표시
 */
export const Minimal: Story = {
  args: {
    data: mockFooterDataSmall,
  },
};

/**
 * 확장된 데이터가 있는 Footer
 * - 더 많은 연락처 정보와 5개의 빠른 링크 표시
 */
export const Extended: Story = {
  args: {
    data: mockFooterDataExtended,
  },
};

/**
 * 데이터가 없는 Footer
 * - 빈 상태로 메시지 없이 렌더링됨
 * - Copyright 정보만 표시됨
 */
export const NoData: Story = {
  args: {
    data: null,
  },
};

/**
 * 다중 라인 주소가 있는 Footer
 * - whitespace-pre-line으로 줄바꿈 유지되는지 확인
 */
export const MultilineContent: Story = {
  args: {
    data: {
      id: 'footer-multiline',
      title: '연락처',
      content: '서울시 용산구 청파로47길 100\n숙명여자대학교 미술대학 711호\n시각영상디자인과',
      links: [
        { text: 'Website', href: 'https://example.com' },
        { text: 'Contact', href: 'mailto:smvd@sookmyung.ac.kr' },
      ],
    },
  },
};

/**
 * 링크 없는 Footer
 * - 제목과 본문만 있고 빠른 링크 섹션은 비어있음
 */
export const NoLinks: Story = {
  args: {
    data: {
      id: 'footer-nolinks',
      title: '숙명여자대학교',
      content: '대한민국 서울시 용산구',
      links: [],
    },
  },
};
