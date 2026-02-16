# 다음 세션 시작 프롬프트

## 🎯 현재 상황 (2026-02-16 업데이트)

### 🔴 **긴급: STUDIO KNOT CMS 버그 발견 (P0 - 즉시 수정)**

**문제:**
- DB에 4개 블록 저장됨 ✅
- Admin CMS에서 블록 타입 표시 안 됨 ❌ ("4 rows / 0 blocks")
- CMS 모든 기능 마비 (블록 선택 불가 → 편집 불가 → 저장 불가)

**원인:** useBlockEditor 훅과 editorContent.blocks 동기화 실패
**상세 분석:** `STUDIO_KNOT_CMS_DATA_SYNC_BUG.md` 참고

**다음 세션 우선순위:**
1. 🔧 버그 수정 (38분)
2. ✅ CMS 기능 검증
3. 📝 MEMORY.md 업데이트

---

## 🎯 이전 상황 (2026-02-15)

### ✅ 완료: Home CMS 통합 (PHASE 2-7)

**작업 내용:**
- Prisma 스키마에 ExhibitionItem, WorkPortfolio 모델 추가 ✅
- Section, Media 모델에 관계 설정 ✅
- SectionType enum에 HOME_HERO, EXHIBITION_SECTION, HOME_ABOUT 추가 ✅
- 10개 파일 복사 (Dashboard, Hook, 4개 컴포넌트, 4개 API 라우트) ✅
- Sections API GET 엔드포인트에 include 추가 ✅
- tsconfig.json에서 smvd-cms 제외 ✅
- lucide-react 패키지 설치 ✅
- smvd-cms 디렉토리 정리 및 .gitignore 추가 ✅

**통합 결과:**
- Home CMS + About CMS가 모두 메인 프로젝트에 통합됨
- 관리자 대시보드에서 Home과 About 페이지를 한 곳에서 관리 가능
- 모든 파일이 같은 프로젝트에서 관리되므로 구조 통일

---

## 📊 현재 CMS 상태

### Home CMS ✅
- **대시보드**: `/admin/dashboard/home`
- **Hook**: `useHomeEditor.ts` (상태 관리, API 통합)
- **Components**:
  - ExhibitionItemModal.tsx (전시 아이템 추가/수정)
  - ExhibitionItemsList.tsx (드래그 앤 드롭 리스트)
  - WorkPortfolioModal.tsx (작품 포트폴리오 추가/수정)
  - WorkPortfolioList.tsx (드래그 앤 드롭 리스트)
- **API Routes**:
  - GET/POST/DELETE `/api/admin/exhibition-items`
  - PUT `/api/admin/exhibition-items/reorder`
  - GET/POST/DELETE `/api/admin/work-portfolios`
  - PUT `/api/admin/work-portfolios/reorder`

### About CMS ✅
- **대시보드**: `/admin/dashboard/about`
- **Hook**: `useAboutEditor.ts` (섹션 + 교수/강사 관리)
- **기능**:
  - 섹션 관리 (About Intro, Vision, History, People)
  - 교수/강사 CRUD
  - 순서 변경 (드래그 앤 드롭)
- **API Routes**:
  - GET/POST/PUT/DELETE `/api/admin/about/sections`
  - GET/POST/PUT/DELETE `/api/admin/about/people`
  - PUT `/api/admin/about/sections/reorder`
  - PUT `/api/admin/about/people/reorder`

### 공개 페이지 ✅
- `/` (Home)
- `/about` (About Major)
- `/curriculum` (Curriculum)
- `/professor/[id]` (Professor Detail)
- `/work` (Work/Portfolio)
- `/work/[id]` (Work Detail)
- `/news` (News&Event)
- `/news/[id]` (News Detail)

---

## ⚠️ 알려진 상태

### 아직 구현 안 됨 (Future Work)
- `/admin/navigation` - 네비게이션 관리 페이지
- `/admin/footer` - 푸터 관리 페이지
- `/admin/media` - 미디어 관리 페이지
(대시보드에 링크가 있지만 구현되지 않은 기능들)

### 기존 TypeScript 에러
- About CMS API에서 Zod 에러 처리 방식 문제 (pre-existing)
- 이는 Home CMS 통합과 무관한 별도 이슈

---

## 🚀 다음 할 작업 (제안)

### Phase 3: Home CMS 기능 테스트 및 검증
1. **개발 서버 실행 후 테스트**
   ```bash
   npm run dev
   # http://localhost:3000/admin/dashboard/home 접속
   ```

