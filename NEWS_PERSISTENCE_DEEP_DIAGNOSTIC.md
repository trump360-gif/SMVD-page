# 🔍 News CMS 데이터 반영 미흡 - 심화 진단 리포트

**작성:** 2026-02-16
**대상:** 2024 시각·영상디자인과 졸업전시회 (slug='5') 기사
**문제:** CMS에서 수정해도 공개 페이지(/news/5)에 반영 안 됨

---

## 🚨 발견 사항 (4가지)

### ❌ 발견 1: Next.js 캐싱 문제 (최우선 해결)

**코드 위치:** `/src/app/(public)/news/[id]/page.tsx`

**문제:**
```typescript
// ❌ 이전: 캐시 설정 없음
export default async function NewsDetailPage(...) {
  // Next.js 기본값: 정적 생성 후 캐시 (ISR 모드)
  // → 초기 빌드 시 데이터 한번 가져온 후 캐시
  // → Admin에서 수정해도 캐시된 데이터 계속 표시
}
```

**해결 (이미 적용됨):**
```typescript
// ✅ 지금: 캐싱 비활성화
export const revalidate = 0;  // ← 추가됨
// 매 요청마다 DB에서 최신 데이터 가져옴
```

**영향:**
- ✅ Admin에서 저장 → 즉시 공개 페이지에 반영
- ✅ 브라우저 캐시 무시
- ✅ 항상 최신 DB 데이터 사용

---

### ❌ 발견 2: 라우팅 논리 검증

**코드:** `/src/app/(public)/news/[id]/page.tsx:44-107`

**흐름:**
```
URL: http://localhost:3000/news/5
  ↓
params.id = "5"
  ↓
getNewsDetail("5")  // "5"를 slug로 사용!
  ↓
prisma.newsEvent.findUnique({
  where: { slug: "5" }  // ← slug="5"인 기사를 찾음
})
```

**즉, URL의 "5"는 slug를 의미합니다!** (id 필드 X)

✅ 초기화 데이터 (라인 45):
```typescript
{
  slug: '5',                    // ← 정확히 일치
  title: '2024 시각·영상디자인과 졸업전시회',
  category: 'Event',
  content: {
    introTitle: '2024 시각영상디자인과 졸업전시회',
    introText: '이번 전시 주제인...',
    gallery: {
      main: '/images/work-detail/Rectangle 240652481.png',
      centerLeft: '/images/work-detail/Rectangle 240652482.png',
      // ... 6개 이미지
    }
  }
}
```

---

### ❌ 발견 3: 콘텐츠 형식 감지 로직

**코드:** 라인 62-77

```typescript
// 조건: blocks[] 배열이 있고, 비어있지 않으면 block 렌더러 사용
if (
  content &&
  'blocks' in content &&
  Array.isArray(content.blocks) &&
  content.blocks.length > 0  // ← 중요! 비어있으면 안 됨
) {
  return { type: 'blocks', ... };  // ✅ 새 형식 사용
}

// 아니면 legacy 렌더러 (초기 갤러리 이미지)
return { type: 'legacy', ... };  // ❌ 초기 상태
```

**문제점:**
```
CMS에서 저장했을 때:
✅ content.blocks[] 배열이 생성되어야 함
❌ 근데 blocks[] 배열이 없거나 비어있으면
   → legacy 렌더러 작동
   → 초기 갤러리 이미지만 표시 (수정 내용 안 보임)
```

---

### ❌ 발견 4: DB 초기화 상태 미확인

**문제:**
- `/api/admin/news/init` 엔드포인트가 언제 실행되었는가?
- slug='5'인 기사가 실제로 DB에 있는가?
- CMS에서 수정한 내용이 `content.blocks[]`로 저장되었는가?

---

## 🔧 해결 방법 (단계별)

### **Step 1: DB 초기화 확인 및 실행**

**Browser Console에서:**
```javascript
// DB의 모든 뉴스 기사 확인
fetch('/api/admin/news/articles', {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => {
  console.log('📋 모든 뉴스 기사:', d.data);
  const article5 = d.data?.find(a => a.slug === '5');
  console.log('🎯 Slug="5" 기사:', article5);
  console.log('📦 Content:', article5?.content);
})
```

