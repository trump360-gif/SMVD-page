# Work Data Mapping - 12 Projects + 6 Exhibition Items

---

## 1. 데이터 소스 파일 목록

| 파일 | 역할 | 데이터 수 |
|------|------|-----------|
| `src/constants/work-details.ts` | Work 상세 페이지 데이터 (12개 프로젝트) | 12 |
| `src/components/public/work/WorkArchive.tsx` | Work 목록 (portfolioItems 12개 + exhibitionItems 6개) | 18 |
| `src/components/public/work/WorkDetailPage.tsx` | 상세 페이지 렌더링 컴포넌트 | - |
| `src/components/public/work/WorkHeader.tsx` | 카테고리 필터 헤더 | - |

---

## 2. WorkDetail (work-details.ts) - 12개 프로젝트 완전 매핑

### 프로젝트 #1: Vora
| 필드 | 값 |
|------|-----|
| id | `'1'` |
| title | `'Vora'` |
| subtitle | `'권나연 외 3명, 2025'` |
| category | `'UX/UI'` |
| tags | `['UX/UI']` |
| author | `'권나연'` |
| email | `'contact@vora.com'` |
| description | `'Vora UX/UI Design Project.\n\n'` |
| heroImage | `/images/work/vora/hero.png` |
| galleryImages | `/images/work/vora/gallery-1.png`, `/images/work/vora/gallery-2.png`, `/images/work/vora/gallery-3.png` |
| previousProject | `{ id: '12', title: '고군분투' }` |
| nextProject | `{ id: '2', title: 'Mindit' }` |

### 프로젝트 #2: Mindit
| 필드 | 값 |
|------|-----|
| id | `'2'` |
| title | `'Mindit'` |
| subtitle | `'도인영 외 3명, 2025'` |
| category | `'UX/UI'` |
| tags | `['UX/UI']` |
| author | `'도인영'` |
| email | `'contact@mindit.com'` |
| description | `'Mindit UX/UI Design Project.\n\n'` |
| heroImage | `/images/work/mindit/hero.png` |
| galleryImages | `/images/work/mindit/gallery-1.png`, `/images/work/mindit/gallery-2.png`, `/images/work/mindit/gallery-3.png` |
| previousProject | `{ id: '1', title: 'Vora' }` |
| nextProject | `{ id: '3', title: 'StarNew Valley' }` |

### 프로젝트 #3: StarNew Valley
| 필드 | 값 |
|------|-----|
| id | `'3'` |
| title | `'StarNew Valley'` |
| subtitle | `'안시현 외 3명, 2025'` |
| category | `'Game'` |
| tags | `['Game']` |
| author | `'안시현'` |
| email | `'contact@starnewvalley.com'` |
| description | `'StarNew Valley Game Design Project.\n\n'` |
| heroImage | `/images/work/starnewvalley/hero.png` |
| galleryImages | `/images/work/starnewvalley/gallery-1.png`, `/images/work/starnewvalley/gallery-2.png`, `/images/work/starnewvalley/gallery-3.png` |
| previousProject | `{ id: '2', title: 'Mindit' }` |
| nextProject | `{ id: '4', title: 'Pave' }` |

### 프로젝트 #4: Pave
| 필드 | 값 |
|------|-----|
| id | `'4'` |
| title | `'Pave'` |
| subtitle | `'박지우 외 2명, 2025'` |
| category | `'UX/UI'` |
| tags | `['UX/UI']` |
| author | `'박지우'` |
| email | `'contact@pave.com'` |
| description | `'Pave UX/UI Design Project.\n\n'` |
| heroImage | `/images/work/pave/hero.png` |
| galleryImages | `/images/work/pave/gallery-1.png`, `/images/work/pave/gallery-2.png`, `/images/work/pave/gallery-3.png` |
| previousProject | `{ id: '3', title: 'StarNew Valley' }` |
| nextProject | `{ id: '5', title: 'Bolio' }` |

