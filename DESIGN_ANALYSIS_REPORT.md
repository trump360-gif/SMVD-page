# 🎨 숙명여대 페이지 디자인 분석 리포트

**분석일**: 2026-02-12
**소스**: Figma Design System (figma_data.json)
**페이지 수**: 1 Canvas
**섹션 수**: 13개
**컴포넌트**: 147개 인스턴스, 47개 컴포넌트 세트

---

## 📄 1. 페이지 구조

### 1.1 전체 섹션 (13개)

| 섹션명 | 유형 | 주요 콘텐츠 | 담당 페이지 |
|--------|------|-----------|-----------|
| **Component** | 라이브러리 | 재사용 컴포넌트 + 프리미티브 | 설계 시스템 |
| **Home_** | 페이지 | 메인 화면 (스크롤 애니메이션) | 랜딩/홈 |
| **About Major** | 페이지 | 학과 소개 | 학과 정보 |
| **Curriculum** | 페이지 | 교과 과정 | 교육 과정 |
| **People** (Our People) | 페이지 | 교수진/스태프 | 인물 정보 |
| **Work** | 페이지 | 포트폴리오/작업 | 작품 전시 |
| **News&Event** | 페이지 | 뉴스/공지사항 | 소식/행사 |

### 1.2 각 섹션의 상세 구조

#### Home_ (메인 페이지)
```
Home_
├── main 시안_스크롤 애니메이션 O (×3 variation)
├── 로딩 인터랙션 프레임
└── 전시 카드 섹션
```

#### About Major (학과 소개)
```
About Major
├── About_로딩 인터랙션
└── About (메인 콘텐츠)
```

#### Curriculum (교과 과정)
```
Curriculum (×2 섹션)
├── 커리큘럼 (Web 버전 ×3)
├── 커리큘럼_전체이미지_학부
├── 커리큘럼_블럭_대학원
└── 커리큘럼 (Mobile 버전 ×2)
```

#### People / Our People (교수진)
```
People
├── OurPeople_로딩 인터랙션
├── OurPeople (메인)
├── Detail_김기영교수님 (상세)
└── Mobile_OurPeople (×3)

Our People
├── Mobile_OurPeople (×5)
└── 로딩/상세 페이지들
```

#### Work (포트폴리오)
```
Work
├── Group 2085669593
├── Detail-2인 이상 (상세 페이지)
├── Frame 2147229128 (×6 variations)
└── Mobile_work_all/branding/detail (Mobile)
```

#### News&Event (뉴스/이벤트)
```
News&Event (×2 섹션)
├── 뉴스 및 이벤트 - 상세페이지 - 졸전/행사
├── 뉴스 및 이벤트 - 상세페이지 - 집행내역
├── Mobile_뉴스이벤트_notice
├── Mobile_뉴스이벤트_detail
└── Mobile_뉴스이벤트_file
```

---

## 🎨 2. 디자인 시스템

### 2.1 색상 팔레트

#### 📌 Primary / Brand Colors
| 색상명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| Deep Blue | `#0845A7` | RGB(8, 69, 167) | 주 브랜드 컬러 |
| Blue | `#1A46E7` | RGB(26, 70, 231) | CTA, 활성 상태 |
| Light Blue | `#489AFF` | RGB(72, 154, 255) | Hover, Focus 상태 |
| Teal | `#1ABC9C` | RGB(26, 188, 156) | 강조 색상 |

#### 💜 Accent Colors
| 색상명 | HEX | 용도 |
|--------|-----|------|
| Purple | `#9747FF` | 특수 강조, 이벤트 |
| Light Purple | `#A14AFF` | Hover 상태 |

#### ⚠️ Semantic Colors
| 색상명 | HEX | 용도 |
|--------|-----|------|
| Error/Red | `#FF0000` | 에러, 경고 |
| Error Light | `#FF5F59` | 에러 배경 |
| Warning/Yellow | `#FFCB53` | 주의, 강조 |

