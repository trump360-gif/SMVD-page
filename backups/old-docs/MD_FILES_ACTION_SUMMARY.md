# 🚀 .md 파일 정리 액션 (한눈에 보기)

## 📊 79개 .md 파일 분류

| 분류 | 개수 | 액션 | 안전도 |
|------|------|------|-------|
| **필수 유지** | 5개 | 그대로 두기 | ✅ |
| **참고용** | 22개 | archive/ 이동 | ✅ |
| **삭제 가능** | 34개 | 바로 삭제 | ✅✅✅ |

---

## ✅ 필수 유지 (5개 - 건드리지 말 것)

```
README.md                   # 프로젝트 설명
CLAUDE.md                   # 프로젝트 규칙
SETUP.md                    # 환경 설정
QUICK_START.md              # 빠른 시작
DEPLOYMENT.md               # 배포 가이드
```

**액션:** 유지 ✅

---

## 📦 Archive로 이동 (22개)

**시점:** 나중에 필요할 수 있는 참고 자료

```
STUDIO_KNOT_CMS_* (9개)     # 기능별 설계 문서
BLOCKS_GENERATION_GUIDE.md  # 블록 생성 방법
PRISMA_SCHEMA_DESIGN.md     # 스키마 설계
WORK_DATA_MAPPING.md        # 데이터 구조
(기타 SETUP_GUIDES 10개)
```

**액션:**
```bash
mkdir -p docs/archive
git mv <22개 파일> docs/archive/
git commit -m "chore: Archive reference documentation"
git push origin main
```

---

## ❌ 즉시 삭제 (34개)

**시점:** 개발 중 임시 생성된 분석/리포트

```
임시 분석 리포트 (30개):
- *_ANALYSIS_REPORT.md
- *_DIAGNOSTIC.md
- *_VERIFICATION_REPORT.md
- *_FINAL_REPORT.md
- 등등...

세션 메모 (4개):
- NEXT_SESSION_PROMPT.md
- *-snapshot.md
- current-state-with-upload.md
```

**예시:**
```
❌ CMS_MODAL_ENHANCEMENT_ANALYSIS.md
❌ HOME_PAGE_ANALYSIS_REPORT.md
❌ NEWS_PERSISTENCE_DEEP_DIAGNOSTIC.md
❌ STUDIO_KNOT_CMS_COMPLETION_REPORT.md
❌ about-page-snapshot.md
... (총 34개)
```

**액션:**
```bash
git rm <34개 파일>
git commit -m "chore: Remove temporary analysis and session reports"
git push origin main
```

---

## 🔒 안전성 확인

✅ **코드에서 참조하지 않음** (Grep 확인 완료)
✅ **Git 히스토리에 모두 보존됨** (삭제 후에도 조회 가능)
✅ **프로젝트 동작에 영향 없음**

---

## 💾 PNG 파일 (466개)

**현황:** 466개 모두 git tracked
**디스크:** ~100-150MB
**권장:** 별도 정리 필요

→ `PROJECT_CLEANUP_REPORT.md` 참고

---

## 🏃 빠른 실행 (3분)

### 1️⃣ 커밋 (현재 상태 보관)
```bash
git add -A
git commit -m "backup: Before .md file cleanup"
git push origin main
```

### 2️⃣ Archive 폴더 이동 (22개)
```bash
mkdir -p docs/archive
# (22개 파일 이동)
git commit -m "chore: Archive reference documentation"
git push origin main
```

### 3️⃣ 임시 파일 삭제 (34개)
```bash
git rm <34개 파일>
git commit -m "chore: Remove temporary analysis files"
git push origin main
```

### 4️⃣ 검증
```bash
npm run build      # ✅ 성공해야 함
npm run dev        # ✅ 정상 시작해야 함
git status         # ✅ clean해야 함
```

---

## 📋 체크리스트

- [ ] `GIT_MD_FILES_DETAILED_ANALYSIS.md` 읽기
- [ ] Step 1, 2, 3 순서대로 실행
- [ ] 검증 완료
- [ ] 프로젝트 동작 확인

---

**결론:** 안전하게 정리할 수 있습니다! ✨
