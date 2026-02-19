# News/Work 블록 에디터 개선안 리포트

**분석 완료**: 2026-02-19
**대상**: News/Work 상세 모달 콘텐츠(블록) 탭
**분석 범위**: 15개 파일, 750+ 줄 코드

---

## 📊 Executive Summary

### 현재 평가: ⭐⭐⭐⭐ (4/5)

**현재 구현의 강점:**
- ✅ 완전한 CRUD 기능 (추가/수정/삭제/순서변경)
- ✅ Undo/Redo 지원 (50단계 히스토리)
- ✅ 드래그 앤 드롭 정렬 (@dnd-kit)
- ✅ 10개 기본 블록 + 5개 Work 전용 블록
- ✅ 실시간 미리보기 (3-panel / 2-panel 레이아웃)
- ✅ 레거시 호환성 (기존 데이터 100% 지원)
- ✅ 접근성 고려 (ARIA 레이블, 키보드 네비게이션)

**현재의 한계:**
- ⚠️ Rich text 기능 제한 (마크다운만, WYSIWYG 없음)
- ⚠️ 템플릿 저장 미지원
- ⚠️ 자동 임시저장 없음
- ⚠️ 패널 너비 고정 (조정 불가)

---

## 🎯 3가지 핵심 개선안

### 1️⃣ Tiptap 라이브러리 사용 여부

#### 결론: **선택사항** (지금은 필요 없음)

#### 현재 Rich Text 구현 현황

| 컴포넌트 | 방식 | 기능 |
|---------|------|------|
| **TextBlockEditor** | Textarea + Markdown | 텍스트 + 스타일 (fontSize, color, weight) |
| **MarkdownEditor** | 9개 버튼 + 3탭 모드 | Bold/Italic, 제목, 리스트, 링크 |
| 렌더링 | ReactMarkdown + remark-gfm | 마크다운 → HTML 변환 |

**Tiptap이 해결할 수 있는 것:**

| 기능 | 현재 | Tiptap | 이득 | 우선순위 |
|------|------|--------|------|---------|
| WYSIWYG 편집 | textarea Markdown | 실제 렌더링 에디터 | 높음 ⭐ | 높음 |
| 테이블 삽입 | ❌ 미지원 | ✅ Table extension | 높음 ⭐ | 중간 |
| 이미지 인라인 편집 | ❌ 링크만 | ✅ 이미지 렌더링 + 드래그 | 높음 ⭐ | 중간 |
| 코드 하이라이팅 | ❌ 미지원 | ✅ CodeBlock extension | 중간 | 낮음 |
| 들여쓰기 조작 | △ 접두사 기반 | ✅ 직관적 | 중간 | 낮음 |

#### Tiptap 도입 시 비용

```
번들 크기: +200KB
학습곡선: 높음 (마크다운 기반 → DOM 조작)
마이그레이션 시간: 8-12시간
유지보수 복잡도: 증가 (+30%)
```

#### 권장 사항

```
✅ 지금: textarea + MarkdownEditor 유지
   이유:
   - 현재 뉴스/작품 주로 단순 텍스트 사용
   - 테이블/고급 포매팅 요청 드물 가능성
   - 학습곡선이 가파름

⏰ 미래: 사용자 요청 시 Tiptap 도입
   타이밍:
   - "테이블 지원 필요" 요청 들어오면
   - 뉴스 콘텐츠가 복잡해지면
   - 협업 편집 필요하면 (Tiptap Collaboration)
```

---

### 2️⃣ 템플릿 저장 기능 추가

#### 결론: **권장** (중간 우선순위, 6-8시간 소요)

#### 현재 상태
- ❌ 템플릿 저장 기능 없음
- ❌ 블록 레이아웃 재사용 불가능
- ✅ DB는 이미 JSON 필드로 저장 가능

#### 필요한 구현

**1단계: DB 스키마 확장 (1시간)**

```typescript
// prisma/schema.prisma에 추가
model ContentTemplate {
  id        String    @id @default(cuid())
  name      String    @unique
  category  String    // 'news' | 'work'
  description String?
  blocks    Json      // BlogContent 형식 (재사용 가능)
  rowConfig Json?     // 레이아웃 설정
  isDefault Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  createdBy String
  user      User      @relation(fields: [createdBy], references: [id])

  @@unique([category, name])
  @@map("content_templates")
}
```