#### ⚪ Neutral (Grey Scale) - 16단계
```
가장 어두운색: #000000 (검정)
#141414 → #1B1D1F → #1D1D1D → #1D1F21 (매우 어두운 회색)
#2B2E32 → #342F2F → #373A40 → #3A3A3A → #3E3E3E (어두운 회색)
#43474F → #434850 → #4A4E55 → #4E525A → #575A60 (중간 회색)
#5C626B → #626872 → #6F7580 → #7A828E → #7B828E (밝은 회색)
#848990 → #8B8B8B → #8E98A8 → #ADADAD → #B1B1B1 (매우 밝은 회색)
#B7BEC5 → #D6D8DC → #D9D9D9 → #DBDBDC (거의 흰색)
#E0E0E0 → #E8E8E8 → #E9EBF8 → #EAECF0 → #EAEEF4 (매우 밝음)
#EBECEE → #EBEEF4 → #F2F3F4 → #F5F5F5 → #FFFFFF (가장 밝은색/흰색)
```

#### 🎨 색상 정의 스타일 (13개)
```
Foundation/
├── b (검정)
├── w (흰색)
└── Grey/
    ├── 10, 20, 30, 40, 50, 60, 70, 80, 90, 100

Label Color/
└── Light/
    └── Primary
```

### 2.2 타이포그래피

#### 현황
- **폰트 정보 추출 불완전** (Figma JSON에서 TEXT 노드 제한)
- 주요 타입은 컴포넌트 내부의 TEXT 프롭으로 관리

#### 추정 계층 (UI에서 관찰 가능)
| 레벨 | 용도 | 예상 크기 |
|------|------|---------|
| H1 | 페이지 제목 | 36-48px |
| H2 | 섹션 제목 | 28-32px |
| H3 | 카드 제목 | 20-24px |
| Body | 본문 텍스트 | 14-16px |
| Small | 보조 텍스트 | 12-14px |
| Label | 버튼 텍스트 | 12-16px |

**권장**: 실제 구현 시 공식 디자인 스펙 문서 참조 필요

### 2.3 간격/크기 시스템 (Spacing Scale)

#### 패딩 (Padding) 값
```
0, 1, 2, 3, 4, 5, 6, 8, 10, 11, ...px
```

#### 갭 (Gap/itemSpacing) 값
```
-1, 2, 3, 4, 6, 7, 8, 9, 10, 11, ...px
```

#### 일반적인 레이아웃 크기
| 용도 | 가능한 값 |
|------|----------|
| 패딩 | 8px, 16px, 24px, 32px |
| 갭 | 8px, 12px, 16px, 24px |
| 버튼 높이 | Medium: ~40px, Large: ~48px |

### 2.4 기타 스타일

#### 코너 반경 (Border Radius)
- 날카로운 코너: 0px (거의 사용 안 함)
- 약간의 반경: 2-4px (버튼)
- 라운드: 8-12px (카드)
- 원형: 50% (아바타)

#### 그림자 (Shadows)
- 일반 (기본): 약한 그림자
- 호버/활성: 중간 그림자
- 모달/대화: 강한 그림자