### 프로젝트 #5: Bolio
| 필드 | 값 |
|------|-----|
| id | `'5'` |
| title | `'Bolio'` |
| subtitle | `'박근영, 2025'` |
| category | `'UX/UI'` |
| tags | `['UX/UI']` |
| author | `'박근영'` |
| email | `'contact@bolio.com'` |
| description | `'Bolio UX/UI Design Project.\n\n'` |
| heroImage | `/images/work/bolio/hero.png` |
| galleryImages | `/images/work/bolio/gallery-1.png`, `/images/work/bolio/gallery-2.png`, `/images/work/bolio/gallery-3.png` |
| previousProject | `{ id: '4', title: 'Pave' }` |
| nextProject | `{ id: '6', title: 'MIST AWAY' }` |

### 프로젝트 #6: MIST AWAY
| 필드 | 값 |
|------|-----|
| id | `'6'` |
| title | `'MIST AWAY'` |
| subtitle | `'신예지, 2025'` |
| category | `'UX/UI'` |
| tags | `['UX/UI']` |
| author | `'신예지'` |
| email | `'contact@mistaway.com'` |
| description | `'MIST AWAY UX/UI Design Project.\n\n'` |
| heroImage | `/images/work/mistaway/hero.png` |
| galleryImages | `/images/work/mistaway/gallery-1.png`, `/images/work/mistaway/gallery-2.png`, `/images/work/mistaway/gallery-3.png` |
| previousProject | `{ id: '5', title: 'Bolio' }` |
| nextProject | `{ id: '7', title: 'BICHAE' }` |

### 프로젝트 #7: BICHAE
| 필드 | 값 |
|------|-----|
| id | `'7'` |
| title | `'BICHAE'` |
| subtitle | `'최은정, 2025'` |
| category | `'Branding'` |
| tags | `['Branding']` |
| author | `'최은정'` |
| email | `'contact@bichae.com'` |
| description | `'BICHAE Branding Design Project.\n\n'` |
| heroImage | `/images/work/bichae/hero.png` |
| galleryImages | `/images/work/bichae/gallery-1.png`, `/images/work/bichae/gallery-2.png`, `/images/work/bichae/gallery-3.png` |
| previousProject | `{ id: '6', title: 'MIST AWAY' }` |
| nextProject | `{ id: '8', title: 'Morae' }` |

### 프로젝트 #8: Morae
| 필드 | 값 |
|------|-----|
| id | `'8'` |
| title | `'Morae'` |
| subtitle | `'고은서, 2023'` |
| category | `'UX/UI'` |
| tags | `['UX/UI']` |
| author | `'고은서'` |
| email | `'contact@morae.com'` |
| description | `'Morae UX/UI Design Project.\n\n'` |
| heroImage | `/images/work/morae/hero.png` |
| galleryImages | `/images/work/morae/gallery-1.png`, `/images/work/morae/gallery-2.png`, `/images/work/morae/gallery-3.png` |
| previousProject | `{ id: '7', title: 'BICHAE' }` |
| nextProject | `{ id: '9', title: 'STUDIO KNOT' }` |

### 프로젝트 #9: STUDIO KNOT (가장 복잡한 프로젝트)
| 필드 | 값 |
|------|-----|
| id | `'9'` |
| title | `'STUDIO KNOT'` |
| subtitle | `'노하린, 2025'` |
| category | `'Branding'` |
| tags | `['UX/UI', 'Graphic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game']` (7개 태그!) |
| author | `'노하린'` |
| email | `'havein6@gmail.com'` |
| description | (아래 참조 - 장문) |
| heroImage | `/images/work/knot/hero.png` |
| galleryImages | 9개 (아래 참조) |
| previousProject | `{ id: '8', title: 'Morae' }` |
| nextProject | `{ id: '10', title: 'BLOME' }` |

