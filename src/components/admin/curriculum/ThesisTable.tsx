'use client';

import { useState } from 'react';
import type { ThesisCardData } from '@/lib/validation/curriculum';
import ThesisModal from './ThesisModal';

// ============================================================
// Types
// ============================================================

interface ThesisTableProps {
  theses?: ThesisCardData[];
  onAddThesis?: (thesis: ThesisCardData) => Promise<void>;
  onEditThesis?: (index: number, thesis: ThesisCardData) => Promise<void>;
  onDeleteThesis?: (index: number) => Promise<void>;
  isSaving?: boolean;
}

// ============================================================
// ThesisTable
// ============================================================

export default function ThesisTable({
  theses = [],
  onAddThesis,
  onEditThesis,
  onDeleteThesis,
  isSaving,
}: ThesisTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingThesis, setEditingThesis] = useState<ThesisCardData | undefined>(undefined);

  // Open add modal
  const handleOpenAdd = () => {
    setEditingIndex(null);
    setEditingThesis(undefined);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (index: number, thesis: ThesisCardData) => {
    setEditingIndex(index);
    setEditingThesis(thesis);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setEditingThesis(undefined);
  };

  // Submit (add or edit)
  const handleSubmit = async (thesis: ThesisCardData) => {
    if (editingIndex !== null) {
      await onEditThesis?.(editingIndex, thesis);
    } else {
      await onAddThesis?.(thesis);
    }
    handleCloseModal();
  };

  // Delete
  const handleDelete = async (index: number, title: string) => {
    const truncated = title.length > 40 ? title.slice(0, 40) + '...' : title;
    if (confirm(`Delete thesis "${truncated}"?`)) {
      await onDeleteThesis?.(index);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Graduation Thesis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage graduate thesis entries. {theses.length} total.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add Thesis
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {theses.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">
            No thesis entries yet. Click &quot;+ Add Thesis&quot; to create one.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-10">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-24">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-28">
                  Date
                </th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {theses.map((thesis, index) => (
                <tr
                  key={thesis.id || `thesis-${index}`}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Index */}
                  <td className="px-4 py-3 text-sm text-gray-400 font-medium">
                    {index + 1}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {thesis.category}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    <span className="line-clamp-2">{thesis.title}</span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {thesis.date}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(index, thesis)}
                        disabled={isSaving}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(index, thesis.title)}
                        disabled={isSaving}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Thesis Modal */}
      <ThesisModal
        isOpen={isModalOpen}
        isEditing={editingIndex !== null}
        thesis={editingThesis}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />
    </div>
  );
}
