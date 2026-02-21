# Work 페이지 데이터 동기화 문제 완전 분석

**대상**: /work/9 (STUDIO KNOT) - 공개 페이지와 CMS 간 데이터 불일치
**분석일**: 2026-02-20
**상태**: 5가지 근본 문제 식별 완료

---

## 1. 현재 DB 상태 (work_projects 테이블, slug='9')

| 필드 | 값 | 비고 |
|------|---|------|
| id | cmlnhb27t0008gpdpryyqubgv | PK |
| slug | 9 | URL용 |
| title | STUDIO KNOT | |
| author | 노하린 | |
| email | havein6@gmail.com | |
| **description** | `{"blocks":[...], "version":"1.0", ...}` (2,348자) | **JSON 블록 데이터가 description에 저장됨** |
| **content** | `{"type":"doc", "content":[...], "_originalBlockContent":{...}}` (3,550자) | **Tiptap JSON + 원본 블록 백업** |
| hero_image | /uploads/2026/02/ee63d3fa3a912c20.webp | |
| thumbnail_image | /images/work/portfolio-3.png | |

### 핵심 발견:
- `description` 필드: 원래 **텍스트**여야 하는데, **구 BlockEditor JSON**이 저장되어 있음
- `content` 필드: **Tiptap JSON** 형식 (`{type:"doc", content:[...]}`) - 이미지 10개만 포함, 텍스트 없음
- 두 필드에 **서로 다른 형식**의 데이터가 중복 저장되어 있음

---

## 2. 데이터 흐름 추적

### 2-A. 공개 페이지 렌더링 흐름

```
[DB] WorkProject (slug='9')
  |
  v
[Server] /work/[id]/page.tsx (getProjectFromDB)
  |-- project.content = Tiptap JSON (type: "doc")
  |-- project.description = BlockEditor JSON (blocks array)
  |
  v
[Client] WorkDetailPage.tsx
  |-- isTiptapContent = true (content.type === 'doc')
  |-- => TiptapWorkDetailView로 분기
  |
  v
[Client] TiptapWorkDetailView.tsx
  |-- description 파라미터: BlockEditor JSON 문자열
  |-- validDescription 추출 시도:
  |     1. JSON.parse(description) => 성공 (블록 JSON이므로)
  |     2. parsed 에 'blocks' 존재 => textBlock 검색
  |     3. blocks.find(b => b.type === 'text' && b.content)
  |     4. textBlock.content = "STUDIO KNOT는 입지 않는 옷에..."
  |     5. validDescription = 텍스트 추출 성공!
  |
  v
[렌더링]
  좌측: title + author + email (DB 직접)
  우측: description 텍스트 (블록 JSON에서 추출)
  하단: Tiptap content (이미지만 10개)
```

**공개 페이지 결과**: description 텍스트가 블록 JSON에서 우회 추출되어 **표시는 됨**. 하지만 이것은 우연한 결과이며, 블록 JSON 구조가 바뀌면 깨질 수 있는 **취약한 경로**임.

### 2-B. CMS 모달 편집 흐름

```
[DB] WorkProject (slug='9')
  |
  v
[API] GET /api/admin/work/projects
  |-- 전체 프로젝트 목록 반환 (findMany)
  |-- 각 프로젝트에 description, content 모두 포함
  |
  v
[Hook] useWorkEditor.ts -> fetchProjects()
  |-- setProjects(data.data)
  |-- WorkProjectData 타입에 description: string 존재
  |
  v
[모달] WorkBlogModal.tsx
  |-- project.content -> Tiptap JSON -> setEditorContent()
  |-- project.description -> 기본정보 탭에 표시되지 않음! (*)
  |
  v
[기본정보 탭] WorkBasicInfoForm.tsx
  |-- title, subtitle, category, tags, author, email, year, thumbnailImage, published
  |-- *** description 필드 없음! ***
  |
  v
[콘텐츠 탭] TiptapEditor
  |-- editorContent = Tiptap JSON (이미지만 10개)
  |-- 텍스트 없음, description 텍스트 표시 안 됨
```

**CMS 결과**: 콘텐츠 탭에는 Tiptap content만 보이므로 **이미지만** 표시됨. description 텍스트는 어디에도 편집할 수 없음.

---

## 3. 식별된 5가지 동기화 문제

### 문제 1: description 필드에 JSON이 저장됨 (데이터 오염)

