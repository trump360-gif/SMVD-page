# CMS 데이터 동기화 문제 분석 리포트
## WorkBlogModal이 최신 DB 데이터를 로드하지 못하는 근본 원인 (2026-02-20)

---

## 🎯 문제 상황

**사용자 지적:** "작성하는 곳의 정보가 반영안돼있고 따로 놀고있다"

**실제 현상:**
1. DB에서 /work/9 수정 완료 (중복 paragraph 제거: 11개 → 10개)
2. 공개 페이지 /work/9는 ✅ 정상 렌더링 (10개 노드)
3. **CMS 콘텐츠 탭은 ❌ 여전히 이전 데이터 표시 (11개 노드?)**
4. 콘텐츠 탭과 공개 페이지가 서로 다른 데이터 사용

---

## 🔍 데이터 흐름 분석

### 1단계: WorkDashboard에서 프로젝트 선택

**파일:** `src/app/admin/dashboard/work/page.tsx`

```typescript
// Line 66-67: 초기 로드
useEffect(() => {
  if (status === 'authenticated') {
    fetchProjects();      // ← useWorkEditor에서 projects 상태 초기화
    fetchExhibitions();
  }
}, [status, fetchProjects, fetchExhibitions]);

// Line 112-115: 프로젝트 선택
const handleEditProject = (project: WorkProjectData) => {
  setEditingProject(project);    // ← 이 project는 이전 projects 상태에서 온 것
  setIsProjectModalOpen(true);
};

// Line 372-381: WorkBlogModal에 전달
<WorkBlogModal
  key={editingProject?.id || 'new'}
  isOpen={isProjectModalOpen}
  project={editingProject}   // ← 이 project prop이 모달로 전달
  onClose={() => {...}}
  onSubmit={handleProjectSubmit}
/>
```

**⚠️ 문제점:**
- handleEditProject는 현재 projects 배열에서 선택한 project를 전달
- 이 project는 **마지막 fetchProjects() 호출 시점의 데이터**

---

### 2단계: useWorkEditor의 projects 상태 관리

**파일:** `src/hooks/useWorkEditor.ts`

```typescript
// Line 95: 프로젝트 상태
const [projects, setProjects] = useState<WorkProjectData[]>([]);

// Line 104-119: 프로젝트 목록 조회
const fetchProjects = useCallback(async () => {
  try {
    setIsLoading(true);
    const res = await fetch('/api/admin/work/projects', {
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '프로젝트 조회 실패');
    setProjects(data.data || []);    // ← 최신 데이터로 업데이트
  } catch (err) {
    setError(err instanceof Error ? err.message : '프로젝트 조회 실패');
  } finally {
    setIsLoading(false);
  }
}, []);

// Line 141-161: 프로젝트 수정
const updateProject = useCallback(async (id: string, input: UpdateProjectInput) => {
  try {
    const res = await fetch(`/api/admin/work/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '프로젝트 수정 실패');
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? data.data : p))  // ← API 응답으로 업데이트
    );
    return data.data as WorkProjectData;
  } catch (err) {
    // ...
  }
}, []);
```

**중요:**
- updateProject는 API 응답 데이터로만 projects 상태 업데이트
- DB를 직접 수정했을 때 (API 호출 없이) projects 상태는 동기화 안됨
- **DB 수정 후 fetchProjects() 재호출이 필요함**

---

### 3단계: WorkBlogModal의 데이터 로드

**파일:** `src/components/admin/work/WorkBlogModal.tsx`

```typescript
// Line 36-56: 초기 상태
const [editorContent, setEditorContent] = useState<TiptapContent>({
  type: 'doc',
  content: [],
});

