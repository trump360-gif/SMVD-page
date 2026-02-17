# 🚀 실행 가이드 - SMVD CMS 종합 구현

**작성일:** 2026-02-17
**목적:** COMPREHENSIVE_IMPLEMENTATION_PLAN.md를 실행하기 위한 단계별 가이드
**대상:** 개발자 (Claude 또는 팀원)

---

## 📋 빠른 시작 (5분)

### Step 1: 현재 상황 파악
```bash
# TaskMaster 상태 확인
tm status
# → 0 tasks (초기 상태)

# 현재 브랜치 확인
git branch -v
# → refactor/component-split (또는 현재 브랜치)

# 마지막 커밋 확인
git log --oneline -1
```

### Step 2: 마스터 문서 읽기
```
1. COMPREHENSIVE_IMPLEMENTATION_PLAN.md 읽기 (15분)
   - Executive Summary 읽기
   - 전체 구성 이해하기

2. 현재 Phase 상세 섹션 읽기
   - Phase 1 전체 읽기 (지금 시작할 경우)
   - 또는 진행 중인 Phase 찾아서 읽기
```

### Step 3: 작업 시작
```bash
# TaskMaster에 Phase 추가 (CLI 또는 수동)
tm add-task "Phase 1: 코드 리뷰 필수 개선"

# 작업 시작 표기
tm set-status 1 in-progress

# 이 세션의 작업 확인
tm get-tasks --status in-progress
```

---

## 🎯 Phase별 실행 방법

### Phase 1: 코드 리뷰 필수 개선 (7-8시간)