**현상**: `description` 컬럼(String 타입)에 BlockEditor JSON 객체가 문자열로 저장됨
**근본원인**: 이전 BlockEditor 시스템에서 description 필드를 콘텐츠 저장소로 사용했음. Tiptap 마이그레이션 시 description을 정리하지 않고 content만 Tiptap으로 변환함.

**영향**:
- Prisma 스키마: `description String @default("")` -- 일반 텍스트로 설계됨
- 실제 데이터: 2,348자 길이의 JSON 문자열
- 공개 페이지: JSON 파싱 후 텍스트 추출하는 우회 로직이 있어 작동하지만 취약

**파일 위치**:
- `/Users/jeonminjun/claude/SMVD_page/prisma/schema.prisma` (Line 216): `description String @default("")`
- DB 실제 값: `{"blocks":[...], "version":"1.0", ...}`

---

### 문제 2: CMS 기본정보 탭에 description 편집 필드 없음

**현상**: WorkBasicInfoForm에 description 입력 필드가 존재하지 않음
**근본원인**: CMS UI 설계 시 description을 콘텐츠 탭(BlockEditor)으로 관리하기로 했으나, Tiptap 전환 후 해당 데이터가 별도 필드로 분리되지 않음

**영향**:
- 관리자가 description 텍스트를 CMS에서 수정할 방법이 없음
- 새 프로젝트 생성 시 `description: ''`로 고정 전송됨 (WorkBlogModal Line 151)

**파일 위치**:
- `/Users/jeonminjun/claude/SMVD_page/src/components/admin/work/WorkBasicInfoForm.tsx`: description 관련 prop 없음
- `/Users/jeonminjun/claude/SMVD_page/src/components/admin/work/WorkBlogModal.tsx` (Line 151): `description: ''`

---

### 문제 3: content 필드에 텍스트 노드 없음 (Tiptap JSON 불완전)

**현상**: Tiptap content에 이미지 노드만 10개 있고, paragraph/text 노드가 없음
**근본원인**: BlockEditor -> Tiptap 마이그레이션 시 image 블록만 변환하고 text 블록과 work-title 블록을 Tiptap 노드로 변환하지 않음

**DB content 구조**:
```json
{
  "type": "doc",
  "content": [
    {"type": "image", "attrs": {"alt": "STUDIO KNOT Hero Image", "src": "..."}},
    {"type": "image", "attrs": {"alt": "", "src": "..."}},
    {"type": "image", "attrs": {"alt": "Gallery 1", "src": "..."}},
    // ... 이미지만 8개 더
  ],
  "_originalBlockContent": { /* 원본 블록 데이터 백업 */ }
}
```

**누락된 것**:
- paragraph 노드 (description 텍스트)
- heading 노드 (title 등)

**영향**:
- CMS 콘텐츠 탭: 이미지만 보임, 텍스트 편집 불가
- TiptapContentRenderer: 이미지만 렌더링

**파일 위치**:
- 마이그레이션 스크립트가 text 블록을 paragraph 노드로 변환하지 않은 것이 원인

---

### 문제 4: 저장 시 description이 빈 문자열로 덮어씌워질 위험

**현상**: WorkBlogModal의 handleSubmit에서 `description: ''`을 항상 전송
**근본원인**: description 필드를 "더 이상 사용하지 않음"으로 처리 (Line 151 주석: "No longer used")

**코드**:
```typescript
// WorkBlogModal.tsx Line 144-158
const data: CreateProjectInput = {
  title: title.trim(),
  subtitle: subtitle.trim(),
  category,
  tags: parsedTags,
  author: author.trim(),
  email: email.trim(),
  description: '', // No longer used (content is in Tiptap JSON)
  year,
  heroImage: thumbnailImage.trim(),
  thumbnailImage: thumbnailImage.trim(),
  galleryImages: [],
  published,
  content: editorContent, // Store Tiptap JSON directly
};
```

**영향**:
- 기존 프로젝트 수정 시 description의 BlockEditor JSON이 빈 문자열로 대체됨
- 이 시점에서 공개 페이지의 description 텍스트 추출도 깨짐
- UpdateProjectInput에 `description?: string` optional이므로 전송하면 업데이트됨

