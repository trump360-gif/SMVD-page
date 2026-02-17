# 📊 SMVD 프로젝트 파일 정리 리포트
**작성일:** 2026-02-17
**분석 대상:** 프로젝트 루트 및 주요 폴더
**총 파일 수:** ~750개 이상

---

## 📈 현재 상황

### 디스크 사용량 (Top 10)
| 항목 | 크기 | 상태 |
|------|------|------|
| node_modules | 624M | ✅ 유지 (필수) |
| public | 83M | ✅ 유지 (공개 자산) |
| backups | 72M | ❌ 삭제 가능 |
| knot | 30M | ⚠️ 검토 필요 |
| img | 26M | ✅ 유지 (사이트 이미지) |
| src | 21M | ✅ 유지 (소스 코드) |
| 2024 졸업전시회 | 7M | ⚠️ 아카이빙 추천 |
| Exhibition | 6.6M | ✅ 유지 (사이트 이미지) |
| source | 8.2M | ⚠️ 검토 필요 |
| playwright-report | 4.6M | ❌ 삭제 가능 |

**총 디스크 사용량:** 대략 **850MB+** (node_modules 제외 시 약 **230MB**)

---

## 🗂️ 정리 대상 분류

### **Category 1: 즉시 삭제 가능 (안전함)** ✅

#### 1-1. 낡은 분석/계획 문서 (82개 .md 파일)
```
삭제 추천: 약 60개 파일
유지 추천: 약 20개 파일
```

**삭제 가능 (작은 크기, 임시 성격):**
- PHASE_1_EXECUTION_PLAN.md (32K) - 실행 완료됨
- CODE_ANALYSIS_REPORT.md (32K) - 보관됨
- DESIGN_ANALYSIS_REPORT.md (32K) - 이미 반영됨
- MODAL_ARCHITECTURE_ANALYSIS.md (16K) - 임시 분석
- LAYOUT_ROW_CODE_ANALYSIS.md (12K) - 임시 분석
- LAYOUT_CONTROL_ANALYSIS.md (12K) - 임시 분석
- STUDIO_KNOT_CMS_* (12개 파일) - 개발 중 임시 문서
- NEWS_* (10개 파일) - 개발 중 분석 문서
- PHASE_*_COMPLETE.md (6개 파일) - 완료 마크업
- CMS_*_ANALYSIS.md (5개 파일) - 임시 분석
- 기타 임시 리포트 (15개+ 파일)

**세부 목록 (61개 삭제 권장):**
```
삭제 추천 파일들:
1. ABOUT_CMS_DIAGNOSIS.md
2. BLOCKS_GENERATION_GUIDE.md
3. BLOG_MODAL_BACKUP.md
4. CMS_MODAL_ENHANCEMENT_ANALYSIS.md
5. CMS_PREVIEW_COMPARISON_REPORT.md
6. CODE_ANALYSIS_REPORT.md
7. CODE_QUALITY_REVIEW_REPORT.md
8. COMPLETE_IMPLEMENTATION_ROADMAP.md
9. COMPREHENSIVE_IMPLEMENTATION_PLAN.md
10. DESIGN_ANALYSIS_REPORT.md
11. DESIGN_SYSTEM.md
12. ENVIRONMENT_SETUP.md
13. EXACT_ANALYSIS_REPORT_FINAL.md
14. EXECUTION_GUIDE.md
15. FINAL_REPORT_STUDIO_KNOT_CMS.md
16. FINAL_VALIDATION_REPORT.md
17. FIX_STUDIO_KNOT_CMS_QUICK_GUIDE.md
18. FILE_UPLOAD_TEST_GUIDE.md
19. GRADUATION_EXHIBITION_VERIFICATION_REPORT.md
20. HOME_PAGE_ANALYSIS_REPORT.md
21. LAYOUT_CONTROL_ANALYSIS.md
22. LAYOUT_ROW_CODE_ANALYSIS.md
23. LAYOUT_IMPROVEMENTS_PHASE_PLAN.md
24. MODAL_ARCHITECTURE_ANALYSIS.md
25. MIGRATION_CHECKLIST.md
26. NAVIGATION_FOOTER_CMS_ANALYSIS_REPORT.md
27. NAVIGATION_FOOTER_CMS_CORRECTED_ANALYSIS.md
28. NEWS_ATTACHMENT_FEATURE_ANALYSIS.md
29. NEWS_BLOCK_PERSISTENCE_FIX.md
30. NEWS_CMS_DATA_PERSISTENCE_DIAGNOSTIC.md
31. NEWS_DATA_MAPPING.md
32. NEWS_E2E_VERIFICATION_REPORT.md
33. NEWS_IMAGE_WIDTH_ANALYSIS.md
34. NEWS_PERSISTENCE_DEEP_DIAGNOSTIC.md
35. NEXT_SESSION_PROMPT.md
36. OPTIONAL_IMPROVEMENTS_REPORT.md
37. PHASE_1_COMPLETION_REPORT.md
38. PHASE_1_COMPLETE.md
39. PHASE_1_DASHBOARD.md
40. PHASE_1_EXECUTION_PLAN.md
41. PHASE_2_COMPLETE.md
42. PHASE_3_COMPLETE.md
43. PHASE_4_COMPLETE.md
44. PHASE_5_COMPLETE.md
45. PHASE_6_COMPLETE.md
46. PHASE_EXECUTION_SUMMARY.md
47. PRISMA_SCHEMA_DESIGN.md
48. ROOT_CAUSE_ANALYSIS_FINAL.md
49. SESSION_CHECKLIST_STUDIO_KNOT.md
50. SESSION_FINAL_REPORT_2026_02_16.md
51. SETUP_STATUS.txt
52. STUDIO_KNOT_ANALYSIS_REPORT.md
53. STUDIO_KNOT_CMS_COMPLETE_IMPLEMENTATION_PLAN.md
54. STUDIO_KNOT_CMS_COMPLETION_REPORT.md
55. STUDIO_KNOT_CMS_DATA_SYNC_BUG.md
56. STUDIO_KNOT_CMS_FINAL_SPECIFICATION.md
57. STUDIO_KNOT_CMS_FIX_FINAL_REPORT.md
58. STUDIO_KNOT_CMS_INFINITE_LOOP_FIX.md
59. STUDIO_KNOT_CMS_INTEGRATION.md
60. STUDIO_KNOT_CMS_PHASE_GUIDE.md
61. THOROUGH_VALIDATION_REPORT.md

예상 해제 용량: ~500KB
```

