# Migration Checklist - Work & News CMS

---

## 실행 순서

```
1. 스키마 변경 (Prisma)
2. 데이터 시딩 (seed script)
3. 데이터 검증 (아래 체크리스트)
4. 공개 페이지 연동 (Phase 2에서)
5. 관리자 페이지 구현 (Phase 2에서)
```

---

## Phase 1: 스키마 변경

### 1-1. SectionType Enum 추가
- [ ] `WORK_ARCHIVE` 추가
- [ ] `WORK_EXHIBITION` 추가
- [ ] `NEWS_ARCHIVE` 추가

### 1-2. WorkProject 모델 생성
- [ ] 모델 정의 (14개 필드)
- [ ] slug unique 인덱스
- [ ] category 인덱스
- [ ] order 인덱스
- [ ] @@map("work_projects") 테이블명

### 1-3. WorkExhibition 모델 생성
- [ ] 모델 정의 (9개 필드)
- [ ] order 인덱스
- [ ] @@map("work_exhibitions") 테이블명

### 1-4. NewsEvent 모델 수정
- [ ] slug 필드 추가 (String @unique)
- [ ] category 필드 추가 (String, 기존 type 대체)
- [ ] thumbnailImage 필드 추가 (String)
- [ ] content 타입 변경 (String -> Json?)
- [ ] publishedAt 필드 추가 (DateTime)
- [ ] 기존 type 필드 제거
- [ ] 기존 eventDate 필드 제거
- [ ] 기존 mediaIds 필드 제거
- [ ] category 인덱스 추가
- [ ] publishedAt 인덱스 추가

### 1-5. Prisma 명령어 실행
- [ ] `npx prisma validate` -- 스키마 유효성 검증
- [ ] `npx prisma db push` -- DB 동기화
- [ ] `npx prisma generate` -- TypeScript 타입 생성
- [ ] `npx tsc --noEmit` -- TypeScript 컴파일 확인

---

## Phase 2: 데이터 시딩

### 2-1. Seed Script 실행
- [ ] `npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-work-news.ts`
- [ ] 에러 없이 완료 확인
- [ ] 콘솔 출력에서 각 레코드 ID 확인

### 2-2. 데이터 수량 확인
- [ ] WorkProject: 12개 레코드
- [ ] WorkExhibition: 6개 레코드
- [ ] NewsEvent: 10개 레코드
- [ ] Section: Work 2개 + News 1개 = 3개 추가
- [ ] Page: work, news 2개 페이지

---

## Phase 3: 데이터 검증 - WorkProject (12개)

### 프로젝트별 검증 체크리스트

#### #1 Vora
- [ ] title: `Vora`
- [ ] subtitle: `권나연 외 3명, 2025`
- [ ] category: `UX/UI`
- [ ] tags: `['UX/UI']` (1개)
- [ ] author: `권나연`
- [ ] email: `contact@vora.com`
- [ ] heroImage: `/images/work/vora/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-12.png`
- [ ] galleryImages: 3개
- [ ] order: 1

#### #2 Mindit
- [ ] title: `Mindit`
- [ ] subtitle: `도인영 외 3명, 2025`
- [ ] category: `UX/UI`
- [ ] tags: `['UX/UI']` (1개)
- [ ] author: `도인영`
- [ ] email: `contact@mindit.com`
- [ ] heroImage: `/images/work/mindit/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-10.png`
- [ ] galleryImages: 3개
- [ ] order: 2

#### #3 StarNew Valley
- [ ] title: `StarNew Valley`
- [ ] subtitle: `안시현 외 3명, 2025`
- [ ] category: `Game`
- [ ] tags: `['Game']` (1개)
- [ ] author: `안시현`
- [ ] email: `contact@starnewvalley.com`
- [ ] heroImage: `/images/work/starnewvalley/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-9.png`
- [ ] galleryImages: 3개
- [ ] order: 3

#### #4 Pave
- [ ] title: `Pave`
- [ ] subtitle: `박지우 외 2명, 2025`
- [ ] category: `UX/UI`
- [ ] tags: `['UX/UI']` (1개)
- [ ] author: `박지우`
- [ ] email: `contact@pave.com`
- [ ] heroImage: `/images/work/pave/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-11.png`
- [ ] galleryImages: 3개
- [ ] order: 4

#### #5 Bolio
- [ ] title: `Bolio`
- [ ] subtitle: `박근영, 2025`
- [ ] category: `UX/UI`
- [ ] tags: `['UX/UI']` (1개)
- [ ] author: `박근영`
- [ ] email: `contact@bolio.com`
- [ ] heroImage: `/images/work/bolio/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-7.png`
- [ ] galleryImages: 3개
- [ ] order: 5