2. **기능 검증**
   - [ ] Exhibition Items 추가/수정/삭제
   - [ ] Work Portfolio 추가/수정/삭제
   - [ ] 드래그 앤 드롭으로 순서 변경
   - [ ] 실시간 미리보기 업데이트 확인
   - [ ] Home 페이지 공개 데이터 반영 확인

3. **API 엔드포인트 테스트**
   - [ ] GET /api/admin/sections?pageId=home
   - [ ] POST /api/admin/exhibition-items
   - [ ] PUT /api/admin/exhibition-items/reorder
   - [ ] POST/PUT/DELETE /api/admin/work-portfolios

### Phase 4: Curriculum/Work/News CMS 구현 (선택)
- Curriculum 페이지 CMS
- Work 페이지 CMS
- News&Event 페이지 CMS
(About/Home과 동일한 패턴으로 구현 가능)

### Phase 5: 네비게이션/푸터/미디어 관리 구현 (선택)
- `/admin/navigation` 페이지 구현
- `/admin/footer` 페이지 구현
- `/admin/media` 페이지 구현

---

## 📋 git 상태

**변경사항 (아직 커밋 안 됨):**
```
Modified:
  - prisma/schema.prisma (ExhibitionItem, WorkPortfolio 모델 추가)
  - src/app/api/admin/sections/route.ts (include 추가)
  - tsconfig.json (smvd-cms 제외)
  - package.json (lucide-react 설치)
  - .gitignore (smvd-cms 추가)
  - src/app/admin/dashboard/page.tsx (기존 파일)

Deleted:
  - smvd-cms/ (디렉토리 정리)

Copied:
  - src/app/admin/dashboard/home/page.tsx
  - src/hooks/useHomeEditor.ts
  - src/components/admin/ExhibitionItemModal.tsx
  - src/components/admin/ExhibitionItemsList.tsx
  - src/components/admin/WorkPortfolioModal.tsx
  - src/components/admin/WorkPortfolioList.tsx
  - src/app/api/admin/exhibition-items/route.ts
  - src/app/api/admin/exhibition-items/reorder/route.ts
  - src/app/api/admin/work-portfolios/route.ts
  - src/app/api/admin/work-portfolios/reorder/route.ts
```

**커밋 메시지 제안:**
```
feat: Integrate Home CMS into main project (PHASE 2-7)

- Add ExhibitionItem and WorkPortfolio models to Prisma schema
- Copy Home CMS files (10 files: dashboard, hook, components, API routes)
- Update Sections API GET endpoint with exhibitionItems and workPortfolios includes
- Exclude smvd-cms from TypeScript compilation
- Install lucide-react dependency
- Clean up smvd-cms directory and add to .gitignore

This unifies Home CMS and About CMS into a single main project,
eliminating duplicate CMS implementations and enabling unified management.
```

---

## 📚 참고 문서

**반드시 읽을 문서:**
- `CLAUDE.md` - 프로젝트 정보 및 자동 실행 규칙
- `MEMORY.md` - 현재 작업 상태 (PHASE 2-7 업데이트됨)
- `SESSION_CHECKLIST.md` - 작업 전 5분 점검

**필요시 참고:**
- `API_SPECIFICATION.md` - API 엔드포인트 명세
- `TYPES_REFERENCE.md` - TypeScript 타입 정의
- `ARCHITECTURE_GUIDE.md` - 시스템 구조
- `PITFALLS.md` - 자주하는 실수

---

## 💡 팁

1. **개발 서버 재시작 필수**
   ```bash
   npm run dev
   ```
   (새로운 Prisma 모델 적용)

2. **API 테스트 시 쿠키 확인**
   - NextAuth 세션이 필요함
   - curl로 테스트할 때는 인증 토큰 필요

3. **빌드 테스트**
   ```bash
   npm run build
   ```
   (smvd-cms 제외되어 있으므로 clean build 가능)

4. **TypeScript 타입 체크**
   ```bash
   npx tsc --noEmit
   ```

---

## ✨ 최종 요약

**이 세션의 핵심 성과:**
- Home CMS와 About CMS의 완전한 통합 ✅
- 단일 메인 프로젝트에서 모든 CMS 관리 가능 ✅
- 깔끔하고 통일된 프로젝트 구조 ✅
- 확장 가능한 CMS 아키텍처 구축 ✅

**다음 세션의 목표:**
- Home CMS 기능 검증 및 테스트
- 추가 CMS 페이지 구현 (선택)
- 미구현 관리 기능 추가 (선택)