#### 테두리 (Borders)
- 대부분 색상 기반 (회색 #E0E0E0 또는 #D6D8DC)
- 굵기: 1px
- 상호작용 상태: 파란색 (#1A46E7)

---

## 🧩 3. 컴포넌트 시스템

### 3.1 컴포넌트 세트 전체 (20개)

#### Navigation (네비게이션)
```
1️⃣ Top Navigation Group (Mobile)
   ├─ State: [Enabled, Selected]
   ├─ Selected: [About, Curriculum, Work, News&Event, null]
   └─ Variants: 10개

2️⃣ Top Navigation Group (Web)
   ├─ Type: [Home, About, Curriculum, Work, News&Event]
   └─ Variants: 5개

3️⃣ About/Work Btn (Web)
   ├─ Selected: [on, off, Frame ID]
   ├─ State: [Hover, Enabled, Selected]
   ├─ Drop down: [기본, on, off]
   ├─ Type: [기본, About, Work]
   └─ Variants: 9개

4️⃣ Work/About Btn Group (Mobile)
   ├─ Label On/Off: [BOOLEAN]
   ├─ State: [Selected, Enabled]
   ├─ Type: [Work, About]
   └─ Variants: 4개
```

#### Buttons (버튼)
```
5️⃣ Category Btn (Web)
   ├─ Btn Text: [TEXT PROP]
   ├─ Icon (R): [BOOLEAN]
   ├─ State: [Pressed, Default, Hover]
   ├─ Pressed: [off, on]
   ├─ Size: [Large, Medium]
   └─ Variants: 6개

6️⃣ Category Btn (Mobile)
   ├─ icon (R): [BOOLEAN]
   ├─ Btn: [TEXT PROP]
   ├─ State: [Enabled, Pressed, Hover]
   ├─ Size: [Medium, Large]
   ├─ Pressed: [on, off]
   └─ Variants: 6개

7️⃣ Filter Tabs
   ├─ Filter Tabs: [TEXT PROP]
   ├─ 상태: [Selected, Enabled, Hover]
   ├─ 사이즈: [Large, Medium]
   └─ Variants: 6개
```

#### Content Blocks (콘텐츠)
```
8️⃣ News&Events Card
   ├─ (복합 프롭)
   └─ Variants: 11개

9️⃣ News&Event List Btn
   ├─ News&Event List Btn: [TEXT PROP]
   ├─ display: [web, mobile]
   ├─ 상태: [Hover, default]
   ├─ 방향: [prev, next]
   └─ Variants: 6개

🔟 News&Event Thimbail Image
   ├─ 상태: [Enabled, Hover]
   ├─ Has Image: [off, on]
   ├─ Style: [Empty 1, Image, Empty 2, Empty 3]
   └─ Variants: 8개

1️⃣1️⃣ work_img
   ├─ Property 1: [Default, Hovering, Variant4, exhibition, mobile work, ...]
   └─ Variants: 6개

1️⃣2️⃣ work
   ├─ 프로젝트 이름: [TEXT PROP]
   ├─ 디자이너: [TEXT PROP]
   ├─ 년도: [TEXT PROP]
   ├─ Show chip: [BOOLEAN]
   ├─ display: [web, mobile]
   └─ Variants: 4개

1️⃣3️⃣ home_exhibition card
   ├─ Property 1
   └─ Variants: 2개
```

#### UI Elements (UI 요소)
```
1️⃣4️⃣ chip
   ├─ Text: [TEXT PROP]
   ├─ Property 1: [web, mobile, web_line, mobile_line]
   └─ Variants: 4개

1️⃣5️⃣ More
   ├─ display: [web, mobile]
   ├─ type: [info, file]
   └─ Variants: 4개

1️⃣6️⃣ pagenation
   ├─ Property 1: [web, mobile]
   └─ Variants: 2개

1️⃣7️⃣ footer
   ├─ Property 1
   └─ Variants: 2개

1️⃣8️⃣ navigation
   ├─ Previous prj: [TEXT PROP]
   ├─ Next prj: [TEXT PROP]
   ├─ display: [web, mobile]
   ├─ page: [news&event navigation, work]
   └─ Variants: 4개
```

#### Animation/Special
```
1️⃣9️⃣ main typo animation (×4 같은 이름)
   ├─ Property 1
   └─ Variants: 2개 (각각)

2️⃣0️⃣ Component 63
   ├─ title: [TEXT PROP]
   ├─ Property 1
   └─ Variants: 2개
```

### 3.2 주요 컴포넌트 관계도

```
┌─────────────────────────────────────────────────────┐
│              NAVIGATION LAYER                        │
├─────────────────────────────────────────────────────┤
│  Top Nav (Web)                   Top Nav (Mobile)    │
│  ├─ Top Navigation Group (Web)   ├─ Top Nav Group   │
│  ├─ About/Work Btn               ├─ Category Btn    │
│  └─ More button                  └─ Work/About Btn  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              CONTENT LAYER                           │
├─────────────────────────────────────────────────────┤
│  ┌─ News&Events Card                                │
│  ├─ work (project card)                             │
│  ├─ work_img (image component)                      │
│  ├─ home_exhibition card                            │
│  └─ News&Event Thumbnail                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              FILTERING/PAGINATION                   │
├─────────────────────────────────────────────────────┤
│  ├─ Filter Tabs (상태: Selected/Enabled/Hover)     │
│  ├─ chip (필터 칩)                                  │
│  ├─ pagenation (페이지네이션)                      │
│  ├─ navigation (이전/다음)                          │
│  └─ News&Event List Btn (목록 버튼)                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              FOOTER                                 │
├─────────────────────────────────────────────────────┤
│  └─ footer (web/mobile responsive)                  │
└─────────────────────────────────────────────────────┘
```

---

## 📱 4. 반응형 설계

### 4.1 Breakpoints

| 디바이스 | 상태 | 컴포넌트 |
|---------|------|---------|
| **Web** | - | Category Btn (web), Top Nav (web), About/Work Btn (web), Filter Tabs, More (web) |
| **Mobile** | - | Top Navigation Group (Mobile), Category Btn (mobile), Work/About Btn Group (mobile), More (mobile) |

### 4.2 Responsive Strategy

1. **분리된 컴포넌트**: Web과 Mobile이 완전히 다른 컴포넌트로 구성
   - Top Navigation: 완전히 다른 레이아웃
   - Category Buttons: 크기와 배치 다름
   - More button: display 프롭으로 표시 제어

2. **공유 컴포넌트**: `display` 프롭으로 Web/Mobile 관리
   - More
   - chip
   - pagenation
   - navigation
   - News&Event List Btn

3. **전체 페이지**: 각 섹션별로 Web/Mobile 프레임 분리
   ```
   Home_
   ├─ Web: main 시안_스크롤 애니메이션 O
   └─ Mobile: (별도 프레임)

   Curriculum
   ├─ Web: 커리큘럼 ×3
   └─ Mobile: 커리큘럼_mobile ×2
   ```

### 4.3 예상 화면 너비

| 디바이스 | 예상 너비 | 기준 |
|---------|---------|------|
| Mobile | 320-375px | iPhone SE ~ iPhone 14/15 Pro |
| Tablet | 768-1024px | iPad |
| Desktop | 1440px+ | 표준 데스크톱 |

---

## 🖼️ 5. 이미지 & 에셋

### 5.1 현황
- **Figma JSON에서 이미지 정보 추출 제한**
- 이미지는 대부분 프레임 내부에 포함되어 있음

### 5.2 추정 이미지 타입

| 카테고리 | 추정 위치 | 용도 |
|----------|---------|------|
| **Hero Image** | Home_ > main 시안 | 메인 배경/영상 |
| **Project Images** | Work > work_img | 포트폴리오 이미지 |
| **Thumbnail** | News&Event > News&Event Thumbnail | 뉴스/이벤트 썸네일 |
| **Exhibition** | Home_ > home_exhibition card | 전시 이미지 |
| **People Photos** | People > OurPeople | 교수진 사진 |
| **Curriculum Images** | Curriculum > 커리큘럼 이미지 | 교과과정 이미지 |
| **Logo** | Navigation > Logo | 학과 로고 |

### 5.3 아이콘 전략

- 벡터(SVG) 기반으로 구현 (색상 변경 용이)
- 컴포넌트 프롭으로 아이콘 표시/숨김 제어
  ```
  Category Btn (web/mobile)
  └─ Icon (R): [BOOLEAN] → 아이콘 표시/숨김

  More
  └─ type: [info, file] → 아이콘 타입 변경
  ```

---

## ⚛️ 6. React 폴더 구조 & 구현 가이드

### 6.1 추천 폴더 구조

```
src/
├── components/
│   ├── common/                          # 공용 컴포넌트
│   │   ├── Header/
│   │   │   ├── TopNavigationWeb.tsx    # Web 네비게이션
│   │   │   ├── TopNavigationMobile.tsx # Mobile 네비게이션
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   ├── Navigation/
│   │   │   ├── Navigation.tsx           # 페이지 이동 네비
│   │   │   ├── Pagination.tsx
│   │   │   └── index.ts
│   │   └── Button/
│   │       ├── CategoryBtn.tsx
│   │       ├── FilterTabs.tsx
│   │       └── index.ts
│   │
│   ├── cards/                           # 카드 컴포넌트
│   │   ├── NewsEventCard.tsx           # News&Event Card
│   │   ├── ProjectCard.tsx             # Work Card
│   │   ├── ExhibitionCard.tsx          # Home Exhibition
│   │   ├── Chip.tsx                    # 칩/태그
│   │   └── index.ts
│   │
│   ├── sections/                        # 섹션/페이지 모듈
│   │   ├── Home/
│   │   │   ├── HomeWeb.tsx
│   │   │   ├── HomeMobile.tsx
│   │   │   ├── useHomeAnimation.ts     # 스크롤 애니메이션
│   │   │   └── index.ts
│   │   │
│   │   ├── About/
│   │   │   ├── AboutWeb.tsx
│   │   │   ├── AboutMobile.tsx
│   │   │   ├── AboutDetail.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Curriculum/
│   │   │   ├── CurriculumWeb.tsx
│   │   │   ├── CurriculumMobile.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── People/
│   │   │   ├── PeopleWeb.tsx
│   │   │   ├── PeopleMobile.tsx
│   │   │   ├── PeopleDetail.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Work/
│   │   │   ├── WorkWeb.tsx
│   │   │   ├── WorkMobile.tsx
│   │   │   ├── WorkDetail.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── NewsEvent/
│   │       ├── NewsEventWeb.tsx
│   │       ├── NewsEventMobile.tsx
│   │       ├── NewsEventDetail.tsx
│   │       └── index.ts
│   │
│   └── ui/                              # 원시 UI 요소
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── LoadingSpinner.tsx
│       └── index.ts
│
├── layouts/
│   ├── MainLayout.tsx                  # 기본 레이아웃
│   └── DetailLayout.tsx                # 상세 페이지 레이아웃
│
├── pages/                               # 페이지 라우트
│   ├── index.tsx                       # /
│   ├── about.tsx                       # /about
│   ├── curriculum.tsx                  # /curriculum
│   ├── people.tsx                      # /people
│   ├── work/
│   │   ├── index.tsx                   # /work
│   │   └── [id].tsx                    # /work/:id (상세)
│   ├── news-events/
│   │   ├── index.tsx                   # /news-events
│   │   └── [id].tsx                    # /news-events/:id
│   └── [...404].tsx
│
├── hooks/
│   ├── useResponsive.ts                # 반응형 감지
│   ├── useAnimation.ts                 # 스크롤 애니메이션
│   ├── useNewsEvents.ts                # 뉴스/이벤트 데이터
│   ├── useWork.ts                      # 작업/포트폴리오 데이터
│   └── usePeople.ts                    # 사람 정보 데이터
│
├── context/
│   ├── NavigationContext.tsx           # 네비게이션 상태
│   ├── ThemeContext.tsx                # 테마 (라이트/다크)
│   └── AuthContext.tsx                 # 인증 (필요시)
│
├── types/
│   ├── api.ts                          # API 응답 타입
│   ├── domain.ts                       # 비즈니스 모델
│   ├── ui.ts                           # UI 컴포넌트 프롭
│   └── index.ts
│
├── constants/
│   ├── colors.ts                       # 색상 토큰
│   ├── spacing.ts                      # 간격 토큰
│   ├── breakpoints.ts                  # 반응형 breakpoint
│   ├── routes.ts                       # 라우트 정의
│   └── index.ts
│
├── styles/
│   ├── globals.css                     # 전역 스타일
│   ├── typography.css                  # 타이포그래피
│   ├── animations.css                  # 애니메이션
│   └── responsive.css                  # 반응형 유틸리티
│
├── services/
│   ├── api.ts                          # API 호출
│   ├── newsEventService.ts
│   ├── workService.ts
│   ├── peopleService.ts
│   └── index.ts
│
├── utils/
│   ├── responsive.ts                   # 반응형 유틸
│   ├── animations.ts                   # 애니메이션 유틸
│   ├── formatting.ts                   # 텍스트 포맷팅
│   └── index.ts
│
├── App.tsx
└── index.tsx
```

### 6.2 핵심 컴포넌트 구현 예제

#### 네비게이션 (web/mobile 분리)
```typescript
// components/common/Header/TopNavigationWeb.tsx
interface TopNavigationWebProps {
  activeSection: 'Home' | 'About' | 'Curriculum' | 'Work' | 'News&Event';
  onNavigate: (section: string) => void;
}

export const TopNavigationWeb: React.FC<TopNavigationWebProps> = ({
  activeSection,
  onNavigate
}) => {
  return (
    <nav className="top-nav-web">
      <Logo />
      <NavItems
        items={['Home', 'About', 'Curriculum', 'Work', 'News&Event']}
        active={activeSection}
        onNavigate={onNavigate}
      />
      <More display="web" type="info" />
    </nav>
  );
};

// components/common/Header/TopNavigationMobile.tsx
interface TopNavigationMobileProps {
  activeSection?: string;
  onSelect: (section: string) => void;
}

export const TopNavigationMobile: React.FC<TopNavigationMobileProps> = ({
  activeSection,
  onSelect
}) => {
  return (
    <nav className="top-nav-mobile">
      <Logo />
      <TopNavigationGroupMobile
        state="Enabled"
        selected={activeSection || 'null'}
        onSelect={onSelect}
      />
    </nav>
  );
};
```

#### 카드 컴포넌트 (프롭 기반)
```typescript
// components/cards/NewsEventCard.tsx
interface NewsEventCardProps {
  title: string;
  thumbnail?: string;
  description: string;
  date: Date;
  tags?: string[];
  variant?: 'default' | 'hovering';
}

export const NewsEventCard: React.FC<NewsEventCardProps> = ({
  title,
  thumbnail,
  description,
  date,
  tags = [],
  variant = 'default'
}) => {
  return (
    <article className={`news-event-card news-event-card--${variant}`}>
      <NewsEventThumbnailImage
        hasImage={!!thumbnail}
        imageSrc={thumbnail}
        state={variant === 'hovering' ? 'Hover' : 'Enabled'}
      />
      <div className="card-content">
        <h3>{title}</h3>
        <time>{formatDate(date)}</time>
        <p>{description}</p>
        {tags.length > 0 && (
          <div className="tags">
            {tags.map(tag => (
              <Chip key={tag} text={tag} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
```

### 6.3 디자인 토큰 (Tailwind/CSS)

#### colors.ts
```typescript
export const colors = {
  // Primary
  primary: {
    deepBlue: '#0845A7',
    blue: '#1A46E7',
    lightBlue: '#489AFF',
    teal: '#1ABC9C'
  },

  // Accent
  accent: {
    purple: '#9747FF',
    lightPurple: '#A14AFF'
  },

  // Semantic
  semantic: {
    error: '#FF0000',
    errorLight: '#FF5F59',
    warning: '#FFCB53'
  },

  // Neutral
  neutral: {
    0: '#FFFFFF',
    10: '#F5F5F5',
    20: '#F2F3F4',
    30: '#EBEEF4',
    40: '#EAECF0',
    50: '#E9EBF8',
    60: '#E8E8E8',
    70: '#E0E0E0',
    80: '#DBDBDC',
    90: '#D9D9D9',
    100: '#D6D8DC',
    200: '#B7BEC5',
    300: '#8E98A8',
    400: '#8B8B8B',
    500: '#848990',
    600: '#7B828E',
    700: '#7A828E',
    800: '#6F7580',
    900: '#626872',
    1000: '#5C626B',
    1100: '#575A60',
    1200: '#4E525A',
    1300: '#4A4E55',
    1400: '#434850',
    1500: '#43474F',
    1600: '#3E3E3E',
    1700: '#3A3A3A',
    1800: '#373A40',
    1900: '#342F2F',
    2000: '#2B2E32',
    2100: '#1D1F21',
    2200: '#1D1D1D',
    2300: '#1B1D1F',
    2400: '#141414',
    2500: '#000000'
  }
} as const;
```

#### spacing.ts
```typescript
export const spacing = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px'
} as const;

export const gaps = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px'
} as const;
```

### 6.4 반응형 구현 전략

#### breakpoints.ts
```typescript
export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',

  // 값으로도 사용 가능
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;
```

#### useResponsive.ts
```typescript
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// 사용
const MyComponent = () => {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileNav /> : <DesktopNav />;
};
```

### 6.5 상태 관리 (Context)

#### NavigationContext.tsx
```typescript
interface NavigationContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <NavigationContext.Provider value={{
      activeSection,
      setActiveSection,
      isMenuOpen,
      toggleMenu
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
```

---

## 📋 7. 구현 체크리스트

### Phase 1: 기초 구조 & 설정
- [ ] React 프로젝트 생성 (Next.js 권장)
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정 (색상 토큰 추가)
- [ ] 폴더 구조 생성
- [ ] 라우팅 설정 (React Router 또는 Next.js Pages/App Router)
- [ ] 디자인 토큰 파일 생성 (colors.ts, spacing.ts, breakpoints.ts)

### Phase 2: 공용 컴포넌트 구현
#### Navigation
- [ ] TopNavigationWeb 컴포넌트
- [ ] TopNavigationMobile 컴포넌트
- [ ] Logo 컴포넌트
- [ ] NavItems 컴포넌트
- [ ] More 버튼 (display 프롭)

#### Buttons & Controls
- [ ] CategoryBtn (Web)
- [ ] CategoryBtn (Mobile)
- [ ] FilterTabs
- [ ] Chip/Tag 컴포넌트
- [ ] Navigation (이전/다음) 컴포넌트
- [ ] Pagination 컴포넌트

#### Footer & Common
- [ ] Footer 컴포넌트
- [ ] Loading Spinner
- [ ] useResponsive 훅

### Phase 3: 페이지 섹션 구현
#### Home (메인)
- [ ] Hero 섹션 (스크롤 애니메이션)
- [ ] Exhibition Card 컴포넌트
- [ ] useHomeAnimation 훅 구현
- [ ] HomeWeb 레이아웃
- [ ] HomeMobile 레이아웃

#### About Major
- [ ] About 페이지 콘텐츠
- [ ] AboutWeb 레이아웃
- [ ] AboutMobile 레이아웃
- [ ] AboutDetail 페이지

#### Curriculum
- [ ] Curriculum 리스트 표시
- [ ] 이미지 갤러리 (학부/대학원)
- [ ] CurriculumWeb 레이아웃
- [ ] CurriculumMobile 레이아웃

#### People / Our People
- [ ] 교수진 목록
- [ ] PeopleCard 컴포넌트
- [ ] PeopleDetail 페이지
- [ ] PeopleWeb 레이아웃
- [ ] PeopleMobile 레이아웃
- [ ] 로딩 인터랙션

#### Work / Portfolio
- [ ] 작업 목록 (카드 그리드)
- [ ] ProjectCard (work 컴포넌트)
- [ ] work_img 이미지 컴포넌트
- [ ] WorkDetail 페이지
- [ ] WorkWeb 레이아웃
- [ ] WorkMobile 레이아웃
- [ ] 필터링 (칩 기반)
- [ ] 페이지네이션

#### News & Events
- [ ] NewsEventCard 컴포넌트
- [ ] NewsEventThumbnail 컴포넌트
- [ ] NewsEventDetail 페이지
- [ ] NewsEventListBtn
- [ ] NewsEventWeb 레이아웃
- [ ] NewsEventMobile 레이아웃
- [ ] 상세 페이지 (notice, file, event)

### Phase 4: 상호작용 & 상태 관리
- [ ] NavigationContext 설정
- [ ] 페이지 네비게이션 로직
- [ ] 페이지 상태 유지
- [ ] 모바일 메뉴 토글
- [ ] 필터 상태 관리
- [ ] 페이지네이션 상태

### Phase 5: API 통합
- [ ] API 서비스 구조 설계
- [ ] News & Events API
- [ ] Work/Portfolio API
- [ ] People 데이터 API
- [ ] Curriculum API
- [ ] 데이터 타입 정의

### Phase 6: 애니메이션 & 상호작용
- [ ] 스크롤 애니메이션 (Home 메인)
- [ ] Hover 효과 (카드, 버튼)
- [ ] 로딩 인터랙션 (각 섹션)
- [ ] 페이지 전환 애니메이션
- [ ] 모바일 네비 애니메이션

### Phase 7: 최적화 & 테스트
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화
- [ ] SEO 최적화
- [ ] 접근성(A11y) 체크
- [ ] 반응형 테스트 (모바일/태블릿/데스크톱)
- [ ] 성능 테스트 (Lighthouse)
- [ ] 브라우저 호환성 테스트

### Phase 8: 배포
- [ ] 환경 변수 설정
- [ ] 빌드 최적화
- [ ] 프로덕션 배포
- [ ] CDN/캐싱 설정
- [ ] 모니터링 설정

---

## 📊 8. 요약 & 주의사항

### 주요 특징
1. **2계층 반응형 설계**: Web과 Mobile이 명확히 분리
2. **컴포넌트 기반**: 20개의 재사용 컴포넌트 세트
3. **프롭 기반 커스터마이징**: TEXT, BOOLEAN, VARIANT 프롭 활용
4. **색상 시스템**: 48개 색상, 명확한 Grey Scale (16단계)
5. **섹션별 독립성**: 각 페이지가 별도 섹션으로 관리

### 구현 주의사항

1. **타이포그래피**
   - Figma JSON에 폰트 정보 제한
   - 공식 디자인 스펙 문서에서 정확한 폰트명/크기 확인 필수

2. **이미지 관리**
   - 배경 이미지, 포트폴리오, 썸네일 최적화 중요
   - Next.js Image 컴포넌트 사용 권장

3. **애니메이션**
   - 스크롤 애니메이션 (Home)
   - 로딩 인터랙션 (각 섹션)
   - Framer Motion 또는 Intersection Observer 활용

4. **반응형 전략**
   - 완전히 다른 컴포넌트: TopNav, CategoryBtn
   - display 프롭으로 제어: More, chip, pagination
   - CSS 미디어쿼리: 세부 스타일

5. **SEO & 성능**
   - 메인 콘텐츠 우선 로딩
   - 이미지 lazy loading
   - 메타 태그 (og, twitter)
   - Structured Data (JSON-LD)

6. **접근성(A11y)**
   - ARIA 라벨 추가 (네비게이션, 버튼)
   - 색상 콘트라스트 확인
   - 키보드 네비게이션 지원
   - Focus 인디케이터

---

## 🔗 참고 자료

### 색상 참고
- 각 색상은 RGB 기반으로 변환됨
- Figma Design Tokens 시스템 사용 (Foundation/Grey, Label Color)

### 컴포넌트 계층
- 보다 정확한 프롭 값은 Figma 설계 파일에서 각 COMPONENT_SET의 `componentPropertyDefinitions` 참조

### 반응형 크기
- 정확한 breakpoint 값은 실제 설계 프레임 너비 확인 필요
- 표준: Mobile (375px), Tablet (768px), Desktop (1440px+)

---

**작성일**: 2026-02-12
**분석 대상**: `/tmp/figma_data.json` (53.1MB)
**분석 방법**: Python JSON 파싱 + 계층 구조 추출