// Line 63-109: useEffect - project prop 변경 시 폼 리로드
useEffect(() => {
  if (isOpen) {
    if (project) {
      setTitle(project.title);
      setSubtitle(project.subtitle);
      // ... 기본정보 로드

      // Line 77-93: Tiptap content 파싱
      let tiptapContent: TiptapContent = { type: 'doc', content: [] };
      if (project.content) {
        if (typeof project.content === 'string') {
          try {
            const parsed = JSON.parse(project.content);
            if (isTiptapContent(parsed)) {
              tiptapContent = parsed;
            }
          } catch (e) {
            console.error('Failed to parse content:', e);
          }
        } else if (isTiptapContent(project.content)) {
          tiptapContent = project.content;  // ← project에서 직접 가져옴
        }
      }

      setEditorContent(tiptapContent);
    }
  }
}, [isOpen, project]);  // ← project 변경 시만 리로드
```

**⚠️ 문제점:**
- useEffect는 `project` prop이 변경될 때만 실행
- 현재 project prop은 **DB 수정을 반영하지 않은 이전 상태**
- setEditorContent는 project.content 기반으로만 설정
- **DB 직접 수정 후 새로운 project 데이터를 받지 못함**

---

## 📊 데이터 흐름도

```
타이밍 1: 페이지 초기 로드 (완벽함)
═══════════════════════════════════════
WorkDashboard mount
    ↓
fetchProjects() 호출
    ↓
API에서 /work/9 최신 데이터 조회 (11개 노드)
    ↓
projects 상태 업데이트
    ↓
WorkProjectList 렌더링 (11개)


DB 수정 발생 (문제 시작!)
═══════════════════════════════════════
curl /api/admin/fix-work-9 → DB 수정 (11개 → 10개)
    ↓
DB 변경됨!
    ↓
하지만...
  └─ WorkDashboard의 projects 상태는 여전히 11개
  └─ WorkProjectList는 여전히 11개 표시


사용자가 프로젝트 선택
═══════════════════════════════════════
WorkProjectList에서 "수정" 클릭
    ↓
handleEditProject(project)  // ← 이 project는 11개 노드 버전
    ↓
setEditingProject(project)
    ↓
WorkBlogModal의 project prop 변경
    ↓
WorkBlogModal useEffect 실행
    ↓
editorContent = project.content (11개!)  ← 문제!
    ↓
TiptapEditor 렌더링 (11개 노드)


결과: CMS와 공개 페이지가 다른 데이터 표시
═══════════════════════════════════════
공개 페이지: 10개 노드 (DB에서 최신 데이터 읽음) ✅
CMS 탭: 11개 노드 (메모리에 캐시된 이전 데이터) ❌
```

---

## 🔴 근본 원인 정리

| 단계 | 위치 | 코드 | 문제 |
|------|------|------|------|
| 1️⃣ | WorkDashboard | `handleEditProject()` | 현재 projects 배열에서만 project 선택 |
| 2️⃣ | useWorkEditor | `projects` 상태 | DB 직접 수정 후 동기화 안됨 |
| 3️⃣ | WorkBlogModal | `useEffect()` | project prop 변경 시만 리로드 |
| 4️⃣ | WorkBlogModal | `editorContent` | project.content 기반으로만 설정 |

**핵심 원인:**
**DB 수정 후 `fetchProjects()` 재호출이 없어서 WorkDashboard의 projects 상태가 구버전을 그대로 유지**

---

## ✅ 해결 방법 (3가지 옵션)

### 옵션 1: handleEditProject에서 개별 프로젝트 조회 (★ 추천)

```typescript
// src/app/admin/dashboard/work/page.tsx

