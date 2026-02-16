import type { Semester, GraduateModule, ModuleDetail, FilterOption } from './types';

export const semesters: Semester[] = [
  {
    year: 1,
    term: 1,
    courses: [
      { name: '기초그래픽디자인I', color: '#ff5f5aff', classification: 'elective' },
      { name: '기초영상디자인I', color: '#ffcc54ff', classification: 'elective' },
      { name: '일러스트레이션과스토리텔링디자인 I', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 1,
    term: 2,
    courses: [
      { name: '기초그래픽디자인II', color: '#ff5f5aff', classification: 'required' },
      { name: '기초영상디자인II', color: '#ffcc54ff', classification: 'elective' },
      { name: '일러스트레이션과스토리텔링디자인 II', color: '#a24affff', classification: 'elective' },
      { name: '타이포그래피디자인I', color: '#53c9ffff', classification: 'elective' },
      { name: '디자인과문화', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 2,
    term: 1,
    courses: [
      { name: 'AI창업디자인I', color: '#ffcc54ff', classification: 'required' },
      { name: '브랜드디자인I', color: '#1e90ffff', classification: 'elective' },
      { name: '데이터시각화와정보보디자인I', color: '#ff6b9dff', classification: 'elective' },
      { name: '모션디자인I', color: '#a24affff', classification: 'elective' },
      { name: '애니메이션I', color: '#32cd32ff', classification: 'elective' },
      { name: '타이포그래피디자인I', color: '#1e90ffff', classification: 'elective' },
      { name: '마케팅디자인', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 2,
    term: 2,
    courses: [
      { name: 'AI창업디자인II', color: '#ffcc54ff', classification: 'required' },
      { name: '브랜드디자인II', color: '#1e90ffff', classification: 'elective' },
      { name: '데이터시각화와정보보디자인II', color: '#ff6b9dff', classification: 'elective' },
      { name: '모션디자인III', color: '#a24affff', classification: 'elective' },
      { name: '애니메이션II', color: '#32cd32ff', classification: 'elective' },
      { name: '디자인심리학', color: '#70d970ff', classification: 'elective' },
    ],
  },
  {
    year: 3,
    term: 1,
    courses: [
      { name: '광고디자인I', color: '#1e90ffff', classification: 'required' },
      { name: '사용자경험디자인I', color: '#ff5f5aff', classification: 'required' },
      { name: '편집디자인I', color: '#70d970ff', classification: 'elective' },
      { name: '유튜브영상디자인I', color: '#ffcc54ff', classification: 'elective' },
      { name: 'AI메타버스디자인I', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 3,
    term: 2,
    courses: [
      { name: '광고디자인II', color: '#1e90ffff', classification: 'required' },
      { name: '사용자경험디자인II', color: '#ff5f5aff', classification: 'required' },
      { name: '편집디자인II', color: '#70d970ff', classification: 'elective' },
      { name: '유튜브영상디자인II', color: '#ffcc54ff', classification: 'elective' },
      { name: 'AI메타버스디자인II', color: '#a24affff', classification: 'elective' },
    ],
  },
  {
    year: 4,
    term: 1,
    courses: [
      { name: '졸업프로젝트스튜디오 I', color: '#20b2aaff', classification: 'required' },
    ],
  },
  {
    year: 4,
    term: 2,
    courses: [
      { name: '졸업프로젝트스튜디오 II', color: '#20b2aaff', classification: 'required' },
    ],
  },
];

export const undergraduateModules: GraduateModule[] = [
  {
    name: '모듈B',
    track: '브랜드 커뮤니케이션 디자인',
    courses: '타이포그래피디자인Ⅰ,Ⅱ\\n브랜드디자인Ⅰ,Ⅱ\\n광고디자인Ⅰ,Ⅱ\\n편집디자인Ⅰ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈C',
    track: 'AI 디지털 마케팅 디자인',
    courses: '일러스트레이션과스토리텔링디자인Ⅰ,Ⅱ\\nAI창업디자인Ⅰ,Ⅱ\\n마케팅디자인\\n유튜브영상디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈D',
    track: 'UX 디자인',
    courses: '기초그래픽디자인Ⅰ,Ⅱ\\n데이터시각화와정보디자인Ⅰ,Ⅱ\\n디자인심리학\\n사용자경험디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
  {
    name: '모듈E',
    track: 'XR & 영상 디자인',
    courses: '기초영상디자인Ⅰ,Ⅱ\\n모션디자인Ⅰ,Ⅱ\\n에니메이션\\nAI메타버스디자인Ⅰ,Ⅱ',
    requirements: '모듈 A 필수 이수, 트랙 내 교과 필수 이수',
    credits: '16',
  },
];

export const moduleDetails: ModuleDetail[] = [
  {
    module: '모듈 A',
    title: '브랜드 디자인',
    description: '시각디자인의 기본이되는 그래픽 커뮤니케이션 영역으로, 국내외 사례 및 현 디자인의 트랜드를 이해하고 프로젝트에 맞는 창의적 아이디어를 도출하여 자기화한다. 향후 각자의 진로 방향을 모색하여 디자인프로세스를 배우고 포트폴리오화 시키는 과정이다.',
    courses: '브랜드디자인I, II\n광고디자인I, II',
  },
  {
    module: '모듈 B',
    title: '브랜드 커뮤니케이션 디자인',
    description: '인스타, 유튜브 중심의 개인이 발신하는 SNS가 시각영상의 핵심으로 AI를 활용하여 자신을 브랜딩하고 크리에이티브한 마케팅 컨텐츠 제작을 연구한다.',
    courses: 'AI창업디자인I, II\n유튜브영상디자인I, II',
  },
  {
    module: '모듈 C',
    title: 'UX 디자인',
    description: '데이터 수집, 분석을 통한 데이터 시각화와 정보 디자인을 통하여 데이터 주도 디자인의 기초를 다진다. 이 위에 디자인 사고를 바탕으로하는 AI를 접목한 사용자 경험 디자인 프로세스로 구현 되는 서비스 및 제품 컨텐츠를 웹, 모바일, 스마트 기기, 게임, 메타버스 등의 새로운 미디어 상의 UX / UI / 인터랙션 디자인하는 능력을 갖춘다.',
    courses: '데이터시각화정보디자인I, II\n사용자경험디자인I, II',
  },
  {
    module: '모듈 D',
    title: '영상 디자인',
    description: '기초 영상디자인부터 모션디자인 심화까지 단계적으로 다루며, 국내·외 사례 분석과 프로젝트 중심 수업을 통해 현대 영상과 모션디자인의 흐름을 이해하고 창의적 문제 해결 능력을 기른다. 학생은 자신만의 시각 언어를 구축하고 포트폴리오로 확장할 수 있는 실무 기반 학습을 받는다.',
    courses: '기초영상디자인I, II\n모션디자인I, II',
  },
];

export const classificationOptions: FilterOption[] = [
  { label: '전공필수', value: 'required' },
  { label: '전공선택', value: 'elective' },
];

export const trackOptions: FilterOption[] = [
  { label: '브랜드 커뮤니케이션 디자인', value: 'branding', color: '#489bffff' },
  { label: 'AI 디지털 마케팅 디자인', value: 'ai_marketing', color: '#ffcc54ff' },
  { label: 'UX 디자인', value: 'ux', color: '#ff5f5aff' },
  { label: 'XR & 영상 디자인', value: 'xr_video', color: '#a24affff' },
  { label: '공통과목', value: 'common', color: '#1abc9cff' },
];

export const TRACK_COLORS = ['#489bffff', '#ffcc54ff', '#ff5f5aff', '#a24affff'];