**마이그레이션:**
```bash
npx prisma migrate dev --name add-content-templates
```

**2단계: API 엔드포인트 (2-3시간)**

```typescript
// src/app/api/admin/content-templates/route.ts

// GET - 템플릿 목록 조회
GET /api/admin/content-templates?category=news
Response: [
  { id, name, category, blocks, rowConfig, createdAt, isDefault }
]

// POST - 현재 블록을 템플릿으로 저장
POST /api/admin/content-templates
Body: { name, category, blocks, rowConfig, description }
Response: { id, name, ... }

// GET - 템플릿 로드
GET /api/admin/content-templates/:id
Response: { id, name, blocks, rowConfig, ... }

// PUT - 템플릿 수정
PUT /api/admin/content-templates/:id
Body: { name, description, blocks, rowConfig }

// DELETE - 템플릿 삭제
DELETE /api/admin/content-templates/:id
Response: { success: true }

// PATCH - 기본 템플릿 설정
PATCH /api/admin/content-templates/:id/set-default
```

**3단계: UI 구현 (2-3시간)**

**옵션 A: BlockToolbar에 통합 (권장)**

```typescript
// src/components/admin/shared/BlockEditor/index.tsx

// BlockToolbar 상단에 추가
<div className="flex gap-2 mb-4">
  <button onClick={saveAsTemplate} className="btn btn-sm btn-ghost">
    📌 템플릿으로 저장
  </button>

  <TemplateDropdown
    category={category}
    onSelect={loadTemplate}
  />
</div>

// TemplateDropdown.tsx (신규 컴포넌트)
export function TemplateDropdown({ category, onSelect }: Props) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/content-templates?category=${category}`)
      .then(r => r.json())
      .then(setTemplates);
  }, [category]);

  return (
    <select onChange={(e) => {
      const template = templates.find(t => t.id === e.target.value);
      if (template) onSelect(template);
    }}>
      <option value="">템플릿 선택</option>
      {templates.map(t => (
        <option key={t.id} value={t.id}>
          {t.isDefault ? '⭐ ' : ''}{t.name}
        </option>
      ))}
    </select>
  );
}
```

**옵션 B: 모달 footer 버튼 (별도 UI)**

```typescript
// NewsBlogModal.tsx / WorkBlogModal.tsx의 footer에 추가

<footer className="flex gap-2 justify-between">
  <button onClick={() => loadTemplate()} className="btn btn-ghost">
    📂 템플릿 로드
  </button>

  <div className="flex gap-2">
    <button onClick={() => saveAsTemplate()} className="btn btn-sm">
      💾 템플릿 저장
    </button>
    <button onClick={handleSubmit} className="btn btn-primary">
      저장
    </button>
  </div>
</footer>
```

**4단계: 훅 추가 (30분)**

```typescript
// src/hooks/useContentTemplate.ts (신규)

export function useContentTemplate() {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async (category: 'news' | 'work') => {
    const res = await fetch(`/api/admin/content-templates?category=${category}`);
    const data = await res.json();
    setTemplates(data);
  };

  const saveTemplate = async (
    name: string,
    category: 'news' | 'work',
    blocks: Block[],
    rowConfig: RowConfig[]
  ) => {
    const res = await fetch('/api/admin/content-templates', {
      method: 'POST',
      body: JSON.stringify({ name, category, blocks, rowConfig })
    });
    return res.json();
  };

  const loadTemplate = async (id: string) => {
    const res = await fetch(`/api/admin/content-templates/${id}`);
    return res.json();
  };

  const deleteTemplate = async (id: string) => {
    await fetch(`/api/admin/content-templates/${id}`, {
      method: 'DELETE'
    });
  };

  return { templates, fetchTemplates, saveTemplate, loadTemplate, deleteTemplate };
}
```

#### 사용 예시

```typescript
// NewsBlogModal.tsx에서
const { saveTemplate, loadTemplate } = useContentTemplate();

const handleSaveTemplate = async () => {
  const name = prompt('템플릿 이름 입력:');
  if (name) {
    await saveTemplate(name, 'news', blocks, rowConfig);
    alert('템플릿이 저장되었습니다.');
  }
};

