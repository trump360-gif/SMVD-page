# 📋 STUDIO KNOT CMS 통합 - 세션 시작 체크리스트

**목표:** STUDIO KNOT (공개 페이지 /work/9)를 BlockEditor 기반 CMS로 완전 전환
**상태:** 분석 완료 ✅ → 블록 생성 & DB 업데이트 준비

---

## ⚡ 5분 빠른 시작

### 1️⃣ 상황 파악 (1분)

```bash
# 문서 읽기 순서
1. 이 파일 (SESSION_CHECKLIST_STUDIO_KNOT.md) 읽기
2. STUDIO_KNOT_CMS_INTEGRATION.md 읽기 (전체 계획)
3. BLOCKS_GENERATION_GUIDE.md 읽기 (구현 상세)
```

**현재 상태:**
- ✅ 공개 페이지: /work/9 (하드코딩된 데이터)
- ✅ Admin CMS: 3-panel 모달 (BlockLayoutVisualizer + BlockEditorPanel + Preview)
- ❌ DB: STUDIO KNOT content 필드 비어있음

---

### 2️⃣ 개발 환경 준비 (2분)

```bash
# 1. Dev 서버 실행
npm run dev

# 2. 브라우저에서 확인
http://localhost:3000/work/9                    # 공개 페이지
http://localhost:3000/admin/dashboard/work      # Admin 대시보드
```

**확인 사항:**
- [ ] 공개 페이지: 히어로 이미지 + 제목 + 설명 + 8개 갤러리
- [ ] Admin 대시보드: STUDIO KNOT 프로젝트 항목 표시
- [ ] Admin 모달: STUDIO KNOT 수정 클릭 → Content 탭 → "No blocks yet"

---

### 3️⃣ 작업 계획 선택 (2분)

**Option A: 수동 입력 (🟡 추천 - 간단)**
- Admin CMS에서 "+ Add Block" 클릭
- 4개 블록 직접 입력 (5-10분)
- 실시간 미리보기로 검증

**Option B: 스크립트 자동 생성 (🟢 고급)**
- TypeScript 스크립트 실행
- 블록 JSON 자동 생성
- API 호출로 DB 저장

**선택:**
```
처음이면 Option A (수동 입력)
시간이 많으면 Option B (자동화)
```

---

## 📝 작업 단계

### STEP 1: 데이터 분석 (이미 완료 ✅)

**4개 블록으로 변환:**

| Block | 타입 | 내용 |
|-------|------|------|
| 0️⃣ | `hero-image` | `/images/work/knot/hero.png` |
| 1️⃣ | `work-title` | STUDIO KNOT / 노하린 / havein6@gmail.com |
| 2️⃣ | `text` | 프로젝트 설명 (277자) |
| 3️⃣ | `work-gallery` | 8개 갤러리 이미지 |

✅ **상세:** BLOCKS_GENERATION_GUIDE.md 참고

---

### STEP 2: 블록 생성 (이번 세션 작업 - 선택 Option)

#### 🟡 Option A: Admin CMS 수동 추가 (추천)

```
1. Admin 대시보드 접속
   http://localhost:3000/admin/dashboard/work

2. STUDIO KNOT 항목에서 "수정" 버튼 클릭
   → Edit Portfolio 모달 열림

3. "Content (Blocks)" 탭 클릭
   → 3-panel 레이아웃 표시

4. 블록 추가 (4번 반복)
   A. 좌측 하단 "+ Add Block" 클릭
   B. 블록 타입 선택
   C. 상세 정보 입력
   D. 우측 미리보기에서 확인

5. 순서대로 추가:
   - Block 1: hero-image
     * URL: /images/work/knot/hero.png
   - Block 2: work-title
     * Title: STUDIO KNOT
     * Author: 노하린
     * Email: havein6@gmail.com
   - Block 3: text
     * Content: STUDIO KNOT는 입지 않는 옷에...
   - Block 4: work-gallery
     * 8개 이미지: gallery-1.png ~ gallery-8.png

6. "Save Changes" 클릭
   → DB 저장
```

**예상 시간:** 5-10분
**난이도:** ⭐ 초급

---

#### 🟢 Option B: 스크립트 자동 생성 (고급)

**상세:** BLOCKS_GENERATION_GUIDE.md의 "옵션 2" 섹션 참고

```bash
# 1. 스크립트 실행
npx tsx src/scripts/generate-studio-knot-blocks.ts

# 2. JSON 출력 확인
# {
#   version: "1.0",
#   blocks: [...]
# }

# 3. API로 DB 업데이트
curl -X PUT http://localhost:3000/api/admin/work/projects/<ID> \
  -H "Content-Type: application/json" \
  -d '{"content": {...}}'
```

**예상 시간:** 3-5분
**난이도:** ⭐⭐⭐ 고급

---

### STEP 3: CMS 검증 (이번 세션 작업)

