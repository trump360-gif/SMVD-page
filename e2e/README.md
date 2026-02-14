# SMVD CMS - E2E Tests

## Overview

이 디렉토리는 SMVD 웹사이트의 E2E (End-to-End) 테스트를 포함합니다.
Playwright를 사용하여 주요 사용자 플로우와 페이지 기능을 자동으로 검증합니다.

## Test Files

### 1. home.spec.ts
홈페이지 핵심 기능 테스트
- Hero 섹션 렌더링
- Vision 섹션 표시
- Exhibition 섹션 이미지 로딩
- Info/Navigation 섹션
- Header 네비게이션
- Footer 표시

### 2. about.spec.ts
About 페이지 섹션 테스트
- Intro 섹션 (이미지 + 텍스트)
- Vision 섹션 (7개 칩)
- History 섹션 (타임라인)
- 탭 네비게이션
- 페이지 스크롤

### 3. curriculum.spec.ts
Curriculum 페이지 탭 전환 테스트
- 학사/석사 탭 표시
- 탭 전환 기능
- 교과과정 콘텐츠 표시
- 푸터 노트 표시

### 4. people.spec.ts
People 페이지 교수 정보 테스트
- 교수 카드 렌더링
- 교수 이름 표시
- 교수 상세 페이지 네비게이션
- 교수 뱃지 표시
- 프로필 이미지 로딩
- 교수 상세 페이지 정보 (연락처, 과목, 약력)

### 5. work.spec.ts
Work 페이지 필터링 테스트
- 포트폴리오 그리드 렌더링
- Achieve/Exhibition 탭 표시
- 탭 전환 기능
- 포트폴리오 아이템 표시
- 이미지 로딩
- 반응형 레이아웃

## Running Tests

### 전체 테스트 실행
```bash
npm run test:e2e
```

### UI 모드 (추천)
```bash
npm run test:e2e:ui
```

### 브라우저 창 표시하며 실행
```bash
npm run test:e2e:headed
```

### 디버그 모드
```bash
npm run test:e2e:debug
```

### 특정 테스트 파일만 실행
```bash
npm run test:e2e -- e2e/home.spec.ts
```

### 테스트 리포트 보기
```bash
npm run test:e2e:report
```

## Test Strategy

### 1. Page Load & Rendering
- 페이지가 정상적으로 로드되는지 확인
- 핵심 요소들이 렌더링되는지 검증
- 이미지/비디오 로딩 확인

### 2. User Interactions
- 네비게이션 링크 클릭
- 탭 전환
- 스크롤 동작

### 3. Content Verification
- 텍스트 콘텐츠 표시 확인
- 이미지 src 검증
- 섹션 구조 확인

### 4. Accessibility
- 주요 요소의 가시성
- 키보드 네비게이션 (향후 추가 예정)

## Configuration

테스트 설정은 `playwright.config.ts`에서 관리됩니다.

- Base URL: `http://localhost:3000`
- Browser: Chromium
- Screenshots: 실패 시에만
- Trace: 재시도 시에만
- Timeout: 30초 (기본)

## Best Practices

1. **독립성**: 각 테스트는 독립적으로 실행 가능해야 함
2. **신뢰성**: Flaky 테스트 방지 (적절한 waitForTimeout 사용)
3. **명확성**: 테스트 이름은 테스트 내용을 명확히 표현
4. **유지보수성**: 공통 로직은 helper 함수로 추출

## Next Steps

- [ ] 접근성 테스트 추가 (a11y)
- [ ] 성능 테스트 추가 (Lighthouse)
- [ ] API 계약 테스트
- [ ] 모바일 반응형 테스트 확장
- [ ] 크로스 브라우저 테스트 (Firefox, Safari)