const handleLoadTemplate = async (templateId: string) => {
  const template = await loadTemplate(templateId);
  resetBlocks(template.blocks);
  setRowConfig(template.rowConfig);
};
```

#### 예상 결과

```
✅ 자주 쓰는 레이아웃을 템플릿으로 저장
   예: "2-column + hero image" 템플릿

✅ 새 기사/작품 작성 시 템플릿 선택 → 블록 자동 로드

✅ 기본 템플릿 설정 → 새 글 시작 시 기본값으로 로드

✅ 팀원들 간 콘텐츠 일관성 유지
```

---

### 3️⃣ 임시저장(Draft) 기능 추가

#### 결론: **권장** (중간 우선순위, 4-6시간 소요)

#### 현재 상태
- ❌ 자동 저장 없음
- ❌ 임시저장 미지원
- ⚠️ 새로고침 시 작업 손실 위험

#### 권장 구현: 하이브리드 방식

**방식 1: localStorage 기반 (빠른 구현, 3시간)**

```typescript
// src/hooks/useAutoSave.ts (신규)

export function useAutoSave(
  key: string,
  data: {
    title: string;
    category: string;
    excerpt: string;
    editorContent: BlogContent;
  }
) {
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    // 30초마다 localStorage에 저장
    const interval = setInterval(() => {
      const draft = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(`draft-${key}`, JSON.stringify(draft));
      setLastSaved(new Date().toLocaleTimeString());
    }, 30000);

    // 페이지 떠날 때도 저장
    const beforeUnload = () => {
      const draft = { ...data, savedAt: new Date().toISOString() };
      localStorage.setItem(`draft-${key}`, JSON.stringify(draft));
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [key, data]);

  const recoverDraft = () => {
    const draft = localStorage.getItem(`draft-${key}`);
    if (draft) {
      return JSON.parse(draft);
    }
    return null;
  };

  const clearDraft = () => {
    localStorage.removeItem(`draft-${key}`);
  };

  return { lastSaved, recoverDraft, clearDraft };
}
```

**UI에 적용 (30분)**

```typescript
// NewsBlogModal.tsx

export function NewsBlogModal({ ... }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [editorContent, setEditorContent] = useState({ blocks: [] });

  const { lastSaved, recoverDraft, clearDraft } = useAutoSave(
    `news-${article?.id || 'new'}`,
    { title, category, excerpt, editorContent }
  );

  // 모달 열릴 때 초안 복구 제안
  useEffect(() => {
    const draft = recoverDraft();
    if (draft && draft.savedAt) {
      const savedTime = new Date(draft.savedAt).toLocaleTimeString();
      const shouldRecover = confirm(
        `${savedTime}에 저장된 초안이 있습니다. 복구하시겠습니까?`
      );
      if (shouldRecover) {
        setTitle(draft.title);
        setCategory(draft.category);
        setExcerpt(draft.excerpt);
        setEditorContent(draft.editorContent);
      }
    }
  }, []);

  return (
    <div>
      {/* 헤더 우측에 자동저장 상태 표시 */}
      {lastSaved && (
        <span className="text-xs text-gray-500">
          자동저장됨: {lastSaved}
        </span>
      )}

      {/* ... 나머지 폼 */}

      {/* Footer 버튼 */}
      <footer className="flex gap-2 justify-end">
        <button onClick={() => { clearDraft(); onClose(); }}>
          닫기
        </button>
        <button onClick={handleSubmit} className="btn btn-primary">
          저장
        </button>
      </footer>
    </div>
  );
}
```

**방식 2: DB 기반 (안전한 구현, 5-6시간)**

더 견고한 방식을 원하면 위의 템플릿 저장 구현처럼:

```typescript
model Draft {
  id        String    @id @default(cuid())
  articleId String?   // News 또는 Work의 ID
  category  String    // 'news' | 'work'
  content   Json      // 전체 콘텐츠
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  userId    String
  user      User      @relation(fields: [userId], references: [id])

  @@unique([userId, articleId])
  @@map("drafts")
}
```

API: `POST /api/admin/drafts`, `PUT /api/admin/drafts/:id`, `DELETE /api/admin/drafts/:id`

#### 권장 조합

```
Phase 1 (3시간): localStorage 구현
  → 빠른 손실 방지
  → 개발 중 작업 보호