const handleEditProject = async (project: WorkProjectData) => {
  try {
    // DB에서 최신 프로젝트 데이터 직접 조회
    const res = await fetch(`/api/admin/work/projects/${project.id}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('프로젝트 조회 실패');
    const data = await res.json();
    const latestProject = data.data;  // ← 최신 데이터!

    setEditingProject(latestProject);
    setIsProjectModalOpen(true);
  } catch (err) {
    alert(err instanceof Error ? err.message : '프로젝트 조회 실패');
  }
};
```

**장점:**
- ✅ DB 수정 직후에도 최신 데이터 로드
- ✅ 전체 목록 재조회보다 효율적 (개별 조회 API)
- ✅ 사용자 경험 개선 (신뢰도 ↑)
- ✅ API 레이턴시 최소 (한 번의 조회)

**단점:** 추가 API 호출 (무시할 수준)

---

### 옵션 2: 모달 onSubmit 후 fetchProjects 재호출

```typescript
// src/app/admin/dashboard/work/page.tsx

const handleProjectSubmit = async (data: CreateProjectInput | UpdateProjectInput) => {
  if (editingProject) {
    await updateProject(editingProject.id, data as UpdateProjectInput);
    showSuccess('프로젝트가 수정되었습니다');
  } else {
    await addProject(data as CreateProjectInput);
    showSuccess('프로젝트가 추가되었습니다');
  }

  // 새로운 코드: 모달 닫기 전 재호출
  await fetchProjects();  // ← 전체 목록 재조회

  refreshPreview();
};
```

**장점:**
- ✅ 구현이 간단
- ✅ 저장 후 최신 데이터 보장

**단점:**
- ❌ 모달을 열 때마다가 아니라 저장 후에만 동기화
- ❌ 전체 목록 재조회 (비효율)
- ❌ DB 직접 수정되면 여전히 문제

---

### 옵션 3: WorkBlogModal에서 마운트 시 개별 조회

```typescript
// src/components/admin/work/WorkBlogModal.tsx

const [freshProject, setFreshProject] = useState<WorkProjectData | null>(null);

useEffect(() => {
  if (isOpen && project) {
    // DB에서 최신 프로젝트 조회
    const fetchFreshData = async () => {
      try {
        const res = await fetch(`/api/admin/work/projects/${project.id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setFreshProject(data.data);  // ← 최신 데이터 사용
        }
      } catch (err) {
        console.error('Failed to fetch fresh data:', err);
        setFreshProject(project);  // Fallback
      }
    };
    fetchFreshData();
  }
}, [isOpen, project?.id]);

// 이후 freshProject 사용
const projectData = freshProject || project;
```

**장점:**
- ✅ 모달이 항상 최신 데이터 사용

**단점:**
- ❌ 모달마다 API 호출 (비효율)
- ❌ 네트워크 레이턴시 증가

---

## 🎯 최종 권장안

### **옵션 1 (handleEditProject 개별 조회)을 추천**

**이유:**
1. ✅ **DB 직접 수정 후에도 즉시 최신 데이터 로드**
2. ✅ **효율성**: 전체 목록 재조회 X, 개별 조회 O
3. ✅ **신뢰도**: 항상 최신 데이터 보장
4. ✅ **사용자 경험**: "수정" 버튼 클릭 → 모달 열림 → 최신 데이터

---

## 📋 구현 단계

### Step 1: API 엔드포인트 확인
- GET `/api/admin/work/projects/:id` 존재하는지 확인
- 응답 형식: `{ data: WorkProjectData }`

### Step 2: handleEditProject 수정
```typescript
const handleEditProject = async (project: WorkProjectData) => {
  try {
    const res = await fetch(`/api/admin/work/projects/${project.id}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || '프로젝트 조회 실패');
    }
    const data = await res.json();
    setEditingProject(data.data);
    setIsProjectModalOpen(true);
  } catch (err) {
    alert(err instanceof Error ? err.message : '프로젝트 조회 실패');
  }
};
```

### Step 3: 테스트
1. DB 수정 (fix-work-9 API 호출)
2. Admin 대시보드에서 프로젝트 선택
3. 모달의 콘텐츠 탭 확인 → 최신 데이터 표시되는지 검증

---

## 🔧 예상 결과

**수정 전:**
- DB: 10개 노드
- CMS 콘텐츠 탭: 11개 노드 (비동기화) ❌

**수정 후:**
- DB: 10개 노드
- CMS 콘텐츠 탭: 10개 노드 (동기화 완료!) ✅

---

## 📝 요약

| 항목 | 내용 |
|------|------|
| **문제** | DB 수정 후 CMS가 이전 데이터 표시 |
| **원인** | WorkDashboard의 projects 상태가 DB 변경을 반영하지 않음 |
| **해결** | handleEditProject에서 개별 프로젝트 조회 |
| **파일** | src/app/admin/dashboard/work/page.tsx |
| **라인** | Line 112-115 (handleEditProject) |
| **예상 시간** | 5분 (구현) + 5분 (테스트) = 10분 |