#### #6 MIST AWAY
- [ ] title: `MIST AWAY`
- [ ] subtitle: `신예지, 2025`
- [ ] category: `UX/UI`
- [ ] tags: `['UX/UI']` (1개)
- [ ] author: `신예지`
- [ ] email: `contact@mistaway.com`
- [ ] heroImage: `/images/work/mistaway/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-6.png`
- [ ] galleryImages: 3개
- [ ] order: 6

#### #7 BICHAE
- [ ] title: `BICHAE`
- [ ] subtitle: `최은정, 2025`
- [ ] category: `Branding`
- [ ] tags: `['Branding']` (1개)
- [ ] author: `최은정`
- [ ] email: `contact@bichae.com`
- [ ] heroImage: `/images/work/bichae/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-5.png`
- [ ] galleryImages: 3개
- [ ] order: 7

#### #8 Morae
- [ ] title: `Morae`
- [ ] subtitle: `고은서, 2023`
- [ ] category: `UX/UI`
- [ ] tags: `['UX/UI']` (1개)
- [ ] author: `고은서`
- [ ] email: `contact@morae.com`
- [ ] year: `2023` (유일하게 2023!)
- [ ] heroImage: `/images/work/morae/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-4.png`
- [ ] galleryImages: 3개
- [ ] order: 8

#### #9 STUDIO KNOT (특수 - 가장 복잡)
- [ ] title: `STUDIO KNOT`
- [ ] subtitle: `노하린, 2025`
- [ ] category: `Branding`
- [ ] tags: 7개 `['UX/UI', 'Graphic', 'Editorial', 'Illustration', 'Branding', 'CM/CF', 'Game']`
- [ ] author: `노하린`
- [ ] email: `havein6@gmail.com` (유일하게 실제 이메일!)
- [ ] description: 한글 장문 (3줄, 줄바꿈 포함)
- [ ] heroImage: `/images/work/knot/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-3.png`
- [ ] galleryImages: 9개 (text-below.png + gallery-1~8.png)
- [ ] order: 9

#### #10 BLOME
- [ ] title: `BLOME` (Unicode E 포함)
- [ ] subtitle: `김진아 외 1명, 2025`
- [ ] category: `Branding`
- [ ] tags: `['Branding']` (1개)
- [ ] author: `김진아`
- [ ] email: `contact@blome.com`
- [ ] heroImage: `/images/work/blome/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-8.png`
- [ ] galleryImages: 3개
- [ ] order: 10

#### #11 alors: romanticize your life, every...
- [ ] title: `alors: romanticize your life, every...`
- [ ] subtitle: `정유진, 2025`
- [ ] category: `Motion`
- [ ] tags: `['Motion']` (1개)
- [ ] author: `정유진`
- [ ] email: `contact@alors.com`
- [ ] heroImage: `/images/work/alors/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-2.png`
- [ ] galleryImages: 3개
- [ ] order: 11

#### #12 고군분투
- [ ] title: `고군분투`
- [ ] subtitle: `한다인, 2025`
- [ ] category: `Motion`
- [ ] tags: `['Motion']` (1개)
- [ ] author: `한다인`
- [ ] email: `contact@gogoonbunstu.com`
- [ ] heroImage: `/images/work/gogoonbunstu/hero.png`
- [ ] thumbnailImage: `/images/work/portfolio-1.png`
- [ ] galleryImages: 3개
- [ ] order: 12

---

## Phase 3: 데이터 검증 - WorkExhibition (6개)

| # | title | subtitle | artist | image | order |
|---|-------|----------|--------|-------|-------|
| [ ] 1 | Vora | 권나연 외 3명, 2025 | Voice Out Recovery Assistant | Rectangle 45-5.png | 1 |
| [ ] 2 | Mindit | 도인영 외 3명, 2025 | 도민앱 외 3명 | Rectangle 45-4.png | 2 |
| [ ] 3 | MIST AWAY | 신예지, 2025 | 신예지 | Rectangle 45-3.png | 3 |
| [ ] 4 | GALJIDO (갈지도) | 조혜원, 2025 | 조혜원 | Rectangle 45-2.png | 4 |
| [ ] 5 | Callmate | 고은빈, 2025 | 고은빈 | Rectangle 45-1.png | 5 |
| [ ] 6 | MOA | 강세정 외 2명, 2025 | 강세정 | Rectangle 45.png | 6 |

---

## Phase 3: 데이터 검증 - NewsEvent (10개)

