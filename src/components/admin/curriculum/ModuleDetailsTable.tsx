'use client';

import { useState, useEffect } from 'react';
import type { ModuleDetailData } from '@/lib/validation/curriculum';

// ============================================================
// ModuleDetailsTable
// ============================================================

interface ModuleDetailsTableProps {
  modules: ModuleDetailData[];
  onSave: (modules: ModuleDetailData[]) => void;
  isSaving?: boolean;
}

export default function ModuleDetailsTable({
  modules: initialModules,
  onSave,
  isSaving,
}: ModuleDetailsTableProps) {
  const [modules, setModules] = useState<ModuleDetailData[]>(initialModules);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setModules(initialModules);
    setHasChanges(false);
  }, [initialModules]);

  const updateModule = (
    index: number,
    field: keyof ModuleDetailData,
    value: string
  ) => {
    setModules((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(modules);
    setHasChanges(false);
    setEditingIndex(null);
  };

  const handleReset = () => {
    setModules(initialModules);
    setHasChanges(false);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          행의 수정 버튼을 클릭하여 모듈 세부사항을 수정합니다. 설명은 긴 텍스트를 지원합니다. 과목 필드는 줄바꿈을 지원합니다.
        </p>
      </div>

      {/* Module Cards */}
      <div className="space-y-4">
        {modules.map((mod, index) => {
          const isEditing = editingIndex === index;

          return (
            <div
              key={mod.module}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {mod.module}
                  </span>
                  <span className="text-sm text-gray-600">{mod.title}</span>
                </div>
                <button
                  onClick={() =>
                    setEditingIndex(isEditing ? null : index)
                  }
                  className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium ${
                    isEditing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isEditing ? '닫기' : '수정'}
                </button>
              </div>

              {/* Module Content */}
              {isEditing ? (
                <div className="p-4 space-y-4">
                  {/* Module Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        모듈
                      </label>
                      <input
                        type="text"
                        value={mod.module}
                        onChange={(e) =>
                          updateModule(index, 'module', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        제목
                      </label>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) =>
                          updateModule(index, 'title', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      설명
                    </label>
                    <textarea
                      value={mod.description}
                      onChange={(e) =>
                        updateModule(index, 'description', e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y"
                    />
                  </div>

                  {/* Courses */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      과목 (한 줄에 하나씩)
                    </label>
                    <textarea
                      value={mod.courses}
                      onChange={(e) =>
                        updateModule(index, 'courses', e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-4">
                    {/* Module+Title */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        모듈
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-bold">{mod.module}</span>{' '}
                        {mod.title}
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        설명
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {mod.description}
                      </p>
                    </div>

                    {/* Courses */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        과목
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {mod.courses}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {modules.length}개 모듈
          {hasChanges && (
            <span className="ml-2 text-amber-600 font-medium">
              (저장되지 않은 변경사항)
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              초기화
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            {isSaving ? '저장 중...' : '모듈 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