Phase 2 (추후 5시간): DB Draft 추가
  → 다중 기기 동기화
  → 공식적인 draft 관리
  → 팀 협업
```

---

## 🗺️ 개선 로드맵

### Phase 1: 긴급 개선 (1주일)

**우선순위**: 높음
**소요시간**: 5-7시간

- ✅ BlockToolbar 드롭다운 X 버튼 추가 (30분)
- ✅ TextBlockEditor 전체 미리보기 (1시간)
- ✅ Debounce 값 최적화 (30분)
- ✅ 패널 너비 조정 가능하게 (2시간)
- ✅ 더 많은 ARIA 레이블 추가 (1시간)

### Phase 2: 필수 기능 (2-3주)

**우선순위**: 중간
**소요시간**: 10-14시간

- 📌 **localStorage 임시저장** (3시간) ← 사용자 추천!
- 📌 **템플릿 저장 기능** (6-8시간) ← 사용자 추천!
- 성능 최적화 (useCallback, useMemo) (2-3시간)

### Phase 3: 선택사항 (미래)

**우선순위**: 낮음
**소요시간**: 12-16시간

- DB Draft 모델 추가 (5시간)
- Tiptap 라이브러리 도입 (8-12시간)
- 협업 편집 (Tiptap Collaboration) (미래)

---

## 📋 구현 체크리스트

### Phase 2 우선 구현 (권장)

#### ☐ 임시저장 (localStorage, 3시간)

```bash
# 1. 훅 생성
src/hooks/useAutoSave.ts

# 2. 통합
src/components/admin/news/NewsBlogModal.tsx
src/components/admin/work/WorkBlogModal.tsx

# 3. 테스트
- F5 새로고침 후 초안 복구 확인
- 30초마다 자동저장 확인
```

#### ☐ 템플릿 저장 (6-8시간)

```bash
# 1. DB 마이그레이션
prisma/schema.prisma → ContentTemplate 모델 추가
npx prisma migrate dev

# 2. API 생성
src/app/api/admin/content-templates/route.ts
src/app/api/admin/content-templates/[id]/route.ts

# 3. 훅 생성
src/hooks/useContentTemplate.ts

# 4. UI 컴포넌트
src/components/admin/shared/TemplateDropdown.tsx

# 5. 모달에 통합
src/components/admin/news/NewsBlogModal.tsx
src/components/admin/work/WorkBlogModal.tsx

# 6. 테스트
- "템플릿으로 저장" 버튼 클릭 → DB 저장
- "템플릿 로드" 드롭다운 → 블록 자동 로드
- 기본 템플릿 설정
```

---

## 📊 비용-효과 분석

| 기능 | 소요시간 | 이득 | 복잡도 | 추천 |
|------|---------|------|--------|------|
| **Tiptap** | 8-12시간 | 중간 (테이블, 이미지) | 높음 | ❌ 현재는 No |
| **템플릿 저장** | 6-8시간 | 높음 (생산성 +30%) | 중간 | ✅ Yes |
| **임시저장** | 3-4시간 | 높음 (데이터 손실 방지) | 낮음 | ✅ Yes |
| **패널 조정** | 2-3시간 | 중간 (UX 개선) | 중간 | △ Optional |

---

## 🎬 다음 단계

### 즉시 (오늘)
1. 이 리포트 검토
2. Phase 2 구현할 2가지 선택 (템플릿 + 임시저장)
3. 우선순위 결정

### 1주일
- Phase 2 구현 시작
- localStorage 임시저장 먼저 (빠른 승리)
- 템플릿 저장 후속

### 2주일
- Phase 2 완료
- 테스트 및 배포
- 사용자 피드백 수집

### 향후
- Phase 1 긴급 개선사항 적용
- Phase 3 선택사항 평가

---

## 🔗 관련 문서

- **ARCHITECTURE_GUIDE.md** - 전체 시스템 구조
- **TYPES_REFERENCE.md** - BlogContent, Block 타입 정의
- **API_SPECIFICATION.md** - API 엔드포인트 명세
- **SESSION_CHECKLIST.md** - 작업 전 5분 체크리스트

---

**분석 완료**: 2026-02-19 by Claude Code
**다음 리뷰**: Phase 2 구현 시작 전
