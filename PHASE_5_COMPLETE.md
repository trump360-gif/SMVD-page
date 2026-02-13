# Phase 5: 관리자 페이지 (드래그 앤 드롭) - 완료

**완료일**: 2026-02-12
**상태**: ✅ 구현 완료

---

## 📋 Phase 5 개요

관리자가 각 페이지의 섹션을 **드래그 앤 드롭으로 순서 변경**할 수 있는 관리자 페이지를 구현했습니다. 이는 CMS의 가장 핵심 기능입니다.

---

## 🎯 구현된 기능

### 1. 관리자 레이아웃 (재설계)
- **파일**: `src/app/admin/layout.tsx`
- **주요 기능**:
  - 좌측 고정 사이드바 (축소/확장 가능)
  - 사용자 정보 표시
  - 로그아웃 버튼
  - 메인 콘텐츠 영역 (사이드바 상태에 따라 마진 조정)
  - z-index 관리로 사이드바를 콘텐츠 위에 유지

### 2. 페이지 관리 페이지
- **파일**: `src/app/admin/pages/page.tsx`
- **주요 기능**:
  - 모든 페이지를 테이블 형식으로 표시
  - 각 페이지별 편집 버튼
  - 페이지 정보 (제목, 슬러그, 설명)
  - API 연동: `GET /api/pages` (인증 필요)

### 3. 페이지 편집 페이지
- **파일**: `src/app/admin/pages/[id]/edit/page.tsx`
- **주요 기능**:
  - 특정 페이지의 섹션 목록 표시
  - SectionEditor 컴포넌트 통합
  - 페이지 제목 및 설명 표시
  - 뒤로가기 버튼
  - 로딩 및 에러 상태 관리

### 4. 드래그 앤 드롭 섹션 에디터
- **파일**: `src/components/admin/SectionEditor/index.tsx`
- **주요 기능**:
  - `@dnd-kit/core` 기반 구현
  - **optimistic UI updates** (UI 즉시 변경 → 서버 저장 → 실패 시 롤백)
  - PointerSensor + KeyboardSensor 지원 (마우스 + 키보드)
  - 드래그 중 로딩 상태 관리
  - 성공/실패 메시지 표시
  - 섹션 삭제 기능
  - 섹션이 없을 때 "섹션 추가" 버튼 표시

**드래그 앤 드롭 플로우**:
```
1. 사용자가 섹션을 드래그
   ↓
2. DndContext의 handleDragEnd 트리거
   ↓
3. 로컬 state 즉시 업데이트 (optimistic)
   ↓
4. PUT /api/admin/sections/reorder 호출
   ↓
5. 성공: 유지
   실패: 이전 순서로 롤백 + 에러 메시지 표시
```

### 5. 개별 섹션 항목 컴포넌트
- **파일**: `src/components/admin/SectionEditor/SectionItem.tsx`
- **주요 기능**:
  - `@dnd-kit/sortable`의 useSortable 훅 사용
  - 드래그 핸들 (6개 점 아이콘)
  - 섹션 인덱스 번호 (파란 원형 배지)
  - 섹션 정보 (타입별 한글 라벨)
  - 편집 버튼 (추후 구현)
  - 삭제 버튼 (🗑️)
  - 드래그 중 시각적 피드백 (반투명)

---

## 🔧 API 엔드포인트 (Phase 5 관련)

### 신규 엔드포인트

#### 1. GET /api/admin/pages/[id]
- **설명**: 특정 페이지의 섹션 조회 (관리자 전용)
- **파일**: `src/app/api/admin/pages/[id]/route.ts`
- **요청**: 파라미터로 페이지 ID 제공
- **응답**:
  ```json
  {
    "success": true,
    "data": {
      "id": "page-1",
      "slug": "home",
      "title": "홈페이지",
      "description": "...",
      "sections": [
        { "id": "sec-1", "type": "HERO", "title": "배너", "order": 0 },
        { "id": "sec-2", "type": "TEXT_BLOCK", "order": 1 }
      ]
    },
    "message": "페이지를 조회했습니다"
  }
  ```