**결과 해석:**
- ✅ 기사가 있고 `content.blocks[]` 배열이 있고 비어있지 않으면 → 성공!
- ❌ 기사가 없으면 → Step 2로
- ❌ 기사는 있지만 blocks가 없으면 → Step 3으로

---

### **Step 2: DB 초기화 (데이터 없을 때)**

**Admin 대시보드에서:**
1. http://localhost:3000/admin/dashboard/news 방문
2. "Initialize News" 또는 "뉴스 초기화" 버튼 클릭
3. 완료 메시지 확인
4. Step 1의 Console 명령 다시 실행

**또는 직접 API 호출:**
```javascript
// Browser Console:
fetch('/api/admin/news/init', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => console.log('✅ 초기화 결과:', d))
```

---

### **Step 3: CMS에서 수정 및 저장**

**조건:** DB에 slug='5' 기사가 이미 있어야 함

**절차:**
1. http://localhost:3000/admin/dashboard/news 로그인
2. "2024 시각·영상디자인과 졸업전시회" 기사 찾기
3. 상세 페이지 모달 열기 (클릭)
4. **Content 탭** 선택
5. 블록 추가 또는 수정:
   - "Add Block" 클릭
   - Text, Image, Image-Grid 등 추가
   - 행 레이아웃 설정
6. **"Save" 버튼** 클릭

---

### **Step 4: Network 탭에서 PUT 요청 검증**

**F12 → Network 탭:**

1. Step 3의 "Save" 클릭 직후
2. 상단에 새로운 요청이 나타남
3. Method: **PUT**
4. URL: `/api/admin/news/articles/{id}`
5. Status: **200** (꼭 확인!)
   - ❌ 404: URL 오류
   - ❌ 405: 핸들러 없음 (하지만 우리가 이미 수정함)
   - ❌ 500: 서버 오류
   - ✅ 200: 성공!

6. Response 탭에서:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "slug": "5",
    "title": "2024 시각...",
    "content": {
      "blocks": [
        { "id": "...", "type": "text", "content": "..." },
        { "id": "...", "type": "image", "url": "..." },
        ...
      ],
      "rowConfig": [
        { "layout": 1, "blockCount": 2 },
        ...
      ],
      "version": "1.0"
    }
  }
}
```

**확인:**
- ✅ `content.blocks[]` 배열이 비어있지 않나?
- ✅ `content.rowConfig[]` 배열이 있나?
- ✅ 추가한 블록들이 정확히 저장되었나?

---

### **Step 5: 공개 페이지 새로고침 및 확인**

**F12 설정:**
1. F12 → Network 탭
2. **"Disable cache" 체크** (중요!)
3. **Page 탭** (또는 "Preserve log" 체크)

**페이지 방문:**
```
http://localhost:3000/news/5
```

**확인:**
1. 페이지가 로드됨
2. "2024 시각·영상디자인과 졸업전시회" 제목 보임
3. CMS에서 추가한 블록들이 보임:
   - ✅ 텍스트 블록
   - ✅ 이미지 블록
   - ✅ 이미지 그리드
4. 초기 갤러리 이미지 (legacy format) 보임 (또는 안 보임)

---

### **Step 6: 캐시 문제 최종 확인**

**3가지 방법으로 새로고침:**

1. **일반 새로고침:**
   ```
   F5 또는 Cmd+R
   ```

2. **강력 새로고침 (권장):**
   ```
   Ctrl+Shift+Delete (Windows)
   Cmd+Shift+Delete (Mac)
   ```

3. **개발자 도구 새로고침:**
   - F12 열린 상태에서
   - 새로고침 버튼 우클릭
   - "Empty cache and hard refresh" 선택

**결과:**
- ✅ 모든 방법에서 같은 콘텐츠 보임 → 정상
- ❌ 새로고침 후 다른 콘텐츠 보임 → 캐싱 문제

---

## 📊 현재 상태 검증

### ✅ 이미 수정된 것

| 항목 | 파일 | 상태 |
|------|------|------|
| API 핸들러 | `/api/admin/news/articles/route.ts` | ✅ 중복 제거 |
| JSON 직렬화 | `/api/admin/news/articles/[id]/route.ts` | ✅ 수정됨 |
| 캐싱 설정 | `/news/[id]/page.tsx` | ✅ revalidate=0 추가 |
| 빌드 | npm run build | ✅ 0 에러 |

### ❓ 확인이 필요한 것

| 항목 | 확인 방법 |
|------|---------|
| DB 초기화 | Console fetch 명령 |
| 저장 요청 상태 | Network 탭에서 PUT 200 확인 |
| blocks[] 저장 여부 | Network 응답 보기 |
| 캐시 적용 | 공개 페이지 새로고침 |

---

## 🎯 문제 해결 체크리스트

```
□ 1단계: Console 명령으로 DB 데이터 확인
        - slug='5' 기사 있는가?
        - content.blocks[] 있는가?