**STUDIO KNOT description (원문 보존 필수):**
```
STUDIO KNOT는 입지 않는 옷에 새로운 쓰임을 더해 반려견 장난감으로 재탄생시키는 업사이클링 터그 토이 브랜드입니다.
쉽게 버려지는 의류와 빠르게 닳는 반려견 장난감의 순환 구조를 개선하며, 보호자의 체취가 남은 옷으로 만든 토이는
정서적 가치를 담은 지속가능한 대안을 제시합니다.
```

**STUDIO KNOT galleryImages (9개 - 최다):**
1. `/images/work/knot/text-below.png`
2. `/images/work/knot/gallery-1.png`
3. `/images/work/knot/gallery-2.png`
4. `/images/work/knot/gallery-3.png`
5. `/images/work/knot/gallery-4.png`
6. `/images/work/knot/gallery-5.png`
7. `/images/work/knot/gallery-6.png`
8. `/images/work/knot/gallery-7.png`
9. `/images/work/knot/gallery-8.png`

### 프로젝트 #10: BLOME
| 필드 | 값 |
|------|-----|
| id | `'10'` |
| title | `'BLOME'` |
| subtitle | `'김진아 외 1명, 2025'` |
| category | `'Branding'` |
| tags | `['Branding']` |
| author | `'김진아'` |
| email | `'contact@blome.com'` |
| description | `'BLOME Branding Design Project.\n\n'` |
| heroImage | `/images/work/blome/hero.png` |
| galleryImages | `/images/work/blome/gallery-1.png`, `/images/work/blome/gallery-2.png`, `/images/work/blome/gallery-3.png` |
| previousProject | `{ id: '9', title: 'STUDIO KNOT' }` |
| nextProject | `{ id: '11', title: 'alors: romanticize your life, every...' }` |

### 프로젝트 #11: alors: romanticize your life, every...
| 필드 | 값 |
|------|-----|
| id | `'11'` |
| title | `'alors: romanticize your life, every...'` |
| subtitle | `'정유진, 2025'` |
| category | `'Motion'` |
| tags | `['Motion']` |
| author | `'정유진'` |
| email | `'contact@alors.com'` |
| description | `'alors: romanticize your life, every... Motion Design Project.\n\n'` |
| heroImage | `/images/work/alors/hero.png` |
| galleryImages | `/images/work/alors/gallery-1.png`, `/images/work/alors/gallery-2.png`, `/images/work/alors/gallery-3.png` |
| previousProject | `{ id: '10', title: 'BLOME' }` |
| nextProject | `{ id: '12', title: '고군분투' }` |

### 프로젝트 #12: 고군분투
| 필드 | 값 |
|------|-----|
| id | `'12'` |
| title | `'고군분투'` |
| subtitle | `'한다인, 2025'` |
| category | `'Motion'` |
| tags | `['Motion']` |
| author | `'한다인'` |
| email | `'contact@gogoonbunstu.com'` |
| description | `'고군분투 Motion Design Project.\n\n'` |
| heroImage | `/images/work/gogoonbunstu/hero.png` |
| galleryImages | `/images/work/gogoonbunstu/gallery-1.png`, `/images/work/gogoonbunstu/gallery-2.png`, `/images/work/gogoonbunstu/gallery-3.png` |
| previousProject | `{ id: '11', title: 'alors: romanticize your life, every...' }` |
| nextProject | `{ id: '1', title: 'Vora' }` (순환) |

---

## 3. WorkArchive portfolioItems (목록 썸네일) - 12개