**유지 추천 파일 (21개 - 참고 가치 있음):**
- CLAUDE.md (프로젝트 규칙)
- SESSION_CHECKLIST.md (세션 체크리스트)
- PITFALLS.md (자주하는 실수)
- API_SPECIFICATION.md (API 명세)
- TYPES_REFERENCE.md (타입 참고)
- ARCHITECTURE_GUIDE.md (구조 가이드)
- PHASE_1_FINAL_COMPLETION_REPORT.md (최종 리포트)
- MIGRATION_REPORT_WORK_GALLERY.md (마이그레이션 기록)
- NEWS_API_FIX_REPORT.md (버그 픽스 기록)
- CURRENT_STATUS_AND_UPDATED_PLAN.md (현재 상태)
- PHASE_7_ENHANCEMENTS_MEMO.md (미래 계획)
- WORK_DATA_MAPPING.md (데이터 매핑)
- TASK_*_COMPLETION_REPORT.md (4개 - 작업 기록)
- QUICK_START.md (빠른 시작)
- LOCAL_DB_SETUP.md (DB 설정)
- DEPLOYMENT.md (배포 가이드)
- SETUP.md (설정)
- README.md (프로젝트 설명)
- PROJECT_SUMMARY.md (프로젝트 요약)

---

#### 1-2. 테스트 및 빌드 결과물
```
삭제 안전도: ⭐⭐⭐⭐⭐ (100% 안전)
크기: 약 9MB
```

**삭제 대상:**
- `playwright-report/` (4.6M) - 테스트 레포트
- `test-results/` (4.3M) - 테스트 결과
- `.playwright-mcp/` 폴더 (약 150개 파일) - 캡쳐 스크린샷

**예상 해제 용량: ~9MB**

---

#### 1-3. 낡은 스크린샷 이미지 (루트 레벨 .png)
```
삭제 안전도: ⭐⭐⭐⭐ (거의 안전)
크기: 약 100MB
개수: 132개 파일
```

**삭제 추천 (중복/보관된 내용):**
- `work-detail-*.png` (35개, 약 50MB) - 개발 중 비교용 스크린샷
- `admin-*.png` (10개, 약 5MB) - 관리자 페이지 임시 스크린샷
- `cms-*.png` (8개, 약 7MB) - CMS 모달 임시 스크린샷
- `curriculum-*.png` (6개, 약 2MB) - 교과과정 임시 스크린샷
- `professor-*.png` (5개, 약 1MB) - 교수 페이지 임시 스크린샷
- `about-*.png` (12개, 약 8MB) - About 페이지 임시 스크린샷
- 기타 임시 스크린샷 (55개, 약 20MB)