**파일 위치**:
- `/Users/jeonminjun/claude/SMVD_page/src/components/admin/work/WorkBlogModal.tsx` (Line 151)
- `/Users/jeonminjun/claude/SMVD_page/src/app/api/admin/work/projects/[id]/route.ts` (Line 91-94): `data: validation.data` -- description 포함 시 업데이트

---

### 문제 5: 이중 데이터 소스 (description vs content) 간 동기화 메커니즘 없음

**현상**: 같은 정보(텍스트, 이미지 URL 등)가 description과 content 두 곳에 저장되나 동기화 없음
**근본원인**: BlockEditor에서 Tiptap으로 전환하면서 데이터 구조가 이중화됨

**데이터 중복 현황** (work/9):

| 데이터 | description (BlockEditor) | content (Tiptap) |
|--------|--------------------------|------------------|
| Hero 이미지 | blocks[0] hero-image | content[0] image |
| Title/Author | blocks[1] work-title | 없음 (DB 필드에서 직접) |
| 설명 텍스트 | blocks[2] text | 없음 |
| 갤러리 이미지 | blocks[3] image-grid (9개) | content[1-9] image (9개) |

**영향**:
- CMS에서 Tiptap 콘텐츠를 수정해도 description의 블록 데이터는 업데이트되지 않음
- description의 블록 데이터를 수정할 UI가 없음
- 공개 페이지는 content(Tiptap)로 분기하므로, Tiptap에 없는 텍스트를 description에서 추출하는 이중 경로 발생

**파일 위치**:
- `/Users/jeonminjun/claude/SMVD_page/src/components/public/work/WorkDetailPage.tsx` (Line 19-40): Tiptap 분기 로직
- `/Users/jeonminjun/claude/SMVD_page/src/components/public/work/TiptapWorkDetailView.tsx` (Line 47-68): description JSON 파싱 로직

---

## 4. 전체 데이터 흐름 다이어그램

```
                      +-----------+
                      |   DB      |
                      | (Prisma)  |
                      +-----+-----+
                            |
               +------------+------------+
               |                         |
        description                   content
        (BlockEditor JSON)         (Tiptap JSON)
        2,348 bytes                3,550 bytes
               |                         |
               |    +---공개 페이지---+    |
               |    |                |    |
               v    v                v    v
        +-----------+         +----------+
        |WorkDetail |         |WorkDetail|
        |Page.tsx   |-------->|Page.tsx  |
        |           |   if    |          |
        | BlockPath | Tiptap  |TiptapPath|
        +-----------+         +----------+
               |                    |
               v                    v
     WorkDetailContent    TiptapWorkDetailView
     (description에서        (content에서 이미지,
      블록 파싱)             description에서 텍스트 추출)


                +---CMS 모달---+
                |              |
          기본정보 탭      콘텐츠 탭
          (description     (TiptapEditor)
           없음!)            |
                             v
                       content만 저장
                    description: '' 전송
```

---

## 5. 해결 방안

### 방안 A: description 필드를 순수 텍스트로 정규화 (권장)

**개념**: description에 저장된 BlockEditor JSON에서 텍스트만 추출하여 순수 텍스트로 변환. CMS 기본정보 탭에 description 편집 필드 추가.

**단계**:

**5-A-1. DB 마이그레이션 스크립트: description 정규화**
```typescript
// scripts/normalize-description.ts
import { prisma } from '../src/lib/db';

async function main() {
  const projects = await prisma.workProject.findMany();

  for (const project of projects) {
    let cleanDescription = project.description;

    try {
      const parsed = JSON.parse(project.description);
      if (parsed?.blocks && Array.isArray(parsed.blocks)) {
        // BlockEditor JSON에서 텍스트 블록 추출
        const textBlocks = parsed.blocks
          .filter((b: any) => b.type === 'text' && b.content)
          .map((b: any) => b.content);
        cleanDescription = textBlocks.join('\n\n') || '';
      }
    } catch {
      // JSON이 아니면 그대로 유지 (이미 텍스트)
    }

    await prisma.workProject.update({
      where: { id: project.id },
      data: { description: cleanDescription },
    });

    console.log(`${project.slug}: "${cleanDescription.substring(0, 50)}..."`);
  }
}

main();
```

**5-A-2. CMS 기본정보 탭에 description 필드 추가**