```
1. Admin 대시보드 새로고침
   http://localhost:3000/admin/dashboard/work

2. STUDIO KNOT "수정" 클릭

3. Content 탭 확인:
   ✅ 좌측: 4개 블록 시각화 (카드 형식)
      - Hero Image 블록
      - Work Title 블록
      - Text 블록
      - Work Gallery 블록

   ✅ 중앙: 각 블록 선택 시 에디터 표시
      - 각 블록 클릭해보기
      - 상세 정보 편집 가능 확인

   ✅ 우측: 실시간 미리보기
      - Hero 이미지 표시
      - 제목 + 작가 정보 표시
      - 설명 텍스트 표시
      - 갤러리 이미지 표시

4. 만족하면 "Save Changes" 클릭
```

**확인 항목:**
- [ ] 4개 블록 모두 시각화
- [ ] 블록 선택 시 에디터 전환
- [ ] 미리보기 업데이트
- [ ] 변경사항 저장 성공

---

### STEP 4: 공개 페이지 검증 (선택)

```
1. 공개 페이지 새로고침
   http://localhost:3000/work/9

2. 렌더링 확인:
   ✅ Hero 이미지
   ✅ 제목 (STUDIO KNOT) + 작가 (노하린)
   ✅ 설명 텍스트 (277자)
   ✅ 8개 갤러리 이미지

3. 스크린샷 비교:
   - 기존과 동일한지 확인
   - 레이아웃 변경 없음
   - 모든 콘텐츠 표시됨
```

**예상:** 공개 페이지는 기존과 완벽히 동일해야 함 (블록 기반으로 렌더링되므로)

---

## 🛠️ 문제 해결

### Q1: Admin CMS에서 STUDIO KNOT를 찾을 수 없음

**원인:** 프로젝트 목록이 로드되지 않음

**해결:**
```bash
# 1. Dev 서버 로그 확인
npm run dev

# 2. 콘솔에서 에러 확인
# API /api/admin/work/projects 실패 여부 확인

# 3. 재시작
# Ctrl+C로 서버 중지
# npm run dev로 재시작
```

---

### Q2: 블록 추가 후 미리보기가 안 나옴

**원인:** 미리보기 렌더러 로드 오류

**해결:**
```bash
# 1. 브라우저 콘솔 확인 (F12)
# 에러 메시지 확인

# 2. 페이지 새로고침 (F5)

# 3. 모달 닫았다가 다시 열기
# "Cancel" → "수정" 다시 클릭
```

---

### Q3: 갤러리 이미지 경로가 잘못됨

**원인:** 이미지 파일 누락 또는 경로 오류

**확인:**
```bash
# 1. 파일 실제 존재 확인
ls -la public/images/work/knot/

# 2. 경로 정확성 확인
# /images/work/knot/gallery-1.png (O)
# /public/images/work/knot/gallery-1.png (X)

# 3. 파일명 대소문자 확인 (Linux/Mac 민감함)
```

---

## 📚 참고 문서

| 문서 | 용도 |
|------|------|
| **STUDIO_KNOT_CMS_INTEGRATION.md** | 📖 전체 계획 및 아키텍처 |
| **BLOCKS_GENERATION_GUIDE.md** | 🛠️ 블록 상세 스펙 및 생성 방법 |
| **SESSION_CHECKLIST_STUDIO_KNOT.md** | ✅ 이 파일 (세션 체크리스트) |

---

## 🎯 다음 단계

**이 세션:**
1. ✅ STUDIO KNOT_CMS_INTEGRATION.md 읽기 (전체 계획)
2. ✅ BLOCKS_GENERATION_GUIDE.md 읽기 (구현 상세)
3. ⏳ 블록 생성 (Option A 또는 B 선택)
4. ⏳ CMS 검증

**다음 세션 (선택):**
5. 공개 페이지 검증
6. 다른 프로젝트도 BlockEditor 기반으로 변환 (Vora, Mindit 등)

---

## ⚠️ 절대 금지사항

```
❌ 다른 프로젝트(1-8, 10-12)의 content 수정
❌ work-details.ts의 STUDIO KNOT 데이터 변경
❌ 4개 블록 이상 추가 (정확히 4개만)
❌ 블록 순서 변경 (hero → title → text → gallery)
❌ 이미지 경로 변경 (꼭 필요한 경우만)
```

---

## 📞 긴급 연락처

문제 발생 시:
1. 이 파일의 "문제 해결" 섹션 확인
2. PITFALLS.md 검색 (자주하는 실수)
3. MEMORY.md 최근 세션 로그 확인

---

**생성:** 2026-02-16
**마지막 수정:** 2026-02-16
**상태:** 분석 완료 ✅ → 실행 준비 완료 🚀

---

## 🚀 세션 시작 단축키

```bash
# 터미널에서
npm run dev

# 브라우저에서 동시 접속
- http://localhost:3000/work/9 (공개 페이지 참고)
- http://localhost:3000/admin/dashboard/work (Admin 대시보드 작업)

# 이 파일들을 에디터로 나란히 열기
- STUDIO_KNOT_CMS_INTEGRATION.md (왼쪽)
- BLOCKS_GENERATION_GUIDE.md (오른쪽)
- SESSION_CHECKLIST_STUDIO_KNOT.md (위)

준비 완료! 🎯
```
