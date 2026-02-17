# 파일 첨부 기능 테스트 가이드 (2026-02-16 ✅ 수정됨)

## 🔧 수정 내용
- **문제**: 파일 업로드 API가 인증 실패 (HTTP 307)
- **원인**: Fetch 요청에 `credentials: 'include'` 옵션이 없었음
- **해결**: NewsBlogModal.tsx Line 400-403에 `credentials: 'include'` 추가
- **커밋**: `4a8036d` - Add credentials to file upload fetch request

---

## 📋 테스트 절차

### Step 1: 관리자 로그인
```
1. 브라우저 열기: http://localhost:3000/admin/login
2. NextAuth 계정으로 로그인
   - Email/Password 입력
   - 또는 GitHub/Google 계정으로 로그인
```

### Step 2: News 대시보드로 이동
```
1. 로그인 후: http://localhost:3000/admin/dashboard/news
2. 또는 대시보드 메뉴에서 "News" 클릭
```

### Step 3: 기사 편집 또는 생성
```
옵션 A - 기존 기사 편집:
  1. 기사 목록에서 하나 선택
  2. "Edit" 버튼 클릭

옵션 B - 새 기사 생성:
  1. "+ New Article" 버튼 클릭
  2. 제목, 카테고리, 내용 입력
```

### Step 4: 파일 첨부
```
1. 모달에서 "Attachments" 탭 클릭
2. "Upload File" 버튼 클릭 또는 드래그 앤 드롭
3. 파일 선택 (PDF, Word, Excel, 텍스트 등)
4. 파일이 목록에 추가되는지 확인
```

### Step 5: 저장 및 검증
```
1. "Save Article" 버튼 클릭
2. 로딩이 완료되고 모달이 닫히는지 확인
3. 기사가 저장되었는지 확인
```

### Step 6: 파일 확인
```
터미널에서:
  ls -lh ./public/uploads/2026/02/

예상 파일 명명:
  - {해시}-{원본파일명}.{확장자}
  - 예: a1f844b717b8f029-proposal.pdf
```

---

## 🔍 문제 해결

### 파일이 저장되지 않음
```
1. 브라우저 콘솔 (F12 → Console) 확인
   - 에러 메시지가 있는지 확인

2. 브라우저 Network 탭 (F12 → Network) 확인
   - /api/admin/upload/document 요청 확인
   - 상태 코드 확인:
     - 201 = 성공
     - 307 = 인증 실패
     - 400 = 파일 형식 오류
     - 500 = 서버 오류

3. 서버 로그 확인
   - 터미널에서 dev 서버 출력 확인
   - DEBUG=1을 설정하면 더 자세한 로그 출력
```

### 다운로드가 작동하지 않음
```
1. 파일이 실제로 저장되었는지 확인
   ls -lh ./public/uploads/2026/02/

2. 파일 경로가 올바른지 확인
   - 데이터베이스에서 filepath 필드 확인
   - /uploads/2026/02/{파일명} 형식이어야 함

3. 공개 페이지에서 확인
   http://localhost:3000/news/5 (또는 해당 기사 ID)
```

---

## 📊 기대 결과

### 성공 시
- ✅ 파일이 `/public/uploads/2026/02/` 폴더에 저장됨
- ✅ 브라우저 Network: `/api/admin/upload/document` → 201 Created
- ✅ 공개 페이지에서 "Attached File" 섹션에 파일 목록 표시
- ✅ 파일명을 클릭하면 다운로드 가능

### 실패 시
- ❌ 파일이 저장되지 않음
- ❌ 브라우저 Network: `/api/admin/upload/document` → 307 Redirect
- ❌ 콘솔에 에러 메시지 표시
- ❌ 공개 페이지에서 "Attached File" 섹션이 나타나지 않음

---

## 📝 API 스펙

### POST /api/admin/upload/document
```
Request:
  Content-Type: multipart/form-data
  Body: { file: File }

Response (201):
  {
    "success": true,
    "data": {
      "id": "a1f844b717b8f029",
      "filename": "proposal.pdf",
      "filepath": "/uploads/2026/02/a1f844b717b8f029-proposal.pdf",
      "mimeType": "application/pdf",
      "size": 245120,
      "uploadedAt": "2026-02-16T15:50:44.000Z"
    },
    "message": "파일이 업로드되었습니다"
  }

Response (307 - 인증 실패):
  Redirect to: /api/auth/signin?callbackUrl=%2Fapi%2Fadmin%2Fupload%2Fdocument

Response (400 - 파일 형식 오류):
  {
    "success": false,
    "error": "보안 정책상 이 파일 형식은 업로드할 수 없습니다",
    "code": "BLOCKED_FILE_TYPE"
  }
```

---

## ✅ 체크리스트

- [ ] 관리자 로그인 성공
- [ ] News 대시보드 접속
- [ ] 기사 편집 모달 열림
- [ ] Attachments 탭 활성화
- [ ] 파일 선택 가능
- [ ] Save Article 클릭
- [ ] /public/uploads/2026/02/ 폴더에 파일 생성됨
- [ ] 공개 페이지에서 "Attached File" 섹션 표시
- [ ] 파일 다운로드 작동

---

## 🚀 다음 단계

1. **위 테스트 절차 실행**
2. **결과 보고**
   - 성공: ✅ 파일이 저장되었으면 완료!
   - 실패: ❌ 에러 메시지/스크린샷 제공

3. **추가 개선 사항** (필요시)
   - 파일 크기 제한 조정
   - 허용 파일 형식 추가
   - UI/UX 개선

---

**작성일**: 2026-02-16
**마지막 수정**: 4a8036d (credentials 옵션 추가)
