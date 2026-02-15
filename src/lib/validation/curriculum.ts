import { z } from "zod";

// ============================================================
// Undergraduate (학부) 교과과정 Zod 스키마
// ============================================================

/** 단일 과목 */
export const CourseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "과목명은 필수입니다"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6,8}$/, "유효한 HEX 색상 코드를 입력하세요"),
  classification: z.enum(["required", "elective"]),
});
export type CourseData = z.infer<typeof CourseSchema>;

/** 학기 */
export const SemesterSchema = z.object({
  year: z.number().int().min(1).max(6),
  term: z.number().int().min(1).max(2),
  courses: z.array(CourseSchema),
});
export type SemesterData = z.infer<typeof SemesterSchema>;

/** 트랙 (모듈 테이블의 행) */
export const TrackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "모듈명은 필수입니다"),
  track: z.string().min(1, "트랙명은 필수입니다"),
  courses: z.string().min(1, "해당 과목은 필수입니다"),
  requirements: z.string().min(1, "이수 기준은 필수입니다"),
  credits: z.string().min(1, "기준 학점은 필수입니다"),
});
export type TrackData = z.infer<typeof TrackSchema>;

/** 모듈 상세 설명 */
export const ModuleDetailSchema = z.object({
  id: z.string().optional(),
  module: z.string().min(1, "모듈 구분은 필수입니다"),
  title: z.string().min(1, "모듈 제목은 필수입니다"),
  description: z.string().min(1, "설명은 필수입니다"),
  courses: z.string().min(1, "해당 과목은 필수입니다"),
});
export type ModuleDetailData = z.infer<typeof ModuleDetailSchema>;

/** 학부 전체 콘텐츠 (Section.content JSON) */
export const UndergraduateContentSchema = z.object({
  semesters: z.array(SemesterSchema).min(1, "최소 1개 학기가 필요합니다"),
  tracks: z.array(TrackSchema),
  modules: z.array(ModuleDetailSchema),
});
export type UndergraduateContent = z.infer<typeof UndergraduateContentSchema>;

// ============================================================
// Graduate (대학원) 교과과정 Zod 스키마
// ============================================================

/** 대학원 과목 아이템 */
export const GraduateCourseItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "과목명은 필수입니다"),
});
export type GraduateCourseItemData = z.infer<typeof GraduateCourseItemSchema>;

/** 대학원 커리큘럼 섹션 (석사/박사) */
export const GraduateCurriculumSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "섹션 제목은 필수입니다"),
  leftCourses: z.array(GraduateCourseItemSchema),
  rightCourses: z.array(GraduateCourseItemSchema),
});
export type GraduateCurriculumSectionData = z.infer<
  typeof GraduateCurriculumSectionSchema
>;

/** 졸업 논문 카드 */
export const ThesisCardSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, "카테고리는 필수입니다"),
  title: z.string().min(1, "논문 제목은 필수입니다"),
  date: z.string().min(1, "날짜는 필수입니다"),
});
export type ThesisCardData = z.infer<typeof ThesisCardSchema>;

/** 대학원 전체 콘텐츠 (Section.content JSON) */
export const GraduateContentSchema = z.object({
  master: GraduateCurriculumSectionSchema,
  doctor: GraduateCurriculumSectionSchema,
  theses: z.array(ThesisCardSchema),
});
export type GraduateContent = z.infer<typeof GraduateContentSchema>;

// ============================================================
// API Request / Response 스키마
// ============================================================

/** PUT /api/admin/curriculum/sections - 섹션 업데이트 */
export const UpdateCurriculumSectionSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  type: z.enum(["CURRICULUM_UNDERGRADUATE", "CURRICULUM_GRADUATE"]),
  content: z.unknown(), // 타입별 검증은 핸들러에서 수행
});
export type UpdateCurriculumSectionInput = z.infer<
  typeof UpdateCurriculumSectionSchema
>;

/** POST /api/admin/curriculum/courses - 과목 추가 */
export const AddCourseSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  semesterIndex: z.number().int().min(0, "학기 인덱스는 0 이상이어야 합니다"),
  course: CourseSchema,
});
export type AddCourseInput = z.infer<typeof AddCourseSchema>;

/** PUT /api/admin/curriculum/courses - 과목 수정 */
export const UpdateCourseSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  semesterIndex: z.number().int().min(0),
  courseIndex: z.number().int().min(0),
  course: CourseSchema,
});
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;

/** DELETE /api/admin/curriculum/courses */
export const DeleteCourseSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  semesterIndex: z.number().int().min(0),
  courseIndex: z.number().int().min(0),
});
export type DeleteCourseInput = z.infer<typeof DeleteCourseSchema>;

/** PUT /api/admin/curriculum/courses/reorder - 과목 순서 변경 */
export const ReorderCoursesSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  semesterIndex: z.number().int().min(0),
  courses: z.array(CourseSchema).min(1, "최소 1개 과목이 필요합니다"),
});
export type ReorderCoursesInput = z.infer<typeof ReorderCoursesSchema>;

/** PUT /api/admin/curriculum/tracks - 트랙 정보 업데이트 */
export const UpdateTracksSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  tracks: z.array(TrackSchema).min(1, "최소 1개 트랙이 필요합니다"),
});
export type UpdateTracksInput = z.infer<typeof UpdateTracksSchema>;

/** PUT /api/admin/curriculum/modules - 모듈 상세 업데이트 */
export const UpdateModulesSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  modules: z
    .array(ModuleDetailSchema)
    .min(1, "최소 1개 모듈이 필요합니다"),
});
export type UpdateModulesInput = z.infer<typeof UpdateModulesSchema>;

/** POST /api/admin/curriculum/theses - 논문 추가 */
export const AddThesisSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  thesis: ThesisCardSchema,
});
export type AddThesisInput = z.infer<typeof AddThesisSchema>;

/** PUT /api/admin/curriculum/theses - 논문 수정 */
export const UpdateThesisSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  thesisIndex: z.number().int().min(0),
  thesis: ThesisCardSchema,
});
export type UpdateThesisInput = z.infer<typeof UpdateThesisSchema>;

/** DELETE /api/admin/curriculum/theses */
export const DeleteThesisSchema = z.object({
  sectionId: z.string().min(1, "섹션 ID는 필수입니다"),
  thesisIndex: z.number().int().min(0),
});
export type DeleteThesisInput = z.infer<typeof DeleteThesisSchema>;