| # | slug | category | title (앞 30자) | excerpt | thumbnail | content |
|---|------|----------|----------------|---------|-----------|---------|
| [ ] 1 | '1' | Notice | 미술대학 2024년도... | null | /Group-27.svg | null |
| [ ] 2 | '2' | Notice | 디자인학과(박사)... | null | /Group-27.svg | null |
| [ ] 3 | '3' | Notice | 시각영상디자인학과(석사)... | null | /Group-27.svg | null |
| [ ] 4 | '4' | Notice | 시각영상디자인학과 2024... | null | /Group-27.svg | null |
| [ ] 5 | '5' | Event | 2024 시각영상디자인과 졸업... | 있음 | /images/news/Image-1.png | 갤러리 6개 이미지 |
| [ ] 6 | '6' | Event | 2024 시각영상디자인과 동문... | 있음 | /images/news/Image.png | null |
| [ ] 7 | '7' | Notice | 학생경비 집행 내역 | null | /Group-27.svg | null |
| [ ] 8 | '8' | Notice | [ 시각영상디자인과(박사)... | null | /Group-27.svg | null |
| [ ] 9 | '9' | Notice | [ 시각영상디자인과(석사)... | null | /Group-27.svg | null |
| [ ] 10 | '10' | Notice | [졸업] 재학생 졸업학점... | null | /Group-27.svg | null |

### NewsEvent #5 상세 content 검증
- [ ] introTitle: `2024 시각영상디자인과 졸업전시회`
- [ ] introText: 2줄 텍스트 (\n 포함)
- [ ] gallery.layout: `standard`
- [ ] gallery.main: `Rectangle 240652481.png`
- [ ] gallery.centerLeft: `Rectangle 240652482.png`
- [ ] gallery.centerRight: `Rectangle 240652483.png`
- [ ] gallery.bottomLeft: `Rectangle 240652486.png`
- [ ] gallery.bottomCenter: `Rectangle 240652485.png`
- [ ] gallery.bottomRight: `Rectangle 240652484.png`

---

## Phase 3: 이미지 경로 검증

### Work Hero Images (12개)
- [ ] `/images/work/vora/hero.png` 존재
- [ ] `/images/work/mindit/hero.png` 존재
- [ ] `/images/work/starnewvalley/hero.png` 존재
- [ ] `/images/work/pave/hero.png` 존재
- [ ] `/images/work/bolio/hero.png` 존재
- [ ] `/images/work/mistaway/hero.png` 존재
- [ ] `/images/work/bichae/hero.png` 존재
- [ ] `/images/work/morae/hero.png` 존재
- [ ] `/images/work/knot/hero.png` 존재
- [ ] `/images/work/blome/hero.png` 존재
- [ ] `/images/work/alors/hero.png` 존재
- [ ] `/images/work/gogoonbunstu/hero.png` 존재

### Work Thumbnail Images (12개)
- [ ] `/images/work/portfolio-1.png` 존재
- [ ] `/images/work/portfolio-2.png` 존재
- [ ] `/images/work/portfolio-3.png` 존재
- [ ] `/images/work/portfolio-4.png` 존재
- [ ] `/images/work/portfolio-5.png` 존재
- [ ] `/images/work/portfolio-6.png` 존재
- [ ] `/images/work/portfolio-7.png` 존재
- [ ] `/images/work/portfolio-8.png` 존재
- [ ] `/images/work/portfolio-9.png` 존재
- [ ] `/images/work/portfolio-10.png` 존재
- [ ] `/images/work/portfolio-11.png` 존재
- [ ] `/images/work/portfolio-12.png` 존재

### STUDIO KNOT Gallery (9개 - 최다)
- [ ] `/images/work/knot/text-below.png` 존재
- [ ] `/images/work/knot/gallery-1.png` 존재
- [ ] `/images/work/knot/gallery-2.png` 존재
- [ ] `/images/work/knot/gallery-3.png` 존재
- [ ] `/images/work/knot/gallery-4.png` 존재
- [ ] `/images/work/knot/gallery-5.png` 존재
- [ ] `/images/work/knot/gallery-6.png` 존재
- [ ] `/images/work/knot/gallery-7.png` 존재
- [ ] `/images/work/knot/gallery-8.png` 존재

### Exhibition Images (6개)
- [ ] `/images/exhibition/Rectangle 45-5.png` 존재
- [ ] `/images/exhibition/Rectangle 45-4.png` 존재
- [ ] `/images/exhibition/Rectangle 45-3.png` 존재
- [ ] `/images/exhibition/Rectangle 45-2.png` 존재
- [ ] `/images/exhibition/Rectangle 45-1.png` 존재
- [ ] `/images/exhibition/Rectangle 45.png` 존재

### News Images
- [ ] `/Group-27.svg` 존재
- [ ] `/images/news/Image-1.png` 존재
- [ ] `/images/news/Image.png` 존재

### News Detail Gallery (6개)
- [ ] `/images/work-detail/Rectangle 240652481.png` 존재
- [ ] `/images/work-detail/Rectangle 240652482.png` 존재
- [ ] `/images/work-detail/Rectangle 240652483.png` 존재
- [ ] `/images/work-detail/Rectangle 240652484.png` 존재
- [ ] `/images/work-detail/Rectangle 240652485.png` 존재
- [ ] `/images/work-detail/Rectangle 240652486.png` 존재

---

## Phase 4: 빌드 검증

- [ ] `npx prisma validate` -- 성공
- [ ] `npx prisma generate` -- 성공
- [ ] `npx tsc --noEmit` -- 0 에러
- [ ] `npm run build` -- 모든 페이지 생성 성공
- [ ] Work 페이지 HTTP 200 확인
- [ ] Work 상세 페이지 HTTP 200 확인 (/work/1 ~ /work/12)
- [ ] News 페이지 HTTP 200 확인
- [ ] News 상세 페이지 HTTP 200 확인 (/news/5)

---

## Phase 5: 카테고리 분포 검증

### WorkProject 카테고리 분포
- [ ] UX/UI: 6개 (1, 2, 4, 5, 6, 8)
- [ ] Branding: 3개 (7, 9, 10)
- [ ] Motion: 2개 (11, 12)
- [ ] Game: 1개 (3)
- [ ] 합계: 12개

### NewsEvent 카테고리 분포
- [ ] Notice: 8개 (1, 2, 3, 4, 7, 8, 9, 10)
- [ ] Event: 2개 (5, 6)
- [ ] 합계: 10개

---

## 위험 요소 및 대응

### 1. NewsEvent content 타입 변경 (String -> Json?)
- **위험**: 기존 DB에 String 데이터가 있으면 마이그레이션 실패
- **대응**: 현재 DB에 NewsEvent 데이터 없음 확인 후 진행
- **확인 방법**: `SELECT count(*) FROM news_events;`

### 2. NewsEvent 필드 삭제 (type, eventDate, mediaIds)
- **위험**: 기존 코드에서 해당 필드 참조 시 빌드 에러
- **대응**: 관리자 대시보드 news 페이지에서 해당 필드 미사용 확인

### 3. 이미지 경로 공백 포함
- **위험**: `Rectangle 45-5.png`, `Rectangle 240652481.png` 등 공백 있는 파일명
- **대응**: DB에 정확한 경로 저장, URL 인코딩 불필요 (Next.js img src에서 처리)

### 4. Unicode 문자
- **위험**: BLOME의 E (U+00C9), 가운뎃점 (U+00B7)
- **대응**: seed 스크립트에서 Unicode 이스케이프 사용

---

## 이미지 파일 존재 현황 (2026-02-15 검증)

### Work Hero/Gallery Images - 실제 파일 존재 여부
| 폴더 | 상태 | 비고 |
|------|------|------|
| `/images/work/knot/` | EXISTS (10개 파일) | STUDIO KNOT - hero + text-below + gallery-1~8 |
| `/images/work/vora/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/mindit/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/starnewvalley/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/pave/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/bolio/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/mistaway/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/bichae/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/morae/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/blome/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/alors/` | MISSING | hero.png + gallery 3개 미생성 |
| `/images/work/gogoonbunstu/` | MISSING | hero.png + gallery 3개 미생성 |

### Work Thumbnail Images - 모두 존재
- portfolio-1.png ~ portfolio-12.png: 모두 EXISTS

### Exhibition Images - 모두 존재
- Rectangle 45.png ~ Rectangle 45-5.png: 모두 EXISTS (6개)

### News Images - 모두 존재
- /Group-27.svg: EXISTS
- /images/news/Image-1.png: EXISTS
- /images/news/Image.png: EXISTS
- /images/work-detail/Rectangle 24065248*.png: 모두 EXISTS (6개)

**결론**: STUDIO KNOT(#9)만 상세 이미지가 실제로 존재합니다. 나머지 11개 프로젝트는
work-details.ts에 경로가 정의되어 있지만 실제 파일은 아직 없습니다. 이는 DB 데이터에
정확히 기록하되, 이미지 업로드는 관리자 CMS에서 추후 진행합니다.

---

## 롤백 계획

1. **스키마 롤백**: `git checkout prisma/schema.prisma && npx prisma db push`
2. **데이터 롤백**: 새 모델(WorkProject, WorkExhibition)은 DROP TABLE, NewsEvent는 이전 구조로 복원
3. **코드 롤백**: git에서 이전 커밋으로 복원