□ 2단계: DB 초기화 (필요하면)
        - /api/admin/news/init 실행
        - Step 1 다시 확인

□ 3단계: CMS에서 수정하고 저장
        - Content 탭에서 블록 추가/수정
        - Save 버튼 클릭

□ 4단계: Network 탭 검증
        - PUT 요청 찾기
        - Status 200 확인
        - Response에 blocks[] 있는지 확인

□ 5단계: 공개 페이지 새로고침
        - F12 → Network → "Disable cache" 체크
        - http://localhost:3000/news/5 방문
        - 변경 내용 보임?

□ 6단계: 강력 새로고침
        - Ctrl+Shift+Delete
        - 다시 /news/5 방문
        - 같은 결과 보임? (캐싱 문제 아님)
```

---

## 🚨 예상되는 원인별 진단

### 원인 1: DB에 데이터 없음
**증상:** Console에서 `article5 === undefined`

**해결:**
```javascript
// 초기화 실행
fetch('/api/admin/news/init', {
  method: 'POST',
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log('초기화됨:', d))
```

---

### 원인 2: CMS 저장 실패
**증상:** Network에서 PUT 상태가 404, 405, 또는 500

**해결:**
- 응답 메시지 확인
- 개발 서버 콘솔에서 에러 찾기
- 이전 리포트의 "API 수정사항" 다시 확인

---

### 원인 3: blocks[] 배열이 비었음
**증상:** Console에서 `article5.content.blocks` === `undefined` 또는 `[]`

**해결:**
- CMS에서 블록을 제대로 추가했는지 확인
- "Save" 후 Network 응답에 blocks[]이 있는지 확인
- blocks[]이 비어있으면 CMS UI에서 "Add Block" 실행

---

### 원인 4: Next.js 캐싱
**증상:** 저장 후 새로고침해도 이전 내용 보임

**상태:** ✅ **이미 수정됨** (revalidate=0 추가)

**추가 확인:**
- 강력 새로고침 (Ctrl+Shift+Del) 후에도 같은가?
- Network 탭에서 실제로 최신 데이터 가져오나?

---

## 📝 최종 결론

### 이미 해결된 것
1. ✅ API 핸들러 중복 제거
2. ✅ JSON 직렬화 수정
3. ✅ Next.js 캐싱 비활성화 (revalidate=0)

### 이제 확인해야 할 것
1. ❓ DB에 실제로 데이터가 있는가?
2. ❓ CMS에서 저장할 때 blocks[] 배열이 생성되는가?
3. ❓ PUT 요청이 200 상태로 완료되는가?

### 즉각적인 액션
1. Browser Console에서 fetch 명령 실행
2. 결과 보고
3. 필요하면 DB 초기화
4. CMS에서 블록 수정 후 저장
5. Network 탭에서 상태 코드 확인

---

## 💡 핵심 포인트

```
❌ 문제: CMS에서 저장해도 공개 페이지에 반영 안 됨

✅ 원인들:
1. DB에 초기 데이터 없음
2. 저장 요청 실패
3. blocks[] 배열이 비었음
4. Next.js 캐싱 (이미 수정됨)

🔧 해결:
1. DB 초기화
2. API 응답 확인
3. Network 상태 코드 확인
4. 공개 페이지 강력 새로고침
```