| id | category | title | date | subtitle | image |
|----|----------|-------|------|----------|-------|
| 1 | UX/UI | Vora | 2025 | 권나연 외 3명, 2025 | `/images/work/portfolio-12.png` |
| 2 | UX/UI | Mindit | 2025 | 도인영 외 3명, 2025 | `/images/work/portfolio-10.png` |
| 3 | Game | StarNew Valley | 2025 | 안시현 외 3명, 2025 | `/images/work/portfolio-9.png` |
| 4 | UX/UI | Pave | 2025 | 박지우 외 2명, 2025 | `/images/work/portfolio-11.png` |
| 5 | UX/UI | Bolio | 2025 | 박근영, 2025 | `/images/work/portfolio-7.png` |
| 6 | UX/UI | MIST AWAY | 2025 | 신예지, 2025 | `/images/work/portfolio-6.png` |
| 7 | Branding | BICHAE | 2025 | 최은정, 2025 | `/images/work/portfolio-5.png` |
| 8 | UX/UI | Morae | 2023 | 고은서, 2023 | `/images/work/portfolio-4.png` |
| 9 | Branding | STUDIO KNOT | 2025 | 노하린, 2025 | `/images/work/portfolio-3.png` |
| 10 | Branding | BLOME | 2025 | 김진아 외 1명, 2025 | `/images/work/portfolio-8.png` |
| 11 | Motion | alors: romanticize your life, every... | 2025 | 정유진, 2025 | `/images/work/portfolio-2.png` |
| 12 | Motion | 고군분투 | 2025 | 한다인, 2025 | `/images/work/portfolio-1.png` |

---

## 4. WorkArchive exhibitionItems (전시 탭) - 6개

| id | title | date | image | artist |
|----|-------|------|-------|--------|
| 1 | Vora | 권나연 외 3명, 2025 | `/images/exhibition/Rectangle 45-5.png` | Voice Out Recovery Assistant |
| 2 | Mindit | 도인영 외 3명, 2025 | `/images/exhibition/Rectangle 45-4.png` | 도민앱 외 3명 |
| 3 | MIST AWAY | 신예지, 2025 | `/images/exhibition/Rectangle 45-3.png` | 신예지 |
| 4 | GALJIDO (갈지도) | 조혜원, 2025 | `/images/exhibition/Rectangle 45-2.png` | 조혜원 |
| 5 | Callmate | 고은빈, 2025 | `/images/exhibition/Rectangle 45-1.png` | 고은빈 |
| 6 | MOA | 강세정 외 2명, 2025 | `/images/exhibition/Rectangle 45.png` | 강세정 |

---

## 5. 카테고리 분류

### 프로젝트 카테고리 분포
| 카테고리 | 개수 | 프로젝트 |
|---------|------|---------|
| UX/UI | 6 | Vora, Mindit, Pave, Bolio, MIST AWAY, Morae |
| Branding | 3 | BICHAE, STUDIO KNOT, BLOME |
| Motion | 2 | alors, 고군분투 |
| Game | 1 | StarNew Valley |
| Graphics | 0 | (없음) |

### 필터 카테고리 (WorkHeader)
`['All', 'UX/UI', 'Motion', 'Branding', 'Game', 'Graphics']`

---

## 6. 이미지 경로 전체 목록

### Detail Hero Images (12개)
```
/images/work/vora/hero.png
/images/work/mindit/hero.png
/images/work/starnewvalley/hero.png
/images/work/pave/hero.png
/images/work/bolio/hero.png
/images/work/mistaway/hero.png
/images/work/bichae/hero.png
/images/work/morae/hero.png
/images/work/knot/hero.png
/images/work/blome/hero.png
/images/work/alors/hero.png
/images/work/gogoonbunstu/hero.png
```

### Detail Gallery Images (총 42개)
```
/images/work/vora/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/mindit/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/starnewvalley/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/pave/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/bolio/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/mistaway/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/bichae/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/morae/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/knot/text-below.png, gallery-1~8.png (9)
/images/work/blome/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/alors/gallery-1.png, gallery-2.png, gallery-3.png (3)
/images/work/gogoonbunstu/gallery-1.png, gallery-2.png, gallery-3.png (3)
```

### Portfolio Thumbnails (12개 - 목록용)
```
/images/work/portfolio-1.png  (고군분투)
/images/work/portfolio-2.png  (alors)
/images/work/portfolio-3.png  (STUDIO KNOT)
/images/work/portfolio-4.png  (Morae)
/images/work/portfolio-5.png  (BICHAE)
/images/work/portfolio-6.png  (MIST AWAY)
/images/work/portfolio-7.png  (Bolio)
/images/work/portfolio-8.png  (BLOME)
/images/work/portfolio-9.png  (StarNew Valley)
/images/work/portfolio-10.png (Mindit)
/images/work/portfolio-11.png (Pave)
/images/work/portfolio-12.png (Vora)
```

