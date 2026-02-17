# 🧹 프로젝트 정리 요약본 (1분 읽기)

## 📊 현재 상황
- **루트 파일 수:** ~400개
  - MD 문서: 82개
  - PNG 이미지: 132개
  - 테스트/빌드 결과: 9MB
- **디스크 사용:** ~230MB (node_modules 제외)

---

## ✅ 삭제 안전한 것들 (~~200MB 절감~~)

| 항목 | 크기 | 개수 | 안전도 |
|------|------|------|-------|
| playwright-report/ | 4.6M | 폴더 | ⭐⭐⭐⭐⭐ |
| test-results/ | 4.3M | 폴더 | ⭐⭐⭐⭐⭐ |
| .playwright-mcp/ | 2M+ | 150개 | ⭐⭐⭐⭐⭐ |
| 임시 스크린샷 (.png) | 100M | 132개 | ⭐⭐⭐⭐ |
| 개발 중 .md 문서 | 500KB | 61개 | ⭐⭐⭐⭐ |
| 마이그레이션 스크립트 | 50KB | 11개 | ⭐⭐⭐ |

---

## 📦 아카이빙 추천 (~~50MB~~)

| 항목 | 크기 | 권장사항 |
|------|------|---------|
| 2024 졸업전시회/ | 7M | backups/archived-content/ |
| knot/ | 30M | backups/original-assets/ |
| source/ | 8.2M | backups/original-assets/ |
| Exhibition/ | 6.6M | backups/original-assets/ |

---

## 유지할 것들 (필수)

- ✅ `src/` - 소스 코드 (21M)
- ✅ `public/` - 공개 이미지 (83M)
- ✅ `node_modules/` - 의존성 (624M)
- ✅ 중요 문서 (CLAUDE.md, SESSION_CHECKLIST.md 등 21개)
- ✅ 설정 파일 (next.config.ts, package.json 등)

---

## 🚀 실행 순서

### Step 1️⃣: 테스트 결과물 삭제 (9MB 절감)
```bash
rm -rf playwright-report test-results .playwright-mcp
```

### Step 2️⃣: 콘텐츠 아카이빙 (50MB 절감)
```bash
mkdir -p backups/{archived-content,original-assets}
mv "2024 시각영상디자인과 졸업전시회" backups/archived-content/
mv knot source Exhibition backups/original-assets/
```

### Step 3️⃣: 스크린샷 정리 (100MB 절감)
```bash
mkdir -p backups/screenshots
mv *.png backups/screenshots/ 2>/dev/null || true
```

### Step 4️⃣: 임시 문서 삭제 (500KB 절감)
```bash
# 아래 61개 파일 삭제 (또는 backups/old-docs/ 로 이동)
rm ABOUT_CMS_DIAGNOSIS.md BLOCKS_GENERATION_GUIDE.md ...
# (자세한 목록은 PROJECT_CLEANUP_REPORT.md 참고)
```

---

## 📈 예상 결과
```
Before: ~230MB
After:  ~80MB
절감:   65% 감소 ✨
```

---

## ⚠️ 안전성
- ✅ Git 히스토리에 모두 보관됨
- ✅ 삭제 전 커밋 필수
- ✅ 모든 중요 파일은 DB/코드에 저장됨

---

## 📖 자세한 내용
→ `PROJECT_CLEANUP_REPORT.md` 참고
