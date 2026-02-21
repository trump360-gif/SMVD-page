'use client';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onKeepEditing: () => void;
  onDiscard: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  onKeepEditing,
  onDiscard,
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onKeepEditing}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          저장하지 않은 변경사항
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          변경사항을 저장하지 않고 닫으시겠습니까?
          저장하지 않은 변경사항은 사라집니다.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onKeepEditing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            계속 편집
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            저장하지 않고 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