#### 2. PUT /api/admin/sections/[id]
- **설명**: 특정 섹션 수정 (관리자 전용)
- **파일**: `src/app/api/admin/sections/[id]/route.ts`
- **요청**: 섹션 내용 업데이트

#### 3. DELETE /api/admin/sections/[id]
- **설명**: 특정 섹션 삭제 (관리자 전용)
- **파일**: `src/app/api/admin/sections/[id]/route.ts`
- **요청**: 파라미터로 섹션 ID 제공

### 기존 엔드포인트 (Phase 3에서 구현)
- `PUT /api/admin/sections/reorder` - 섹션 순서 변경 (트랜잭션 처리)
- `DELETE /api/admin/sections/{id}` - 섹션 삭제
- `POST /api/admin/sections` - 섹션 생성
- `GET /api/admin/sections?pageId=xxx` - 섹션 조회

---

## 📂 생성된 파일 목록

### 신규 생성 파일
1. `src/app/admin/pages/page.tsx` - 페이지 관리 목록
2. `src/app/admin/pages/%5Bid%5D/edit/page.tsx` - 페이지 편집
3. `src/components/admin/SectionEditor/index.tsx` - 드래그 앤 드롭 에디터
4. `src/components/admin/SectionEditor/SectionItem.tsx` - 개별 섹션 항목
5. `src/app/api/admin/pages/[id]/route.ts` - 페이지 조회 API
6. `src/app/api/admin/sections/[id]/route.ts` - 섹션 수정/삭제 API

### 수정된 파일
1. `src/app/admin/layout.tsx` - 사이드바 완전 재설계
2. `src/app/admin/dashboard/page.tsx` - 상태 업데이트
3. `src/app/api/admin/sections/route.ts` - PUT/DELETE 메서드 제거 (별도 파일로 이동)
4. `next.config.ts` - Turbopack 설정 추가
5. `package.json` - 간접 변경 (npm install로 dnd-kit 패키지 추가)

---

## 📦 설치된 의존성

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**추가된 패키지**:
- `@dnd-kit/core` - 드래그 앤 드롭 기본 기능
- `@dnd-kit/sortable` - 정렬 가능한 리스트 기능
- `@dnd-kit/utilities` - 유틸리티 함수 (CSS 변환 등)

---

## 🔐 보안

### 인증 및 권한
- 모든 관리자 API는 `checkAdminAuth()` 미들웨어로 보호됨
- 인증되지 않은 요청 → 401 Unauthorized 응답
- 관리자 역할 확인 후 API 접근 허용

---

## 🚀 사용 방법

### 관리자 로그인
```
1. /admin/login 접속
2. 이메일/비밀번호 입력
3. 로그인 성공 → /admin/dashboard 리다이렉트
```

### 페이지 편집
```
1. /admin/pages 접속 (페이지 목록)
2. 편집할 페이지의 "편집" 버튼 클릭
3. /admin/pages/[id]/edit 페이지로 이동
4. 섹션 목록 표시 (드래그 가능)
5. 섹션 드래그하여 순서 변경
6. 자동 저장 (PUT /api/admin/sections/reorder)
```

### 섹션 삭제
```
1. 섹션의 삭제 버튼(🗑️) 클릭
2. 확인 다이얼로그 표시
3. "확인" 클릭 → DELETE /api/admin/sections/{id}
4. 섹션이 목록에서 제거
```

---

## 🎨 UI/UX 특징

### 드래그 앤 드롭 피드백
- **드래그 중**: 섹션 반투명 처리 (opacity: 0.5)
- **호버**: 배경색 변경 (hover:bg-gray-50)
- **드래그 상태**: 파란 테두리 + 배경색 (bg-blue-50)

### 메시지 표시
- **성공**: 초록색 배경 + 토스트 메시지
- **실패**: 빨간색 배경 + 에러 메시지
- **X 버튼**: 메시지 닫기

### 로딩 상태
- 드래그 중 전체 리스트 비활성화
- 로딩 중 섹션 추가 버튼 비활성화
- 스켈레톤 로더 (페이지 로딩 중)

---

## ✅ 검증 체크리스트

### 코드 검증
- ✅ TypeScript 타입 검증 통과
- ✅ Zod 스키마 검증 적용
- ✅ 모든 API 엔드포인트 생성됨
- ✅ 인증 미들웨어 적용됨
- ✅ 에러 처리 구현됨

