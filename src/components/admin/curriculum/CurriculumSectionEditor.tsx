'use client';

import { useState, useCallback } from 'react';
import type { GraduateCourseItemData } from '@/lib/validation/curriculum';

// ============================================================
// Types
// ============================================================

interface CurriculumSectionData {
  id?: string;
  title: string;
  leftCourses: GraduateCourseItemData[];
  rightCourses: GraduateCourseItemData[];
}

interface CurriculumSectionEditorProps {
  section?: CurriculumSectionData | null;
  onSave?: (courses: { leftCourses: GraduateCourseItemData[]; rightCourses: GraduateCourseItemData[] }) => Promise<void>;
  isSaving?: boolean;
}

// ============================================================
// EditableCourseRow
// ============================================================

interface EditableCourseRowProps {
  course: GraduateCourseItemData;
  index: number;
  onUpdate: (title: string) => void;
  onDelete: () => void;
  isSaving?: boolean;
}

function EditableCourseRow({ course, index, onUpdate, onDelete, isSaving }: EditableCourseRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(course.title);

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdate(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(course.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Index */}
      <td className="px-3 py-3 w-10 text-center text-sm text-gray-400 font-medium">
        {index + 1}
      </td>

      {/* Course Title */}
      <td className="px-3 py-3 text-sm text-gray-900">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
            className="w-full px-3 py-1.5 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        ) : (
          <span className="font-medium">{course.title}</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-3 py-3 w-24 text-right">
        <div className="flex items-center justify-end gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-1.5 text-green-600 hover:text-green-800 transition-colors"
                title="Save"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cancel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isSaving}
                className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${course.title}"?`)) {
                    onDelete();
                  }
                }}
                disabled={isSaving}
                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// CourseColumnTable
// ============================================================

interface CourseColumnTableProps {
  label: string;
  courses: GraduateCourseItemData[];
  onUpdateCourse: (index: number, title: string) => void;
  onDeleteCourse: (index: number) => void;
  onAddCourse: () => void;
  isSaving?: boolean;
}

function CourseColumnTable({
  label,
  courses,
  onUpdateCourse,
  onDeleteCourse,
  onAddCourse,
  isSaving,
}: CourseColumnTableProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
        <span className="text-xs text-gray-400">{courses.length} courses</span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {courses.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No courses added yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase w-10">
                  #
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Course Name
                </th>
                <th className="px-3 py-2 w-24" />
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <EditableCourseRow
                  key={course.id || `${course.title}-${index}`}
                  course={course}
                  index={index}
                  onUpdate={(title) => onUpdateCourse(index, title)}
                  onDelete={() => onDeleteCourse(index)}
                  isSaving={isSaving}
                />
              ))}
            </tbody>
          </table>
        )}

        {/* Add course button */}
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50/50">
          <button
            onClick={onAddCourse}
            disabled={isSaving}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors disabled:text-gray-400"
          >
            + Add Course
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CurriculumSectionEditor (Main)
// ============================================================

export default function CurriculumSectionEditor({
  section,
  onSave,
  isSaving,
}: CurriculumSectionEditorProps) {
  const [leftCourses, setLeftCourses] = useState<GraduateCourseItemData[]>(
    section?.leftCourses ?? []
  );
  const [rightCourses, setRightCourses] = useState<GraduateCourseItemData[]>(
    section?.rightCourses ?? []
  );
  const [hasChanges, setHasChanges] = useState(false);

  const markChanged = useCallback(() => setHasChanges(true), []);

  // Left column handlers
  const handleUpdateLeftCourse = useCallback((index: number, title: string) => {
    setLeftCourses((prev) => prev.map((c, i) => (i === index ? { ...c, title } : c)));
    markChanged();
  }, [markChanged]);

  const handleDeleteLeftCourse = useCallback((index: number) => {
    setLeftCourses((prev) => prev.filter((_, i) => i !== index));
    markChanged();
  }, [markChanged]);

  const handleAddLeftCourse = useCallback(() => {
    setLeftCourses((prev) => [...prev, { title: '' }]);
    markChanged();
  }, [markChanged]);

  // Right column handlers
  const handleUpdateRightCourse = useCallback((index: number, title: string) => {
    setRightCourses((prev) => prev.map((c, i) => (i === index ? { ...c, title } : c)));
    markChanged();
  }, [markChanged]);

  const handleDeleteRightCourse = useCallback((index: number) => {
    setRightCourses((prev) => prev.filter((_, i) => i !== index));
    markChanged();
  }, [markChanged]);

  const handleAddRightCourse = useCallback(() => {
    setRightCourses((prev) => [...prev, { title: '' }]);
    markChanged();
  }, [markChanged]);

  // Save
  const handleSave = useCallback(async () => {
    // Filter out courses with empty titles
    const validLeft = leftCourses.filter((c) => c.title.trim() !== '');
    const validRight = rightCourses.filter((c) => c.title.trim() !== '');

    if (validLeft.length === 0 && validRight.length === 0) {
      return;
    }

    await onSave?.({ leftCourses: validLeft, rightCourses: validRight });
    setLeftCourses(validLeft);
    setRightCourses(validRight);
    setHasChanges(false);
  }, [leftCourses, rightCourses, onSave]);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h3 className="text-lg font-bold text-gray-900">
          {section?.title ?? 'Curriculum Section'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Edit course names inline. Click the pencil icon to edit, or X to delete.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-6">
        <CourseColumnTable
          label="Left Courses"
          courses={leftCourses}
          onUpdateCourse={handleUpdateLeftCourse}
          onDeleteCourse={handleDeleteLeftCourse}
          onAddCourse={handleAddLeftCourse}
          isSaving={isSaving}
        />
        <CourseColumnTable
          label="Right Courses"
          courses={rightCourses}
          onUpdateCourse={handleUpdateRightCourse}
          onDeleteCourse={handleDeleteRightCourse}
          onAddCourse={handleAddRightCourse}
          isSaving={isSaving}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            hasChanges && !isSaving
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