**예상 해제 용량: ~100MB**

---

#### 1-4. 임시 마이그레이션 스크립트 (루트 레벨)
```
삭제 안전도: ⭐⭐⭐ (번들링 검토 필수)
크기: ~50KB
```

**삭제 고려 (마이그레이션 완료됨):**
- `migrate-hero-section.mjs` - 완료
- `migrate-graduation-news.mjs` - 완료
- `finalize-studio-knot.mjs` - 완료
- `restore-studio-knot.mjs` - 완료
- `check-studio-knot.mjs` - 완료
- `check-all-projects.mjs` - 완료
- `check-blocks.js` - 완료
- `check-db.js` - 완료
- `test-tabs-fix.mjs` - 테스트용
- `test-work-tabs.mjs` - 테스트용
- `update_profiles.js` - 임시 스크립트

**권장사항:** `scripts/` 폴더로 이동 후 보관

**예상 해제 용량: ~50KB**

---

### **Category 2: 아카이빙 추천** 📦

#### 2-1. 2024 졸업전시회 폴더
```
크기: 7M
유형: 프로젝트별 콘텐츠
```

**현황:** DB에 저장되어 있으며, 향후 참고용으로만 필요
**권장사항:**
- `backups/graduation-exhibition-2026-02-14/` 폴더로 이동
- 또는 `.git/` 히스토리에 보관됨 (깃 커밋 참고)

**정리 방법:**
```bash
# 1. 폴더 이동 (보관)
mkdir -p backups/archived-content
mv "2024 시각영상디자인과 졸업전시회" backups/archived-content/

# 2. 또는 삭제 (DB에 이미 저장됨)
rm -rf "2024 시각영상디자인과 졸업전시회"
```

---

#### 2-2. knot 폴더 (작품 이미지)
```
크기: 30M
파일: 약 100+ 이미지 (스크린샷)
```

**현황:** Studio Knot 프로젝트 개발 중 캡쳐된 이미지들
**용도:** 개발 참고용, DB에 실제 이미지는 별도 저장

**권장사항:**
- `backups/development-assets/` 폴더로 이동
- 또는 `.git/` 히스토리 확인 후 삭제

---

#### 2-3. source 폴더 (교수진 사진)
```
크기: 8.2M
파일: 4-5개 고해상도 이미지
```

**현황:** 원본 교수진 사진 (public/images/people에 최적화 버전 저장)
**권장사항:**
- `backups/original-assets/` 폴더로 이동
- 또는 `.git/` 히스토리 보관

---

#### 2-4. Exhibition 폴더
```
크기: 6.6M
파일: 6개 이미지
```

**현황:** 전시 이미지 (public에 최적화 버전 저장)
**권장사항:**
- `backups/original-assets/` 폴더로 이동

---

### **Category 3: 유지해야 할 파일** ✅

#### 3-1. 필수 소스 코드
```
src/: 21M - 모든 프로젝트 코드
prisma/: 72K - DB 스키마
scripts/: 92K - 유틸리티 스크립트
public/: 83M - 공개 자산 (이미지, 폰트 등)
```

#### 3-2. 설정 파일
```
next.config.ts
tsconfig.json
package.json
package-lock.json
playwright.config.ts
postcss.config.mjs
eslint.config.mjs
```

#### 3-3. 참고 문서 (필수 유지)
```
CLAUDE.md - 프로젝트 규칙
SESSION_CHECKLIST.md - 세션 체크리스트
PITFALLS.md - 자주하는 실수
API_SPECIFICATION.md - API 명세
TYPES_REFERENCE.md - 타입 참고
ARCHITECTURE_GUIDE.md - 구조 가이드
README.md - 프로젝트 설명
```

---

## 🧹 정리 액션 플랜

### **Phase 1: 즉시 실행 (5분)**
```bash
# 1. 테스트 결과물 삭제 (9MB 절감)
rm -rf playwright-report/
rm -rf test-results/
rm -rf .playwright-mcp/

# 2. 임시 스크린샷 정리 (100MB 절감)
mkdir -p backups/screenshots
mv work-detail-*.png backups/screenshots/
mv admin-*.png backups/screenshots/
mv cms-*.png backups/screenshots/
mv curriculum-*.png backups/screenshots/
mv professor-*.png backups/screenshots/
mv about-*.png backups/screenshots/
mv (기타 불필요한 .png) backups/screenshots/

# 예상 절감: ~100MB
```

