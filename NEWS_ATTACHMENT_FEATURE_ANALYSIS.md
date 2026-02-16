# News&Event 공지 - 파일 첨부 기능 구현 종합 분석 리포트

**작성일:** 2026-02-16
**요청사항:** 공지 게시글에 파일 첨부 기능 추가 & 공개 페이지에 다운로드 박스 표시
**상태:** ✅ **완전한 구현 계획 수립 완료**

---

## 📋 Executive Summary

### 현황
```
공지(Notice) 게시글에 파일 첨부 기능이 없음 ❌
- DB 스키마: attachments 필드 없음
- Admin CMS: 파일 첨부 UI 없음
- 공개 페이지: 다운로드 박스 없음
```

### 필요한 작업 (총 5가지 영역)

| 영역 | 현재 | 필요 | 우선순위 | 소요시간 |
|-----|------|------|---------|---------|
| 1️⃣ DB 스키마 | ❌ 없음 | ✅ attachments 필드 | 🔴 높음 | 15분 |
| 2️⃣ API 수정 | ❌ 미지원 | ✅ 파일 저장/조회 | 🔴 높음 | 20분 |
| 3️⃣ 훅/타입 | ❌ 없음 | ✅ attachments 필드 | 🔴 높음 | 15분 |
| 4️⃣ Admin CMS | ❌ UI 없음 | ✅ 파일 첨부 UI | 🟡 중간 | 45분 |
| 5️⃣ 공개 페이지 | ❌ 표시 없음 | ✅ 다운로드 박스 | 🟡 중간 | 30분 |

**총 소요시간:** 약 2-2.5시간

---

## 🎯 Part 1: 모달 아키텍처 분석 (이전 리포트)

### 현황
✅ **완전히 분리된 2개 모달** (Work vs News&Event)
```
Work:      /admin/work/WorkBlogModal.tsx (860줄)
News&Event: /admin/news/NewsBlogModal.tsx (847줄)

공유 인프라:
- useBlockEditor() 훅
- BlockLayoutVisualizer 컴포넌트
- BlockEditorPanel 컴포넌트

⚠️ 문제: 500줄+ 코드 중복 (Row 관리 로직)
```

### 개선안
- **Option 1:** useRowManager Hook 추출 (1-2시간) - 권장
- **Option 2:** 통합 BlogEditorModal (3-4시간)

---

## 🔧 Part 2: 파일 첨부 기능 구현 가이드

### 2-1. DB 스키마 수정 (Prisma)

