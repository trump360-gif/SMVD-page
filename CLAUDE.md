# SMVD CMS 프로젝트 - 자동 실행 규칙

---

## 🚀 **새 세션 자동 시작 규칙** (★ 필수)

**Claude가 새 세션을 시작할 때마다:**

```
1️⃣ CLAUDE.md 읽기 (프로젝트 규칙 + 자동화 확인)
2️⃣ MEMORY.md 읽기 (이전 세션 작업 상태)
3️⃣ SESSION_CHECKLIST.md의 "작업 전 5분 점검" 실행
4️⃣ 사용자의 첫 요청에 따라 필요한 문서 참고
```

**실행 체크리스트:**
- ✅ 세션 시작 후 즉시 위 3개 문서 로드
- ✅ 문서 로드 후 사용자에게 "SESSION_CHECKLIST의 작업 전 5분 점검" 제시
- ✅ 이후: API_SPECIFICATION.md (API 작성), TYPES_REFERENCE.md (타입), ARCHITECTURE_GUIDE.md (구조), PITFALLS.md (디버깅)

---

## 🔍 **DB 상태 자동 진단** (psql 기반)

**다음 상황에서 자동 진단 실행:**

| 상황 | 자동? | 확인 항목 |
|------|-----|---------|
| 로그인 버그 | ✅ 예 | User 테이블 (admin@smvd.ac.kr 존재?) |
| 콘텐츠 안 보임 | ✅ 예 | Section.content IS NOT NULL? |
| 이미지 안 뜸 | ✅ 예 | Media.path 정상? |
| 순서/중복 이슈 | ✅ 예 | order 필드 (NULL/중복?) |
| 마이그레이션 후 | ✅ 예 | Schema 변경 반영 확인 |

**자동 진단 명령어:**

```bash
# 1. 연결 확인
psql -U jeonminjun -d smvd_cms -c "SELECT version();"

# 2. 핵심 테이블 상태
psql -U jeonminjun -d smvd_cms << EOF
SELECT 'User' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Section', COUNT(*) FROM "Section"
UNION ALL
SELECT 'Media', COUNT(*) FROM "Media";
EOF

# 3. 문제별 진단
# 로그인: SELECT * FROM "User" WHERE email='admin@smvd.ac.kr';
# 콘텐츠: SELECT COUNT(*) FROM "Section" WHERE content IS NULL;
# 이미지: SELECT COUNT(*) FROM "Media" WHERE path IS NULL;
# 순서: SELECT COUNT(*) FROM "Section" WHERE "order" IS NULL;
```

**결과 처리:**
- ✅ 정상: MEMORY.md에 "✅ DB 정상" 기록
- 🔴 이상 발견: 상세 내용 + 즉시 보고
- ⚠️ 연결 실패: "🔴 psql 연결 실패" 보고

> 💡 **psql 용도 제한** - DB 데이터만 확인 (코드 버그, API 성능, 렌더링은 다른 도구 필요)

---

## 📚 **필수 참고 문서 (즉시 참고용)**

| 문서 | 언제 사용? | 위치 |
|------|---------|------|
| **SESSION_CHECKLIST.md** | 세션 시작 후 가장 먼저 | 루트 |
| **PITFALLS.md** | 에러 발생했을 때 (Ctrl+F 검색) | 루트 |
| **API_SPECIFICATION.md** | API 호출/작성 시 | 루트 |
| **TYPES_REFERENCE.md** | 타입 사용 전 확인 | 루트 |
| **ARCHITECTURE_GUIDE.md** | 새 기능 추가 시 | 루트 |
| **MEMORY.md** | 이전 세션 확인 (세션 시작 후 자동) | 메모리 폴더 |

---

## 프로젝트 정보

**Tech Stack**: Next.js 15 + React 19 + TypeScript + PostgreSQL + NextAuth.js v5

**6개 공개 페이지**: Home, About Major, Curriculum, People, Work, News&Event

**3개 관리 기능**: 콘텐츠 CMS, 네비게이션 관리, 푸터 관리
