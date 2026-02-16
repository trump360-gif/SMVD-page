import type {
  UndergraduateContent,
  GraduateContent,
} from "@/lib/validation/curriculum";

// ============================================================
// Section types (API response)
// ============================================================

export interface CurriculumSection {
  id: string;
  pageId: string;
  type: "CURRICULUM_UNDERGRADUATE" | "CURRICULUM_GRADUATE";
  title: string | null;
  content: UndergraduateContent | GraduateContent;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = CurriculumSection> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface ApiListResponse {
  success: boolean;
  data?: CurriculumSection[];
  message?: string;
}

// ============================================================
// Hook state type
// ============================================================

export interface CurriculumEditorState {
  sections: CurriculumSection[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
}