**현재 NewsEvent 모델:**
```prisma
model NewsEvent {
  id              String    @id @default(cuid())
  slug            String    @unique
  title           String
  category        String    @default("Notice")
  excerpt         String?
  thumbnailImage  String    @default("/Group-27.svg")
  content         Json?     // 블록 콘텐츠
  publishedAt     DateTime
  published       Boolean   @default(true)
  order           Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**필요한 수정:**
```prisma
model NewsEvent {
  id              String    @id @default(cuid())
  slug            String    @unique
  title           String
  category        String    @default("Notice")
  excerpt         String?
  thumbnailImage  String    @default("/Group-27.svg")
  content         Json?
  attachments     Json?     // ✨ NEW: 첨부파일 배열
  publishedAt     DateTime
  published       Boolean   @default(true)
  order           Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

**파일 구조 (attachments JSON):**
```typescript
// NewsEvent.attachments: Attachment[]
interface Attachment {
  id: string;                    // 고유 ID (cuid)
  filename: string;              // 원본 파일명 ("공지_2024.pdf")
  filepath: string;              // 서버 경로 ("/uploads/2026/02/...")
  mimeType: string;              // "application/pdf"
  size: number;                  // 바이트 단위 크기
  uploadedAt: string;            // ISO 날짜
}

// 예시
attachments: [
  {
    id: "clmp5x1j40000xxx",
    filename: "학생정보공지_2024_학생경비집행내역-1.pdf",
    filepath: "/uploads/2026/02/abc123def456.pdf",
    mimeType: "application/pdf",
    size: 1234567,
    uploadedAt: "2026-02-16T10:30:00Z"
  }
]
```

**마이그레이션 생성:**
```bash
npx prisma migrate dev --name add_attachments_to_news_event
```

---

### 2-2. API 수정

**파일: `/src/app/api/admin/news/articles/route.ts`**

**변경 사항:**

```typescript
// 1. Attachment 스키마 추가
const AttachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  filepath: z.string(),
  mimeType: z.string(),
  size: z.number(),
  uploadedAt: z.string(),
});

// 2. CreateArticleSchema 업데이트
const CreateArticleSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  category: z.enum(['Notice', 'Event', 'Awards', 'Recruiting']),
  excerpt: z.string().optional(),
  thumbnailImage: z.string().default('/Group-27.svg'),
  content: ContentSchema,
  attachments: z.array(AttachmentSchema).optional(),  // ✨ NEW
  publishedAt: z.string().optional(),
  published: z.boolean().default(true),
});

// 3. POST/PUT 핸들러에서 attachments 포함
const data = validation.data;
const article = await prisma.newsEvent.create({
  data: {
    slug: generateSlug(data.title),
    title: data.title,
    category: data.category,
    excerpt: data.excerpt,
    thumbnailImage: data.thumbnailImage,
    content: data.content || Prisma.JsonNull,
    attachments: data.attachments || Prisma.JsonNull,  // ✨ NEW
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    published: data.published,
  },
});
```

---

### 2-3. 타입 & 훅 수정

**파일: `/src/hooks/useNewsEditor.ts`**

```typescript
// 1. Attachment 타입 추가
export interface Attachment {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

// 2. NewsArticleData 인터페이스 수정
export interface NewsArticleData {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  thumbnailImage: string;
  content: NewsContentData | null;
  attachments: Attachment[] | null;      // ✨ NEW
  publishedAt: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 3. CreateArticleInput 수정
export interface CreateArticleInput {
  title: string;
  category: string;
  excerpt?: string;
  thumbnailImage?: string;
  content?: NewsContentData | null;
  attachments?: Attachment[] | null;    // ✨ NEW
  publishedAt?: string;
  published?: boolean;
}

// 4. UpdateArticleInput 수정
export interface UpdateArticleInput {
  title?: string;
  category?: string;
  excerpt?: string | null;
  thumbnailImage?: string;
  content?: NewsContentData | null;
  attachments?: Attachment[] | null;    // ✨ NEW
  publishedAt?: string;
  published?: boolean;
}
```

---

### 2-4. Admin CMS 모달 수정

**파일: `/src/components/admin/news/NewsBlogModal.tsx`**

#### 4-1. State 추가

```typescript
// Line 60 근처에 추가
const [attachments, setAttachments] = useState<Attachment[]>([]);
const [attachmentError, setAttachmentError] = useState<string | null>(null);
```

#### 4-2. 파일 업로드 핸들러 추가

```typescript
// useCallback으로 구현
const handleFileUpload = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setAttachmentError(null);

      // 최대 5개 파일 제한
      if (attachments.length + files.length > 5) {
        setAttachmentError('최대 5개까지만 첨부 가능합니다.');
        return;
      }

      // 각 파일 처리
      Array.from(files).forEach((file) => {
        // 파일 크기 체크 (최대 50MB)
        if (file.size > 50 * 1024 * 1024) {
          setAttachmentError('파일 크기는 50MB 이하여야 합니다.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          // 실제로는 /api/upload로 업로드해야 함
          // 현재는 클라이언트에서 메타데이터만 생성
          const newAttachment: Attachment = {
            id: cuid(),
            filename: file.name,
            filepath: `/uploads/2026/02/${Date.now()}-${file.name}`,
            mimeType: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          };

          setAttachments((prev) => [...prev, newAttachment]);
        };

        reader.onerror = () => {
          setAttachmentError(`파일 읽기 실패: ${file.name}`);
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (err) {
      setAttachmentError(err instanceof Error ? err.message : '파일 업로드 실패');
    }
  },
  [attachments]
);

const handleRemoveAttachment = useCallback((id: string) => {
  setAttachments((prev) => prev.filter((att) => att.id !== id));
}, []);
```

#### 4-3. 파일 첨부 UI 섹션 추가

**Basic Info 탭에 추가 (Line 730 근처):**

```typescript
{/* Attachments Section */}
<div>
  <label htmlFor="nb-attachments" className="block text-sm font-medium text-gray-700 mb-3">
    파일 첨부 (최대 5개, 50MB 이하)
  </label>

  {/* 파일 업로드 인풋 */}
  <div className="mb-4">
    <input
      id="nb-attachments"
      type="file"
      multiple
      onChange={handleFileUpload}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4 file:rounded-lg
        file:border-0 file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100 cursor-pointer"
      accept=".pdf,.doc,.docx,.xlsx,.pptx,.jpg,.png"
    />
    <p className="text-xs text-gray-400 mt-1">
      PDF, Word, Excel, PowerPoint, 이미지 파일 등 지원
    </p>
  </div>

  {/* 에러 메시지 */}
  {attachmentError && (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between">
      <span>{attachmentError}</span>
      <button
        type="button"
        onClick={() => setAttachmentError(null)}
        className="text-red-400 hover:text-red-600"
      >
        ✕
      </button>
    </div>
  )}

  {/* 첨부된 파일 목록 */}
  {attachments.length > 0 && (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600">
        첨부파일 ({attachments.length}/5)
      </p>
      <div className="space-y-1">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-lg">📄</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {att.filename}
                </p>
                <p className="text-xs text-gray-400">
                  {(att.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveAttachment(att.id)}
              className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="삭제"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
```

#### 4-4. 제출 시 attachments 포함

**handleSubmit 함수 수정 (Line 530 근처):**

```typescript
const data: CreateArticleInput = {
  title: title.trim(),
  category,
  excerpt: excerpt.trim() || undefined,
  thumbnailImage,
  content,
  attachments: attachments.length > 0 ? attachments : undefined,  // ✨ NEW
  publishedAt: publishedAt || new Date().toISOString().split('T')[0],
  published,
};
```

#### 4-5. 폼 초기화 시 attachments 초기화

**useEffect (Line 302 근처):**

```typescript
useEffect(() => {
  if (isOpen) {
    if (article) {
      // ... 기존 코드 ...
      setAttachments(
        (article.attachments as Attachment[]) || []
      );  // ✨ NEW
    } else {
      // ... 기존 코드 ...
      setAttachments([]);  // ✨ NEW
    }
  }
}, [isOpen, article]);
```

---

### 2-5. 공개 페이지 수정

**파일: `/src/app/(public)/news/[id]/page.tsx`**

#### 5-1. 페이지 컴포넌트에 attachments 전달

**Line 169-279 (NewsBlockDetailView) 수정:**

```typescript
function NewsBlockDetailView({
  data,
  attachments,  // ✨ NEW
}: {
  data: NewsBlockData;
  attachments?: Attachment[];  // ✨ NEW
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
      }}
    >
      {/* ... 기존 타이틀 섹션 ... */}

      {/* Block content */}
      <NewsBlockRenderer blocks={data.blocks} />

      {/* ✨ NEW: Attachments Section */}
      {attachments && attachments.length > 0 && (
        <AttachmentDownloadBox attachments={attachments} />
      )}
    </div>
  );
}
```

#### 5-2. AttachmentDownloadBox 컴포넌트 생성

**새 파일: `/src/components/public/news/AttachmentDownloadBox.tsx`**

```typescript
'use client';

import React from 'react';

interface Attachment {
  id: string;
  filename: string;
  filepath: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

interface AttachmentDownloadBoxProps {
  attachments: Attachment[];
}

export default function AttachmentDownloadBox({
  attachments,
}: AttachmentDownloadBoxProps) {
  // 파일 크기를 읽기 좋은 형식으로 변환
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 파일 아이콘 결정
  const getFileIcon = (mimeType: string): string => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet'))
      return '📊';
    if (mimeType.includes('powerpoint')) return '📑';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    return '📦';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        padding: '24px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '18px' }}>📎</span>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1b1d1f',
            margin: '0',
          }}
        >
          첨부파일 ({attachments.length})
        </h3>
      </div>

      {/* 파일 목록 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.filepath}
            download={attachment.filename}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              ':hover': {
                backgroundColor: '#f0f9ff',
                borderColor: '#3b82f6',
              },
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f9ff';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            {/* 파일 아이콘 */}
            <span
              style={{
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              {getFileIcon(attachment.mimeType)}
            </span>

            {/* 파일 정보 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                flex: 1,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1b1d1f',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {attachment.filename}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                }}
              >
                {formatFileSize(attachment.size)}
              </span>
            </div>

            {/* 다운로드 아이콘 */}
            <span
              style={{
                fontSize: '18px',
                flexShrink: 0,
                color: '#3b82f6',
              }}
            >
              ⬇️
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
```

#### 5-3. getNewsDetail 함수 수정

**Line 48-111 (getNewsDetail 함수):**

```typescript
async function getNewsDetail(slug: string): Promise<NewsDetailResult> {
  try {
    const article = await prisma.newsEvent.findUnique({
      where: { slug },
    });

    if (article) {
      const content = article.content as Record<string, unknown> | null;
      const attachments = article.attachments as Attachment[] | null;  // ✨ NEW

      const baseData = {
        id: article.slug,
        category: article.category,
        date: article.publishedAt
          ? new Date(article.publishedAt).toISOString().split('T')[0]
          : '2025-01-05',
        title: article.title,
        attachments,  // ✨ NEW
      };

      // ... 기존 코드 ...

      // Block format 반환 시
      return {
        type: 'blocks',
        data: {
          ...baseData,
          blocks: content.blocks as Array<Record<string, unknown>>,
          version: (content.version as string) || '1.0',
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch news detail from DB:', error);
  }

  return null;
}
```

#### 5-4. NewsBlockData 인터페이스 수정

**Line 32-39:**

```typescript
interface NewsBlockData {
  id: string;
  category: string;
  date: string;
  title: string;
  blocks: Array<Record<string, unknown>>;
  version: string;
  attachments?: Attachment[];  // ✨ NEW
}
```

#### 5-5. 페이지 컴포넌트 수정

**Line 169 호출 수정:**

```typescript
{result?.type === 'blocks' ? (
  // Block-based content rendering
  <NewsBlockDetailView
    data={result.data}
    attachments={result.data.attachments}  // ✨ NEW
  />
) : (
  // ... 기존 코드 ...
)}
```

---

## 📊 Part 3: 구현 순서 & 체크리스트

### Phase 1: DB & API (30분)
```
□ Prisma 스키마에 attachments 필드 추가
□ 마이그레이션 생성 & 실행 (npx prisma migrate dev)
□ API route.ts에서 Attachment 스키마 추가
□ CreateArticleSchema에 attachments 추가
□ POST/PUT 핸들러에서 attachments 처리
```

### Phase 2: 훅 & 타입 (20분)
```
□ Attachment 인터페이스 정의
□ NewsArticleData에 attachments 필드 추가
□ CreateArticleInput, UpdateArticleInput 수정
□ useNewsEditor 훅은 자동으로 타입 반영됨
```

### Phase 3: Admin CMS (45분)
```
□ NewsBlogModal.tsx에 attachments state 추가
□ handleFileUpload 함수 구현
□ handleRemoveAttachment 함수 구현
□ 파일 첨부 UI 섹션 추가 (Basic Info 탭)
□ handleSubmit에서 attachments 포함
□ useEffect에서 attachments 초기화
□ TypeScript 검증 및 빌드 테스트
```

### Phase 4: 공개 페이지 (35분)
```
□ AttachmentDownloadBox.tsx 컴포넌트 생성
□ page.tsx의 NewsBlockData 인터페이스 수정
□ getNewsDetail 함수에서 attachments 반환
□ NewsBlockDetailView에 attachments 전달
□ NewsBlockDetailView에서 AttachmentDownloadBox 렌더링
□ 스타일링 및 반응형 테스트
□ TypeScript 검증 및 빌드 테스트
```

### Phase 5: 통합 테스트 (30분)
```
□ Admin 로그인 후 새 공지 작성
□ 파일 첨부 (여러 파일)
□ 제출 후 DB 확인 (attachments 저장됨)
□ 공개 페이지 접속 (첨부파일 박스 표시)
□ 파일 다운로드 테스트
□ 기존 공지 편집 후 첨부파일 추가/제거 테스트
```

---

## 🎨 UI 미리보기

### Admin CMS (NewsBlogModal - Basic Info 탭)

```
┌─────────────────────────────────────────────┐
│ Title *                          Category *  │
│ [____________________]          [Select__]  │
│                                             │
│ Excerpt                                     │
│ [________________________________]          │
│ 2 lines max...                              │
│                                             │
│ Thumbnail          Published Date           │
│ [_______]          [____/____/____]        │
│ [preview]                                   │
│                                             │
│ ┌───────────────────────────────────────┐ │
│ │ 📎 파일 첨부 (최대 5개, 50MB 이하)   │ │
│ │                                       │ │
│ │ [📁 Choose Files...]                 │ │
│ │ PDF, Word, Excel, PowerPoint 등 지원 │ │
│ │                                       │ │
│ │ 첨부파일 (2/5)                       │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 📄 공지_2024.pdf                 │ ✕ │ │
│ │ │    1.2 MB                         │   │ │
│ │ └─────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ 📊 통계표.xlsx                  │ ✕ │ │
│ │ │    0.5 MB                         │   │ │
│ │ └─────────────────────────────────┘ │ │
│ └───────────────────────────────────────┘ │
│                                             │
│ □ Published (visible to public)             │
│                                             │
│ [Cancel]                        [Create] │
└─────────────────────────────────────────────┘
```

### 공개 페이지 (News 상세 - 하단)

```
┌──────────────────────────────────────────────────┐
│                  News&Event                       │
├──────────────────────────────────────────────────┤
│                                                   │
│ Notice                2026-02-16                 │
│ 새로운 공지 제목입니다                           │
│ ─────────────────────────────────────────────── │
│                                                   │
│ [블록 콘텐츠 렌더링...]                        │
│                                                   │
│                                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ 📎 첨부파일 (2)                             │ │
│ │                                              │ │
│ │ ┌──────────────────────────────────────────┐│ │
│ │ │ 📄 공지_2024.pdf                  1.2 MB │ │
│ │ │                                  ⬇️     │ │
│ │ └──────────────────────────────────────────┘│ │
│ │                                              │ │
│ │ ┌──────────────────────────────────────────┐│ │
│ │ │ 📊 통계표.xlsx                    0.5 MB │ │
│ │ │                                  ⬇️     │ │
│ │ └──────────────────────────────────────────┘│ │
│ │                                              │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## 📋 구현 예제

### 예제 1: 새 공지 생성 후 DB 데이터

```json
{
  "id": "clmp5x1j4...",
  "slug": "new-announcement-2026",
  "title": "새로운 공지사항",
  "category": "Notice",
  "excerpt": "중요한 공지입니다",
  "thumbnailImage": "/Group-27.svg",
  "content": {
    "blocks": [ /* ... */ ],
    "version": "1.0"
  },
  "attachments": [
    {
      "id": "clmp5x1j4...",
      "filename": "학생정보공지_2024_학생경비집행내역-1.pdf",
      "filepath": "/uploads/2026/02/1708076400000-file.pdf",
      "mimeType": "application/pdf",
      "size": 1234567,
      "uploadedAt": "2026-02-16T10:30:00Z"
    },
    {
      "id": "clmp5x1j5...",
      "filename": "예산표.xlsx",
      "filepath": "/uploads/2026/02/1708076401000-file.xlsx",
      "mimeType": "application/vnd.ms-excel",
      "size": 567890,
      "uploadedAt": "2026-02-16T10:31:00Z"
    }
  ],
  "publishedAt": "2026-02-16T00:00:00Z",
  "published": true
}
```

### 예제 2: API 요청

```bash
# 파일 첨부 포함하여 새 공지 생성
POST /api/admin/news/articles
Content-Type: application/json

{
  "title": "중요 공지사항",
  "category": "Notice",
  "excerpt": "관련 파일 첨부",
  "thumbnailImage": "/Group-27.svg",
  "content": {
    "blocks": [...],
    "version": "1.0"
  },
  "attachments": [
    {
      "id": "clmp...",
      "filename": "file.pdf",
      "filepath": "/uploads/2026/02/file.pdf",
      "mimeType": "application/pdf",
      "size": 1234567,
      "uploadedAt": "2026-02-16T10:30:00Z"
    }
  ],
  "publishedAt": "2026-02-16T00:00:00Z",
  "published": true
}
```

---

## ⚠️ 고려사항

### 1. 파일 저장 방식
**현재 구현 (클라이언트 메타데이터만):**
```
- Admin에서 파일 선택 → 메타데이터만 수집
- API로 메타데이터 저장
- 실제 파일 업로드는 별도 프로세스

⚠️ 향후 개선:
- /api/upload 엔드포인트 활용
- 실제 파일 업로드 통합
- 파일 검증 & 바이러스 스캔
```

### 2. 파일 다운로드 방식
**현재 구현:**
```
- <a href={filepath} download> 사용
- public/uploads 디렉토리에서 직접 제공

⚠️ 향상된 방식:
- /api/download/{fileId} 엔드포인트
- 접근 제어 & 사용률 추적
- CDN 통합
```

### 3. 보안 고려사항
```
✅ 해야 할 것:
□ 파일 타입 검증 (MIME type)
□ 파일 크기 제한 (50MB)
□ 개수 제한 (최대 5개)
□ 악성 파일 검사

⚠️ 추후 구현:
□ 파일 바이러스 스캔
□ 메타데이터 제거 (EXIF 등)
□ 접근 제어 (로그인 필요 옵션)
```

### 4. 성능
```
최적화 방안:
□ 파일 목록은 JSON에 저장 (별도 테이블 불필요)
□ 대량 다운로드 시 압축 기능 (추후)
□ CDN 활용 (추후)
```

---

## 📌 최종 요약

### 현황
```
✅ 모달 아키텍처: 완전히 분리됨 (Work vs News&Event)
❌ 파일 첨부: 미구현 (DB/API/UI 모두 없음)
❌ 다운로드 박스: 미구현 (공개 페이지에 없음)
```

### 구현 계획
```
총 소요시간: 약 2-2.5시간 (Phase 1-5)

Phase 1: DB & API (30분) - 가장 중요
Phase 2: 훅 & 타입 (20분) - 빠름
Phase 3: Admin CMS (45분) - 가장 길음
Phase 4: 공개 페이지 (35분) - UI 구현
Phase 5: 테스트 (30분) - 필수
```

### 모달 개선 (병렬 진행 가능)
```
✅ Work + News 모달 구조는 98% 동일
⚠️ 문제: 500줄+ 코드 중복

권장: useRowManager Hook 추출 (1-2시간)
```

---

## 🚀 다음 단계

1. **즉시 실행:**
   - Phase 1: Prisma 스키마 수정 & 마이그레이션
   - Phase 2: 타입 업데이트

2. **추후 실행:**
   - Phase 3-5: Admin & 공개 페이지 구현
   - 병렬로: useRowManager 훅 추출

3. **나중에 검토:**
   - 파일 실제 업로드 통합 (/api/upload)
   - 다운로드 API 엔드포인트
   - 보안 강화 (바이러스 스캔 등)

