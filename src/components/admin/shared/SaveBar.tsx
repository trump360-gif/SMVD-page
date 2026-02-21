'use client';

interface SaveBarProps {
  isDirty: boolean;
  changeCount?: number;
  isSaving: boolean;
  onSave: () => void;
  onRevert: () => void;
}

export function SaveBar({
  isDirty,
  changeCount,
  isSaving,
  onSave,
  onRevert,
}: SaveBarProps) {
  if (!isDirty) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100">
      <div className="bg-white border border-amber-300 rounded-xl px-5 py-3 flex items-center gap-4 shadow-lg shadow-amber-200/60">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span className="text-sm font-medium text-amber-800 whitespace-nowrap">
          {changeCount !== undefined && changeCount > 0
            ? `${changeCount}개 변경사항`
            : '변경사항 있음'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRevert}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            되돌리기
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isSaving && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {isSaving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