### Exhibition Images (6개)
```
/images/exhibition/Rectangle 45-5.png (Vora)
/images/exhibition/Rectangle 45-4.png (Mindit)
/images/exhibition/Rectangle 45-3.png (MIST AWAY)
/images/exhibition/Rectangle 45-2.png (GALJIDO)
/images/exhibition/Rectangle 45-1.png (Callmate)
/images/exhibition/Rectangle 45.png   (MOA)
```

---

## 7. 네비게이션 구조 (prev/next 순환)

```
12(고군분투) -> 1(Vora) -> 2(Mindit) -> 3(StarNew Valley) -> 4(Pave) -> 5(Bolio)
-> 6(MIST AWAY) -> 7(BICHAE) -> 8(Morae) -> 9(STUDIO KNOT) -> 10(BLOME)
-> 11(alors) -> 12(고군분투) -> 1(Vora)  [순환 구조]
```

---

## 8. DB 필드 매핑 (work-details.ts -> WorkProject 모델)

| 하드코딩 필드 | DB 필드 | DB 타입 | 비고 |
|-------------|--------|--------|------|
| id | id | String (cuid) | 자동 생성, 기존 숫자 ID는 slug로 보존 |
| - | slug | String (unique) | 기존 id 값: '1', '2', ... '12' |
| title | title | String | 그대로 |
| subtitle | subtitle | String | 그대로 |
| category | category | String | 그대로 |
| tags | tags | String[] | PostgreSQL 배열 |
| author | author | String | 그대로 |
| email | email | String | 그대로 |
| description | description | String | `\n` 포함 텍스트 |
| heroImage | heroImage | String | 이미지 경로 |
| galleryImages | galleryImages | Json | 문자열 배열 (3~9개) |
| - | thumbnailImage | String | WorkArchive용 portfolio-*.png 경로 |
| - | year | String | subtitle에서 추출 ('2025', '2023') |
| - | order | Int | 목록 순서 (1~12) |
| - | published | Boolean | 공개 여부 |
| previousProject | - | - | order로 동적 계산 (순환) |
| nextProject | - | - | order로 동적 계산 (순환) |

### WorkExhibition 모델 매핑 (exhibitionItems -> WorkExhibition)

| 하드코딩 필드 | DB 필드 | DB 타입 | 비고 |
|-------------|--------|--------|------|
| id | id | String (cuid) | 자동 생성 |
| title | title | String | 그대로 |
| date | subtitle | String | 작가명+연도 (예: '권나연 외 3명, 2025') |
| image | image | String | 이미지 경로 |
| artist | artist | String | 그대로 |
| - | order | Int | 표시 순서 |
| - | year | String | '2025' |
| - | published | Boolean | 공개 여부 |

---

## 9. 특이사항 및 주의점

1. **STUDIO KNOT (#9)** 는 다른 프로젝트와 달리 태그가 7개이고 갤러리 이미지가 9개 (최다)
2. **순환 네비게이션**: 12 -> 1 -> 2 -> ... -> 12 순환 구조. DB에서는 order 기반으로 동적 계산
3. **thumbnailImage vs heroImage**: 목록에서 사용하는 이미지(portfolio-*.png)와 상세에서 사용하는 이미지(hero.png)가 다름
4. **Morae (#8)** 만 연도가 2023, 나머지는 모두 2025
5. **갤러리 이미지 개수**: 대부분 3개, STUDIO KNOT만 9개
6. **Exhibition 아이템**: 포트폴리오 12개와 별도로 전시 탭에서 6개 아이템 관리 필요 (GALJIDO, Callmate, MOA는 포트폴리오에 없는 별개 아이템)