WorkBasicInfoForm.tsx에 추가:
```tsx
{/* Description */}
<div>
  <label htmlFor="wb-description" className="block text-sm font-medium text-gray-700 mb-1">
    프로젝트 설명
  </label>
  <textarea
    id="wb-description"
    value={description}
    onChange={(e) => onDescriptionChange(e.target.value)}
    placeholder="프로젝트에 대한 간단한 설명을 입력하세요..."
    rows={4}
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-vertical"
  />
</div>
```

WorkBlogModal.tsx 수정:
```typescript
// State 추가
const [description, setDescription] = useState('');

// useEffect에서 초기화
if (project) {
  setDescription(project.description || '');
}

// handleSubmit에서 전송
description: description.trim(),
```

**5-A-3. Tiptap content에 paragraph 노드 추가 (선택)**
content 필드에도 description 텍스트를 paragraph 노드로 포함하면, TiptapWorkDetailView에서 description prop에 의존하지 않아도 됨.

**5-A-4. TiptapWorkDetailView 단순화**
description이 순수 텍스트가 되면 JSON 파싱 로직 제거 가능:
```typescript
// 현재 (복잡한 JSON 파싱)
let validDescription: string | null = null;
if (typeof description === 'string' && description.trim()) {
  try {
    const parsed = JSON.parse(description);
    // ... 복잡한 분기 ...
  } catch {
    validDescription = description;
  }
}

// 개선 (단순)
const validDescription = description?.trim() || null;
```

---

### 방안 B: description 필드 폐기, content(Tiptap)에 통합

**개념**: description 필드를 더 이상 사용하지 않고, 모든 콘텐츠를 Tiptap JSON content에 통합. description 텍스트도 paragraph 노드로 content에 포함.

**단계**:
1. Tiptap content에 heading + paragraph 노드 추가 (마이그레이션)
2. TiptapWorkDetailView에서 description prop 제거
3. Tiptap content에서 첫 paragraph를 우측 컬럼으로 렌더링
4. WorkBlogModal에서 description 전송 중단 (현재와 동일)

**장점**: 단일 데이터 소스
**단점**: Tiptap 에디터에서 "우측 컬럼 description"을 별도로 관리하기 어려움

---

### 방안 C: 하이브리드 (권장 최종안)

**description = 기본정보 탭에서 관리하는 순수 텍스트**
**content = Tiptap 에디터에서 관리하는 리치 콘텐츠 (이미지 + 추가 텍스트)**

이 방식이 현재 아키텍처와 가장 잘 맞음:
- description: 공개 페이지 우측 컬럼에 표시되는 프로젝트 소개 텍스트
- content: 하단에 표시되는 Tiptap 리치 콘텐츠 (이미지, 추가 설명 등)

---

## 6. 즉시 수정이 필요한 파일 목록

| 우선순위 | 파일 | 수정 내용 |
|---------|------|----------|
| P0 | `scripts/normalize-description.ts` (신규) | description JSON -> 텍스트 마이그레이션 |
| P0 | `WorkBlogModal.tsx` | description state 추가, 기본정보 탭에 전달 |
| P0 | `WorkBasicInfoForm.tsx` | description textarea 추가 |
| P1 | `TiptapWorkDetailView.tsx` | description JSON 파싱 로직 단순화 |
| P1 | `WorkDetailPage.tsx` | description JSON 파싱 로직 단순화 |
| P2 | Tiptap content 마이그레이션 | paragraph 노드 추가 (선택) |

---

## 7. 요약

| 항목 | 현재 상태 | 문제 |
|------|----------|------|
| DB description | BlockEditor JSON (2,348자) | 텍스트 필드에 JSON 저장 |
| DB content | Tiptap JSON (이미지만) | 텍스트 노드 없음 |
| CMS 기본정보 탭 | description 필드 없음 | 편집 불가 |
| CMS 콘텐츠 탭 | Tiptap 에디터 (이미지만) | 텍스트 표시 안 됨 |
| 저장 시 description | `''` 고정 전송 | 기존 데이터 파괴 위험 |
| 공개 페이지 | JSON에서 텍스트 우회 추출 | 작동하지만 취약 |

**핵심 결론**: /work/9의 description 텍스트("STUDIO KNOT는 입지 않는 옷에...")는 DB의 description 필드 안에 BlockEditor JSON으로 묻혀 있으며, content(Tiptap)에는 포함되지 않았습니다. CMS에서 이 텍스트를 편집할 방법이 없고, 프로젝트를 저장하면 빈 문자열로 덮어씌워질 위험이 있습니다.
