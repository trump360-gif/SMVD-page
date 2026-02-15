'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CourseData, SemesterData } from '@/lib/validation/curriculum';
import CourseModal from './CourseModal';

// ============================================================
// SortableCourseRow
// ============================================================

interface SortableCourseRowProps {
  course: CourseData;
  index: number;
  semesterYear: number;
  semesterTerm: number;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableCourseRow({
  course,
  index,
  onEdit,
  onDelete,
}: SortableCourseRowProps) {
  const id = `${course.name}-${index}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isDragging ? 'bg-blue-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <td className="px-3 py-3 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          aria-label="Drag to reorder"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>
      </td>

      {/* Color */}
      <td className="px-3 py-3 w-12">
        <div
          className="w-5 h-5 rounded"
          style={{ backgroundColor: course.color }}
          title={course.color}
        />
      </td>

      {/* Name */}
      <td className="px-3 py-3 text-sm text-gray-900 font-medium">
        {course.name}
      </td>

      {/* Classification */}
      <td className="px-3 py-3 w-24">
        <span
          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
            course.classification === 'required'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {course.classification === 'required' ? 'Required' : 'Elective'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 w-24 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// CourseTable
// ============================================================

interface CourseTableProps {
  semesters: SemesterData[];
  onAddCourse: (semesterIndex: number, course: CourseData) => void;
  onEditCourse: (semesterIndex: number, courseIndex: number, course: CourseData) => void;
  onDeleteCourse: (semesterIndex: number, courseIndex: number) => void;
  onReorderCourses: (semesterIndex: number, courses: CourseData[]) => void;
  isSaving?: boolean;
}

export default function CourseTable({
  semesters,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onReorderCourses,
  isSaving,
}: CourseTableProps) {
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterTerm, setFilterTerm] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<{
    semesterIndex: number;
    courseIndex: number;
    course: CourseData;
    year: number;
    term: number;
  } | null>(null);
  const [addContext, setAddContext] = useState<{ year: number; term: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredSemesters = semesters
    .map((sem, idx) => ({ ...sem, originalIndex: idx }))
    .filter((sem) => {
      if (filterYear !== null && sem.year !== filterYear) return false;
      if (filterTerm !== null && sem.term !== filterTerm) return false;
      return true;
    });

  const handleOpenAddModal = (year: number, term: number) => {
    setEditingContext(null);
    setAddContext({ year, term });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    semesterIndex: number,
    courseIndex: number,
    course: CourseData,
    year: number,
    term: number
  ) => {
    setAddContext(null);
    setEditingContext({ semesterIndex, courseIndex, course, year, term });
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: CourseData, year: number, term: number) => {
    if (editingContext) {
      onEditCourse(editingContext.semesterIndex, editingContext.courseIndex, data);
    } else {
      const semIdx = semesters.findIndex(
        (s) => s.year === year && s.term === term
      );
      if (semIdx >= 0) {
        onAddCourse(semIdx, data);
      }
    }
    setIsModalOpen(false);
    setEditingContext(null);
    setAddContext(null);
  };

  const handleDragEnd = useCallback(
    (semesterIndex: number, courses: CourseData[]) =>
      (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const ids = courses.map((c, i) => `${c.name}-${i}`);
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));

        if (oldIndex === -1 || newIndex === -1) return;

        const newCourses = arrayMove(courses, oldIndex, newIndex);
        onReorderCourses(semesterIndex, newCourses);
      },
    [onReorderCourses]
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Year:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterYear(null)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filterYear === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4].map((y) => (
              <button
                key={y}
                onClick={() => setFilterYear(filterYear === y ? null : y)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filterYear === y
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Semester:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterTerm(null)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filterTerm === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {[1, 2].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTerm(filterTerm === t ? null : t)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filterTerm === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          Total {semesters.reduce((sum, s) => sum + s.courses.length, 0)} courses
        </div>
      </div>

      {/* Semester Sections */}
      {filteredSemesters.map((semester) => {
        const courseIds = semester.courses.map((c, i) => `${c.name}-${i}`);

        return (
          <div
            key={`${semester.year}-${semester.term}`}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Semester Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">
                {semester.year} year - {semester.term} semester
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({semester.courses.length} courses)
                </span>
              </h3>
              <button
                onClick={() => handleOpenAddModal(semester.year, semester.term)}
                disabled={isSaving}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
              >
                + Add Course
              </button>
            </div>

            {/* Courses Table */}
            {semester.courses.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                No courses in this semester.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd(semester.originalIndex, semester.courses)}
              >
                <SortableContext
                  items={courseIds}
                  strategy={verticalListSortingStrategy}
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="px-3 py-2 w-10" />
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase w-12">
                          Color
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                          Course Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase w-24">
                          Type
                        </th>
                        <th className="px-3 py-2 w-24" />
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course, courseIndex) => (
                        <SortableCourseRow
                          key={`${course.name}-${courseIndex}`}
                          course={course}
                          index={courseIndex}
                          semesterYear={semester.year}
                          semesterTerm={semester.term}
                          onEdit={() =>
                            handleOpenEditModal(
                              semester.originalIndex,
                              courseIndex,
                              course,
                              semester.year,
                              semester.term
                            )
                          }
                          onDelete={() => {
                            if (confirm(`Delete "${course.name}"?`)) {
                              onDeleteCourse(semester.originalIndex, courseIndex);
                            }
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </SortableContext>
              </DndContext>
            )}
          </div>
        );
      })}

      {filteredSemesters.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No semesters match the selected filters.
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        isEditing={!!editingContext}
        semester={
          editingContext
            ? { year: editingContext.year, term: editingContext.term }
            : addContext || undefined
        }
        course={editingContext?.course}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContext(null);
          setAddContext(null);
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