**체크리스트:** [마스터 문서 - Phase 1](#phase-1-코드-리뷰-필수-개선-7-8시간)

**시작 전 확인:**
```bash
✅ git status  # 깨끗한 상태
✅ npm run build  # 현재 0 errors
✅ 마스터 문서 읽음
```

**작업 단계:**

#### 1.1 Critical 오류 수정 (2시간)

```bash
# 각 항목마다:
# 1. 파일 열기
# 2. 정확한 라인 찾기 (Ctrl+G)
# 3. 마스터 문서의 "현재 코드" 확인
# 4. 변경사항 적용
# 5. npm run build로 확인
# 6. git diff로 변경 검증
```

**예시 - 1.1.1 console.log 제거:**
```bash
# 파일 열기
code src/app/api/admin/news/articles/[id]/route.ts

# Ctrl+F로 "console.log" 검색
# 결과: Line 130 근처

# 라인 삭제

# 확인
npm run build  # → 성공이어야 함
git diff src/app/api/admin/news/articles/[id]/route.ts
# → console.log 제거만 보여야 함
```

**완료 후:**
```bash
git add src/app/api/admin/news/articles/[id]/route.ts
git commit -m "fix: Remove debug console.log from news API"
```

#### 1.2 구조 개선 (6시간)

각 작업 (1.2.1 ~ 1.2.5)마다:
1. 마스터 문서의 해당 섹션 읽기
2. 코드 예시 **정확히** 그대로 사용
3. npm run build 확인
4. git commit

**주의:** 파일 경로/라인 번호가 정확한지 먼저 파일 읽고 확인!

---

### Phase 2: 홈페이지 반응형 구현 (16.5시간)

**체크리스트:** [마스터 문서 - Phase 2](#phase-2-홈페이지-반응형-구현-165시간)

**시작 전:**
```bash
✅ Phase 1 완료 & 커밋됨
✅ git status  # 깨끗한 상태
✅ git pull origin main  # 최신 코드
```

**작업 단계:**

#### 2.1 기초 인프라 (1.25시간)

```bash
# 1. Git conflict 해결
git status  # conflict 파일 확인
# → 각 파일 열어서 conflict 해결

git add .
git commit -m "chore: resolve merge conflicts"

# 2. 유틸리티 파일 생성
touch src/lib/responsive.ts
touch src/constants/responsive.ts

# 3. 코드 복사 (마스터 문서에서)
# → 각 파일에 코드 복사/붙여넣기

# 4. 확인
npm run dev  # 개발 서버 실행
# → DevTools에서 창 크기 변경하며 테스트

npm run build  # 빌드 확인
```

#### 2.2-2.4 반응형 구현 (10.25시간)

각 섹션마다:

```bash
# 1. 파일 열기
code src/components/public/home/Header.tsx

# 2. useResponsive 훅 추가 (파일 상단)
import { useResponsive } from '@/lib/responsive';

# 3. 컴포넌트 내부에서 사용
const { isMobile, isTablet, isDesktop } = useResponsive();

# 4. 스타일 수정 (마스터 문서 참조)
const headerStyle = {
  height: isMobile ? '64px' : isTablet ? '72px' : '80px',
  // ... 다른 속성들
};

# 5. 확인
npm run dev  # 실시간 확인
npm run build  # 빌드 성공 확인

# 6. 커밋
git add src/components/public/home/Header.tsx
git commit -m "feat: Add responsive design to Header component"
```

**모든 섹션 (병렬 진행 가능):**
- Header (30분)
- VideoHero (25분)
- Footer (25분)
- ExhibitionSection (50분)
- AboutSection (55분)
- WorkSection (70분)

#### 2.5 테스트 & 최적화 (2시간)

```bash
# 1. 모바일 테스트
# → DevTools (Ctrl+Shift+I) → 모바일 에뮬레이션
# → 375px (iPhone SE) 선택
# → 모든 섹션 스크롤하며 확인

# 2. 태블릿 테스트
# → 768px (iPad) 선택
# → 레이아웃 확인

# 3. 데스크톱 테스트
# → 1440px (Desktop) 선택
# → 기존과 동일한지 확인

# 4. Lighthouse 최종 측정
npm run build
npx lighthouse http://localhost:3000 --output-json > /tmp/lighthouse-phase2.json

# 5. 점수 확인
cat /tmp/lighthouse-phase2.json | jq '.categories'

# 6. 최종 커밋
git add .
git commit -m "feat: Complete responsive design for homepage"
```

---

### Phase 3: 선택 개선 항목 (18-24시간)

**체크리스트:** [마스터 문서 - Phase 3](#phase-3-선택-개선-항목-18-24시간)

각 항목:
1. OPTIONAL_IMPROVEMENTS_REPORT.md에서 상세 참조
2. 마스터 문서의 해당 섹션 읽기
3. TaskMaster에서 작업 추가
4. 순차적으로 진행

---

## 💾 Git 관리

### 커밋 메시지 규칙

```
# Phase 1 완료
git commit -m "fix: Phase 1 - Code review improvements"

# Phase 2 진행 중
git commit -m "feat: WIP - Phase 2 responsive design (Header & VideoHero)"

# Phase 2 완료
git commit -m "feat: Complete Phase 2 - Responsive homepage design"

# Phase 3 진행
git commit -m "feat: WIP - Phase 3 Sentry error tracking"
```

### 정리
```bash
# 날짜별로 모든 커밋 확인
git log --oneline --all --graph | head -30

# Phase별 커밋 확인
git log --oneline | grep "Phase"
```

---

## 📊 TaskMaster 관리

### 초기 설정
```bash
# TaskMaster 프로젝트 상태 확인
tm status

# 진행률 확인
tm progress
```

### 작업 추가
```bash
# Phase 추가 (수동)
tm add-task "Phase 1: 코드 리뷰 필수 개선"
# → taskId 1 반환

# 세부 작업 추가
tm add-subtask 1 "1.1 Critical 오류 수정"
tm add-subtask 1 "1.2 High 우선순위 구조 개선"
```

### 상태 관리
```bash
# 작업 시작
tm set-status 1 in-progress

# 작업 완료
tm set-status 1 done

# 특정 작업 보기
tm get 1  # Phase 1 상세 보기
tm get 1.1  # 1.1 세부 작업 보기
```

### 진행 상황 확인
```bash
# 진행 중인 작업
tm get-tasks --status in-progress

# 완료된 작업
tm get-tasks --status done

# 다음 할 일
tm next-task
```

---

## ⚠️ 변형 방지 체크리스트 (필독!)

### 각 작업 시작 전

```
[ ] 마스터 문서의 해당 Phase 섹션 읽음
[ ] 파일 경로 정확함 (Ctrl+G로 라인 확인)
[ ] "현재 코드" vs "개선안" 비교함
[ ] 코드 예시는 그대로 사용 (수정 금지)
[ ] npm run build 이전 상태 확인 (0 errors)
```

### 각 파일 변경 후

```
[ ] npm run build 성공 (0 errors)
[ ] git diff로 변경 사항 확인
[ ] 마스터 문서의 "변형 방지" 항목 재확인
[ ] 예상 변경만 있는지 확인 (예상 밖의 변경 없음)
```

### 각 작업 완료 후

```
[ ] 마스터 문서의 체크리스트 재확인
[ ] npm run dev에서 수동 테스트
[ ] git commit (상세 메시지)
[ ] TaskMaster status 업데이트
```

---

## 🐛 문제 발생 시

### 문제: npm run build 실패

```
# 1. 에러 메시지 읽기
npm run build

# 2. 에러에 해당하는 파일 열기
code <파일경로>

# 3. 마스터 문서에서 해당 작업 섹션 다시 읽기

# 4. 코드 다시 확인 (문법, 들여쓰기, 괄호 등)

# 5. 변경사항 되돌리기
git checkout <파일경로>

# 6. 처음부터 다시 (더 천천히)
```

### 문제: Git conflict 발생

```
# 1. conflict 파일 확인
git status

# 2. 파일 열기
code <conflict파일>

# 3. <<<<<<, =======, >>>>>> 찾기

# 4. 유지할 부분 선택 후 conflict 마커 제거

# 5. 저장 후
git add <파일>
git commit -m "chore: resolve conflicts"
```

### 문제: 변경사항 너무 많음

```
# 1. 현재 변경사항 확인
git diff --stat

# 2. 예상치 못한 파일이 있는지 확인
git diff

# 3. 파일이 너무 변경된 경우:
#    - 해당 섹션의 마스터 문서 다시 읽기
#    - git restore <파일> 로 되돌리기
#    - 처음부터 더 신중하게
```

---

## 📋 일일 체크리스트

### 아침 (세션 시작)
```
[ ] COMPREHENSIVE_IMPLEMENTATION_PLAN.md 열기
[ ] tm status로 진행 상황 확인
[ ] 어제 커밋 확인 (git log -1)
[ ] npm run build 성공 확인
[ ] 오늘의 작업 목표 정하기 (1-2개 작업)
```

### 작업 중
```
[ ] 마스터 문서의 현재 Phase 섹션 열어두기
[ ] 각 파일 변경 전 마스터 문서 확인
[ ] npm run build/dev로 수시 확인
[ ] 변형 방지 체크리스트 적용
```

### 저녁 (세션 종료)
```
[ ] 완료한 작업 tm set-status done 처리
[ ] git log로 오늘 커밋 확인
[ ] git status 깨끗한 상태 확인 (커밋되지 않은 파일 없음)
[ ] 내일 할 일 메모
```

---

## 📞 도움말

### 마스터 문서 참조
```
Q: 파일 경로가 정확한가?
A: COMPREHENSIVE_IMPLEMENTATION_PLAN.md에서 "파일:" 섹션 확인

Q: 코드가 정확한가?
A: 마스터 문서의 "현재 코드" vs "개선안" 비교

Q: 변형이 있는가?
A: "변형 방지" 체크리스트 재확인

Q: 어디까지 했나?
A: tm get-tasks --status done (완료 작업) / in-progress (진행 중)
```

### 외부 참조
```
코드 리뷰 분석 결과:
→ CODE_REVIEW_ANALYSIS.md

선택 개선 항목 상세:
→ OPTIONAL_IMPROVEMENTS_REPORT.md

현재 진행 상황:
→ TaskMaster (tm status)

이전 세션 기록:
→ git log --oneline | head -20
```

---

## 🎯 성공 기준

### Phase 1 완료 기준
```
✅ npm run build: 0 errors
✅ git log: 7-8개 커밋
✅ TaskMaster: 모든 subtask done
✅ 코드 리뷰 점수: 72 → 80+
```

### Phase 2 완료 기준
```
✅ npm run build: 0 errors
✅ 모바일 테스트: 모든 섹션 가독성 OK
✅ 태블릿 테스트: 레이아웃 변경 OK
✅ 데스크톱: 기존과 동일
✅ Lighthouse: 점수 유지 또는 향상
✅ TaskMaster: 모든 subtask done
```

### Phase 3 완료 기준 (선택)
```
✅ Sentry: Alert 동작
✅ Admin UI: Toast + Error 메시지 표시
✅ Performance: Web Vitals 추적
✅ E2E Test: 모든 테스트 통과
```

---

**이 가이드는 COMPREHENSIVE_IMPLEMENTATION_PLAN.md를 실행하기 위한 도구입니다.**
**각 작업 시마다 마스터 문서를 참조하세요.**
