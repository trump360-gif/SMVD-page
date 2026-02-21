'use client';

import { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { AboutPerson } from '@/hooks/useAboutEditor';
import PersonFormModal from './PersonFormModal';

interface PeopleManagerProps {
  people: AboutPerson[];
  onAdd: (data: Omit<AboutPerson, 'id' | 'order'>) => void;
  onUpdate: (id: string, data: Partial<AboutPerson>) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, newOrder: number) => void;
}

export default function PeopleManager({
  people: peopleProp,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: PeopleManagerProps) {
  const [professors, setProfessors] = useState<AboutPerson[]>([]);
  const [instructors, setInstructors] = useState<AboutPerson[]>([]);
  const profsBeforeDragRef = useRef<AboutPerson[]>([]);
  const instrsBeforeDragRef = useRef<AboutPerson[]>([]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<AboutPerson | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newPersonRole, setNewPersonRole] = useState<
    'professor' | 'instructor' | null
  >(null);

  // Sync from parent prop
  useEffect(() => {
    setProfessors(peopleProp.filter((p) => p.role === 'professor' || !p.role));
    setInstructors(peopleProp.filter((p) => p.role === 'instructor'));
  }, [peopleProp]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEdit = (person: AboutPerson) => {
    setEditingPerson(person);
    setNewPersonRole(null);
    setIsModalOpen(true);
  };

  const handleAddProfessor = () => {
    setNewPersonRole('professor');
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  const handleAddInstructor = () => {
    setNewPersonRole('instructor');
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
    setNewPersonRole(null);
  };

  const handleDelete = (person: AboutPerson) => {
    if (!confirm(`"${person.name}" 교수/강사를 삭제하시겠습니까?`)) return;
    setDeletingId(person.id);
    onDelete(person.id);
    setDeletingId(null);
  };

  const handleSubmit = (data: Omit<AboutPerson, 'id' | 'order'>) => {
    if (editingPerson) {
      onUpdate(editingPerson.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  // Professors drag handlers
  const handleProfDragStart = (_event: DragStartEvent) => {
    profsBeforeDragRef.current = professors;
  };

  const handleProfDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = professors.findIndex((p) => p.id === active.id);
    const newIndex = professors.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = professors[newIndex].order;

    setProfessors(arrayMove(professors, oldIndex, newIndex));
    onReorder(active.id as string, newOrder);
  };

  // Instructors drag handlers
  const handleInstrDragStart = (_event: DragStartEvent) => {
    instrsBeforeDragRef.current = instructors;
  };

  const handleInstrDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = instructors.findIndex((p) => p.id === active.id);
    const newIndex = instructors.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = instructors[newIndex].order;

    setInstructors(arrayMove(instructors, oldIndex, newIndex));
    onReorder(active.id as string, newOrder);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          교수/강사 관리
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleAddProfessor}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            + 교수 추가
          </button>
          <button
            onClick={handleAddInstructor}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            + 강사 추가
          </button>
        </div>
      </div>

      {/* Professors */}
      {professors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            교수 ({professors.length}명)
          </h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleProfDragStart}
            onDragEnd={handleProfDragEnd}
          >
            <SortableContext
              items={professors.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {professors.map((person) => (
                  <SortablePersonCard
                    key={person.id}
                    person={person}
                    isExpanded={expandedId === person.id}
                    isDeleting={deletingId === person.id}
                    onToggle={() =>
                      setExpandedId(expandedId === person.id ? null : person.id)
                    }
                    onEdit={() => handleEdit(person)}
                    onDelete={() => handleDelete(person)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Instructors */}
      {instructors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            강사 ({instructors.length}명)
          </h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleInstrDragStart}
            onDragEnd={handleInstrDragEnd}
          >
            <SortableContext
              items={instructors.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {instructors.map((person) => (
                  <SortablePersonCard
                    key={person.id}
                    person={person}
                    isExpanded={expandedId === person.id}
                    isDeleting={deletingId === person.id}
                    onToggle={() =>
                      setExpandedId(expandedId === person.id ? null : person.id)
                    }
                    onEdit={() => handleEdit(person)}
                    onDelete={() => handleDelete(person)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {peopleProp.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          등록된 교수/강사가 없습니다. 위의 버튼을 클릭하여 추가해주세요.
        </div>
      )}

      {/* Modal */}
      <PersonFormModal
        isOpen={isModalOpen}
        person={editingPerson}
        role={editingPerson?.role === 'instructor' ? 'instructor' : newPersonRole || 'professor'}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// -- Sortable Person Card --

interface SortablePersonCardProps {
  person: AboutPerson;
  isExpanded: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortablePersonCard({
  person,
  isExpanded,
  isDeleting,
  onToggle,
  onEdit,
  onDelete,
}: SortablePersonCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: person.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-lg shadow">
      <div className="flex items-center">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-3 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-l-lg transition-colors shrink-0 border-r"
          title="드래그해서 순서 변경"
        >
          <GripVertical size={20} className="text-gray-400" />
        </button>

        {/* Main content */}
        <button
          onClick={onToggle}
          className="flex-1 flex justify-between items-center p-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div>
            <h4 className="font-semibold text-gray-900">
              {person.name}
              <span className="text-sm text-gray-500 ml-2">
                {person.title}
              </span>
            </h4>
            <p className="text-sm text-gray-600">
              {person.badge || person.specialty || person.major || ''}
            </p>
          </div>
          <span className="text-gray-400 text-sm">
            {isExpanded ? '접기' : '펼치기'}
          </span>
        </button>
      </div>

      {isExpanded && (
        <div className="border-t p-4 bg-gray-50 space-y-3 text-sm">
          {person.office && (
            <div className="flex">
              <span className="font-semibold text-gray-700 w-20 shrink-0">
                연구실:
              </span>
              <span>{person.office}</span>
            </div>
          )}
          {person.email && person.email.length > 0 && (
            <div className="flex">
              <span className="font-semibold text-gray-700 w-20 shrink-0">
                이메일:
              </span>
              <span>{person.email.join(', ')}</span>
            </div>
          )}
          {person.phone && (
            <div className="flex">
              <span className="font-semibold text-gray-700 w-20 shrink-0">
                전화:
              </span>
              <span>{person.phone}</span>
            </div>
          )}
          {person.badge && (
            <div className="flex">
              <span className="font-semibold text-gray-700 w-20 shrink-0">
                뱃지:
              </span>
              <span>{person.badge}</span>
            </div>
          )}
          {person.courses && (
            <div className="space-y-1">
              <span className="font-semibold text-gray-700">담당과목:</span>
              {person.courses.undergraduate?.length > 0 && (
                <p className="ml-4 text-gray-600">
                  학사: {person.courses.undergraduate.join(', ')}
                </p>
              )}
              {person.courses.graduate?.length > 0 && (
                <p className="ml-4 text-gray-600">
                  석사: {person.courses.graduate.join(', ')}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              onClick={onEdit}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              수정
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