### 기능 검증 (수동 테스트 필요)
- [ ] 로그인 페이지 접속
- [ ] 관리자 인증
- [ ] 페이지 목록 조회
- [ ] 페이지 편집 페이지 로드
- [ ] 섹션 드래그 앤 드롭
- [ ] 순서 변경 저장
- [ ] 섹션 삭제
- [ ] 공개 페이지 순서 변경 반영 확인

---

## ⚠️ 알려진 문제

### Turbopack 빌드 오류
**문제**: 한글 경로명으로 인한 Turbopack 버그
```
Error: byte index 39 is not a char boundary; it is inside 'ᄑ'
```

**원인**: Turbopack이 한글 문자를 포함한 파일 경로 처리 중 crash

**해결책**:
- 프로젝트를 영문 경로로 이동 (예: `/Users/username/projects/smvd-cms`)
- 또는 Vercel에서 배포할 때는 자동으로 이 문제 없음

**개발 중 해결**: 프로젝트 폴더명을 영문으로 변경하면 빌드 성공

---

## 📊 구현 통계

| 항목 | 개수 |
|------|------|
| 신규 파일 | 6개 |
| 수정된 파일 | 5개 |
| API 엔드포인트 | 3개 (신규) |
| 컴포넌트 | 2개 (SectionEditor, SectionItem) |
| 총 코드 라인 | ~1,500줄 |

---

## 🔗 관련 문서

- [Phase 1 - 프로젝트 초기화](./PHASE_1_COMPLETE.md)
- [Phase 2 - 인증 시스템](./PHASE_2_COMPLETE.md)
- [Phase 3 - 백엔드 API](./PHASE_3_COMPLETE.md)
- [Phase 4 - 공개 페이지](./PHASE_4_COMPLETE.md)

---

## 🎯 다음 단계 (Phase 6)

### Phase 6: 최적화 및 배포
- [ ] Lighthouse 성능 측정 (90+ 목표)
- [ ] 이미지 최적화 (next/image 활용)
- [ ] 번들 크기 최적화
- [ ] SEO 메타태그 추가
- [ ] E2E 테스트 작성
- [ ] Vercel 배포
- [ ] 프로덕션 환경 테스트

---

## 💡 핵심 구현 포인트

### 1. Optimistic UI Updates
드래그 앤 드롭 시 UI를 즉시 변경하고, 서버에 저장한 후 실패 시에만 롤백하는 방식입니다. 이를 통해 사용자 경험이 매우 빠르고 반응성 있게 느껴집니다.

```typescript
// UI 즉시 업데이트
setSections(newSections);

// 서버에 저장
try {
  const res = await fetch('/api/admin/sections/reorder', {...});
  if (!res.ok) setSections(sections); // 실패 시 롤백
} catch {
  setSections(sections); // 에러 시 롤백
}
```

### 2. 트랜잭션 기반 순서 변경
데이터베이스 트랜잭션을 사용하여 모든 섹션의 order 필드를 원자적으로 업데이트합니다. 이를 통해 부분 업데이트로 인한 데이터 불일치를 방지합니다.

```typescript
const updated = await prisma.$transaction(
  sections.map((s) =>
    prisma.section.update({ where: { id: s.id }, data: { order: s.order } })
  )
);
```

### 3. 동적 라우팅
Next.js 동적 라우팅을 사용하여 각 페이지별 편집 페이지를 생성합니다:
- `/admin/pages/[id]/edit` - 페이지 편집
- `/api/admin/pages/[id]` - 페이지 조회
- `/api/admin/sections/[id]` - 섹션 수정/삭제

---

## 📞 참고

**Phase 5에서 아직 구현되지 않은 기능**:
- 섹션 추가 모달 (Task 추가 필요)
- 섹션 내용 편집 (WYSIWYG 에디터 필요)
- 네비게이션 관리 페이지
- 푸터 관리 페이지
- 미디어 라이브러리

이 기능들은 Phase 5의 확장으로 추후 구현 예정입니다.

---

**작성자**: Claude Code
**작성일**: 2026-02-12
**상태**: ✅ 완료
