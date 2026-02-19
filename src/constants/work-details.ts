import type { BlogContent } from '@/components/admin/shared/BlockEditor/types';

// NEW - 2026-02-19: Tiptap content format
export interface TiptapContent {
  type: 'doc';
  content: Array<Record<string, unknown>>;
}

export interface WorkDetail {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  description: string;
  author: string;
  email: string;
  heroImage: string;
  galleryImages: string[];
  content?: BlogContent | TiptapContent | null; // BlockEditor or Tiptap content
  nextProject?: {
    id: string;
    title: string;
  };
  previousProject?: {
    id: string;
    title: string;
  };
}

export const workDetails: Record<string, WorkDetail> = {
  '1': {
    id: '1',
    title: 'Vora',
    subtitle: '권나연 외 3명, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '권나연',
    email: 'contact@vora.com',
    description: 'Vora UX/UI Design Project.\n\n',
    heroImage: '/images/work/vora/hero.png',
    galleryImages: [
      '/images/work/vora/gallery-1.png',
      '/images/work/vora/gallery-2.png',
      '/images/work/vora/gallery-3.png',
    ],
    previousProject: {
      id: '12',
      title: '고군분투',
    },
    nextProject: {
      id: '2',
      title: 'Mindit',
    },
  },
  '2': {
    id: '2',
    title: 'Mindit',
    subtitle: '도인영 외 3명, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '도인영',
    email: 'contact@mindit.com',
    description: 'Mindit UX/UI Design Project.\n\n',
    heroImage: '/images/work/mindit/hero.png',
    galleryImages: [
      '/images/work/mindit/gallery-1.png',
      '/images/work/mindit/gallery-2.png',
      '/images/work/mindit/gallery-3.png',
    ],
    previousProject: {
      id: '1',
      title: 'Vora',
    },
    nextProject: {
      id: '3',
      title: 'StarNew Valley',
    },
  },
  '3': {
    id: '3',
    title: 'StarNew Valley',
    subtitle: '안시현 외 3명, 2025',
    category: 'Game',
    tags: ['Game'],
    author: '안시현',
    email: 'contact@starnewvalley.com',
    description: 'StarNew Valley Game Design Project.\n\n',
    heroImage: '/images/work/starnewvalley/hero.png',
    galleryImages: [
      '/images/work/starnewvalley/gallery-1.png',
      '/images/work/starnewvalley/gallery-2.png',
      '/images/work/starnewvalley/gallery-3.png',
    ],
    previousProject: {
      id: '2',
      title: 'Mindit',
    },
    nextProject: {
      id: '4',
      title: 'Pave',
    },
  },
  '4': {
    id: '4',
    title: 'Pave',
    subtitle: '박지우 외 2명, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '박지우',
    email: 'contact@pave.com',
    description: 'Pave UX/UI Design Project.\n\n',
    heroImage: '/images/work/pave/hero.png',
    galleryImages: [
      '/images/work/pave/gallery-1.png',
      '/images/work/pave/gallery-2.png',
      '/images/work/pave/gallery-3.png',
    ],
    previousProject: {
      id: '3',
      title: 'StarNew Valley',
    },
    nextProject: {
      id: '5',
      title: 'Bolio',
    },
  },
  '5': {
    id: '5',
    title: 'Bolio',
    subtitle: '박근영, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '박근영',
    email: 'contact@bolio.com',
    description: 'Bolio UX/UI Design Project.\n\n',
    heroImage: '/images/work/bolio/hero.png',
    galleryImages: [
      '/images/work/bolio/gallery-1.png',
      '/images/work/bolio/gallery-2.png',
      '/images/work/bolio/gallery-3.png',
    ],
    previousProject: {
      id: '4',
      title: 'Pave',
    },
    nextProject: {
      id: '6',
      title: 'MIST AWAY',
    },
  },
  '6': {
    id: '6',
    title: 'MIST AWAY',
    subtitle: '신예지, 2025',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '신예지',
    email: 'contact@mistaway.com',
    description: 'MIST AWAY UX/UI Design Project.\n\n',
    heroImage: '/images/work/mistaway/hero.png',
    galleryImages: [
      '/images/work/mistaway/gallery-1.png',
      '/images/work/mistaway/gallery-2.png',
      '/images/work/mistaway/gallery-3.png',
    ],
    previousProject: {
      id: '5',
      title: 'Bolio',
    },
    nextProject: {
      id: '7',
      title: 'BICHAE',
    },
  },
  '7': {
    id: '7',
    title: 'BICHAE',
    subtitle: '최은정, 2025',
    category: 'Branding',
    tags: ['Branding'],
    author: '최은정',
    email: 'contact@bichae.com',
    description: 'BICHAE Branding Design Project.\n\n',
    heroImage: '/images/work/bichae/hero.png',
    galleryImages: [
      '/images/work/bichae/gallery-1.png',
      '/images/work/bichae/gallery-2.png',
      '/images/work/bichae/gallery-3.png',
    ],
    previousProject: {
      id: '6',
      title: 'MIST AWAY',
    },
    nextProject: {
      id: '8',
      title: 'Morae',
    },
  },
  '8': {
    id: '8',
    title: 'Morae',
    subtitle: '고은서, 2023',
    category: 'UX/UI',
    tags: ['UX/UI'],
    author: '고은서',
    email: 'contact@morae.com',
    description: 'Morae UX/UI Design Project.\n\n',
    heroImage: '/images/work/morae/hero.png',
    galleryImages: [
      '/images/work/morae/gallery-1.png',
      '/images/work/morae/gallery-2.png',
      '/images/work/morae/gallery-3.png',
    ],
    previousProject: {
      id: '7',
      title: 'BICHAE',
    },
    nextProject: {
      id: '9',
      title: 'STUDIO KNOT',
    },
  },
  '9': {
    id: '9',
    title: 'STUDIO KNOT',
    subtitle: '노하린, 2025',
    category: 'Branding',
    tags: ['UX/UI', 'Graphic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game'],
    author: '노하린',
    email: 'havein6@gmail.com',
    description: `STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다. 쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는 정서적 가치를 담은 지속가능한 대안을 제시합니다.`,
    heroImage: '/images/work/knot/hero.png',
    galleryImages: [
      '/images/work/knot/text-below.png',
      '/images/work/knot/gallery-1.png',
      '/images/work/knot/gallery-2.png',
      '/images/work/knot/gallery-3.png',
      '/images/work/knot/gallery-4.png',
      '/images/work/knot/gallery-5.png',
      '/images/work/knot/gallery-6.png',
      '/images/work/knot/gallery-7.png',
      '/images/work/knot/gallery-8.png',
    ],
    previousProject: {
      id: '8',
      title: 'Morae',
    },
    nextProject: {
      id: '10',
      title: 'BLOMÉ',
    },
  },
  '10': {
    id: '10',
    title: 'BLOMÉ',
    subtitle: '김진아 외 1명, 2025',
    category: 'Branding',
    tags: ['Branding'],
    author: '김진아',
    email: 'contact@blome.com',
    description: 'BLOMÉ Branding Design Project.\n\n',
    heroImage: '/images/work/blome/hero.png',
    galleryImages: [
      '/images/work/blome/gallery-1.png',
      '/images/work/blome/gallery-2.png',
      '/images/work/blome/gallery-3.png',
    ],
    previousProject: {
      id: '9',
      title: 'STUDIO KNOT',
    },
    nextProject: {
      id: '11',
      title: 'alors: romanticize your life, every...',
    },
  },
  '11': {
    id: '11',
    title: 'alors: romanticize your life, every...',
    subtitle: '정유진, 2025',
    category: 'Motion',
    tags: ['Motion'],
    author: '정유진',
    email: 'contact@alors.com',
    description: 'alors: romanticize your life, every... Motion Design Project.\n\n',
    heroImage: '/images/work/alors/hero.png',
    galleryImages: [
      '/images/work/alors/gallery-1.png',
      '/images/work/alors/gallery-2.png',
      '/images/work/alors/gallery-3.png',
    ],
    previousProject: {
      id: '10',
      title: 'BLOMÉ',
    },
    nextProject: {
      id: '12',
      title: '고군분투',
    },
  },
  '12': {
    id: '12',
    title: '고군분투',
    subtitle: '한다인, 2025',
    category: 'Motion',
    tags: ['Motion'],
    author: '한다인',
    email: 'contact@gogoonbunstu.com',
    description: '고군분투 Motion Design Project.\n\n',
    heroImage: '/images/work/gogoonbunstu/hero.png',
    galleryImages: [
      '/images/work/gogoonbunstu/gallery-1.png',
      '/images/work/gogoonbunstu/gallery-2.png',
      '/images/work/gogoonbunstu/gallery-3.png',
    ],
    previousProject: {
      id: '11',
      title: 'alors: romanticize your life, every...',
    },
    nextProject: {
      id: '1',
      title: 'Vora',
    },
  },
};
