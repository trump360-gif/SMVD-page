'use client';

import { useState } from 'react';
import { AboutPerson } from '@/hooks/useAboutEditor';
import PersonFormModal from './PersonFormModal';

interface PeopleManagerProps {
  people: AboutPerson[];
  onAdd: (data: Omit<AboutPerson, 'id' | 'order'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<AboutPerson>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (id: string, newOrder: number) => Promise<void>;
}

export default function PeopleManager({
  people,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: PeopleManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<AboutPerson | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newPersonRole, setNewPersonRole] = useState<
    'professor' | 'instructor' | null
  >(null);

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

  const handleDelete = async (person: AboutPerson) => {
    if (!confirm(`"${person.name}" 교수/강사를 삭제하시겠습니까?`)) return;
    try {
      setDeletingId(person.id);
      await onDelete(person.id);
    } catch {
      // Error handled in parent
    } finally {
      setDeletingId(null);
    }
  };

  const handleMoveUp = async (person: AboutPerson, idx: number) => {
    if (idx === 0) return;
    await onReorder(person.id, person.order - 1);
  };

  const handleMoveDown = async (person: AboutPerson, idx: number) => {
    if (idx === people.length - 1) return;
    await onReorder(person.id, person.order + 1);
  };

  const handleSubmit = async (data: Omit<AboutPerson, 'id' | 'order'>) => {
    if (editingPerson) {
      await onUpdate(editingPerson.id, data);
    } else {
      await onAdd(data);
    }
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  const professors = people.filter((p) => p.role === 'professor' || !p.role);
  const instructors = people.filter((p) => p.role === 'instructor');

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
          <div className="space-y-2">
            {professors.map((person, idx) => (
              <PersonCard
                key={person.id}
                person={person}
                index={idx}
                totalCount={professors.length}
                isExpanded={expandedId === person.id}
                isDeleting={deletingId === person.id}
                onToggle={() =>
                  setExpandedId(expandedId === person.id ? null : person.id)
                }
                onEdit={() => handleEdit(person)}
                onDelete={() => handleDelete(person)}
                onMoveUp={() => handleMoveUp(person, idx)}
                onMoveDown={() => handleMoveDown(person, idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructors */}
      {instructors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            강사 ({instructors.length}명)
          </h3>
          <div className="space-y-2">
            {instructors.map((person, idx) => (
              <PersonCard
                key={person.id}
                person={person}
                index={idx}
                totalCount={instructors.length}
                isExpanded={expandedId === person.id}
                isDeleting={deletingId === person.id}
                onToggle={() =>
                  setExpandedId(expandedId === person.id ? null : person.id)
                }
                onEdit={() => handleEdit(person)}
                onDelete={() => handleDelete(person)}
                onMoveUp={() => handleMoveUp(person, idx)}
                onMoveDown={() => handleMoveDown(person, idx)}
              />
            ))}
          </div>
        </div>
      )}

      {people.length === 0 && (
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

// -- Person Card --

interface PersonCardProps {
  person: AboutPerson;
  index: number;
  totalCount: number;
  isExpanded: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function PersonCard({
  person,
  index,
  totalCount,
  isExpanded,
  isDeleting,
  onToggle,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: PersonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center">
        {/* Order controls */}
        <div className="flex flex-col border-r px-2 py-2">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
            title="위로"
          >
            &#9650;
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalCount - 1}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-1"
            title="아래로"
          >
            &#9660;
          </button>
        </div>

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
