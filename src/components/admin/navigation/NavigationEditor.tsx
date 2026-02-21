'use client';

import { useEffect, useState } from 'react';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigationEditor } from '@/hooks/useNavigationEditor';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { SaveBar } from '@/components/admin/shared/SaveBar';
import NavigationTable from './NavigationTable';
import NavigationModal from './NavigationModal';
import type { NavigationItem, CreateNavigationInput, UpdateNavigationInput } from '@/hooks/useNavigationEditor';

export default function NavigationEditor() {
  const {
    navigations,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error,
    fetchNavigations,
    addNavigation,
    updateNavigation,
    deleteNavigation,
    reorderNavigations,
    toggleNavigation,
    saveChanges,
    revert,
    clearError,
  } = useNavigationEditor();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

  useBeforeUnload(isDirty);

  useEffect(() => {
    fetchNavigations();
  }, [fetchNavigations]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NavigationItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleModalSubmit = (data: CreateNavigationInput | UpdateNavigationInput) => {
    if (editingItem) {
      updateNavigation(editingItem.id, data as UpdateNavigationInput);
    } else {
      addNavigation(data as CreateNavigationInput);
    }
  };

  const handleSave = async () => {
    try {
      await saveChanges();
    } catch {
      // error is already set in hook
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      data-testid="navigation-editor"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-base font-semibold text-gray-900">네비게이션 메뉴 관리</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            메뉴 항목을 추가, 수정, 삭제하거나 드래그해서 순서를 변경할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="navigation-add-btn"
        >
          <Plus size={16} />
          메뉴 추가
        </button>
      </div>

      {/* SaveBar */}
      <div className="px-6 pt-4">
        <SaveBar
          isDirty={isDirty}
          changeCount={changeCount}
          isSaving={isSaving}
          onSave={handleSave}
          onRevert={revert}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="flex items-start gap-3 px-6 py-3 bg-red-50 border-b border-red-100"
          role="alert"
          data-testid="navigation-error-banner"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-xs text-red-500 hover:text-red-700 underline"
            aria-label="에러 메시지 닫기"
          >
            닫기
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-4">
        {isLoading ? (
          <div
            className="flex items-center justify-center py-12 gap-3 text-gray-500"
            data-testid="navigation-loading"
          >
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm">메뉴 목록을 불러오는 중...</span>
          </div>
        ) : (
          <NavigationTable
            items={navigations}
            onEdit={handleOpenEditModal}
            onDelete={deleteNavigation}
            onToggle={toggleNavigation}
            onReorder={reorderNavigations}
          />
        )}
      </div>

      {/* Modal */}
      <NavigationModal
        isOpen={isModalOpen}
        item={editingItem}
        allItems={navigations}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