### **Phase 2: 안전 정리 (5분)**
```bash
# 1. 아카이브 폴더 생성
mkdir -p backups/archived-content
mkdir -p backups/original-assets
mkdir -p backups/old-docs

# 2. 콘텐츠 이동
mv "2024 시각영상디자인과 졸업전시회" backups/archived-content/
mv knot/ backups/original-assets/
mv source/ backups/original-assets/
mv Exhibition/ backups/original-assets/

# 예상 절감: ~50MB
```

### **Phase 3: 문서 정리 (3분)**
```bash
# 1. 임시 문서 이동
mkdir -p backups/old-docs

# 2. 아래 61개 파일 삭제 또는 이동
# (위 "삭제 가능" 목록 참고)
rm ABOUT_CMS_DIAGNOSIS.md
rm BLOCKS_GENERATION_GUIDE.md
... (총 61개)

# 또는 보관용으로 이동
mv ABOUT_CMS_DIAGNOSIS.md backups/old-docs/
... (총 61개)

# 예상 절감: ~500KB
```

### **Phase 4: 마이그레이션 스크립트 정리 (2분)**
```bash
# 1. scripts/ 폴더로 이동
mv migrate-hero-section.mjs scripts/archives/
mv migrate-graduation-news.mjs scripts/archives/
mv finalize-studio-knot.mjs scripts/archives/
... (기타 완료된 스크립트)

# 예상 절감: ~50KB
```

---

## 📊 정리 후 예상 결과

### 디스크 절감
```
Before:  ~230MB (node_modules 제외)
After:   ~80MB

절감율: 65% 감소 🎉
```

### 폴더 구조 (정리 후)
```
SMVD_page/
├── src/                          # 필수
├── public/                        # 필수
├── prisma/                        # 필수
├── scripts/                       # 필수
├── e2e/                          # 필수
├── .cursor/                      # 설정
├── .taskmaster/                  # 설정
├── node_modules/                 # 필수
├── backups/                      # 아카이브 (50MB)
│   ├── screenshots/              # 임시 스크린샷
│   ├── archived-content/         # 졸업전시회 등
│   ├── original-assets/          # 원본 이미지
│   ├── old-docs/                 # 임시 문서
│   └── (기존 백업)
├── CLAUDE.md                     # 필수
├── SESSION_CHECKLIST.md          # 필수
├── README.md                     # 필수
├── (기타 필수 문서 10개)
└── (설정 파일 8개)
```

---

## ⚠️ 주의사항

### 삭제 전 확인사항
- [ ] `.git` 히스토리에 모두 보관됨 (안전)
- [ ] 중요 파일은 `CLAUDE.md` 등에 문서화됨
- [ ] DB에 필요한 모든 콘텐츠가 저장됨

### 백업 전략
1. **최소 백업:** `backups/` 폴더에 만들기
2. **권장 백업:** 전체 프로젝트 zip으로 저장
3. **최고 안전:** Git 커밋 후 정리 진행

---

## 🚀 추천 실행 순서

1. **먼저:** Git에 현재 상태 커밋
   ```bash
   git add -A
   git commit -m "docs: Current project state before cleanup"
   ```

2. **다음:** Phase 1 실행 (테스트 결과물)
   ```bash
   rm -rf playwright-report test-results .playwright-mcp
   ```

3. **그 다음:** Phase 2 실행 (콘텐츠 아카이빙)
   ```bash
   mkdir -p backups/{archived-content,original-assets,old-docs}
   # 이동 명령어들...
   ```

4. **마지막:** Phase 3, 4 실행 (문서 정리)

5. **완료:** Git에 정리 커밋
   ```bash
   git add -A
   git commit -m "chore: Clean up project structure and remove temporary files"
   ```

---

## 📋 체크리스트

실행 전:
- [ ] Git에 현재 상태 커밋
- [ ] `backups/` 폴더 생성 확인
- [ ] 중요 문서 백업 (CLAUDE.md, SESSION_CHECKLIST.md 등)

정리 중:
- [ ] Phase 1: 테스트 결과물 삭제
- [ ] Phase 2: 콘텐츠 아카이빙
- [ ] Phase 3: 문서 정리
- [ ] Phase 4: 스크립트 정리

정리 후:
- [ ] 폴더 구조 확인
- [ ] 빌드 테스트 (`npm run build`)
- [ ] 개발 서버 테스트 (`npm run dev`)
- [ ] Git에 정리 커밋

---

**생성일:** 2026-02-17
**예상 효과:** 디스크 65% 절감, 프로젝트 구조 명확화
**실행 시간:** 15-20분
