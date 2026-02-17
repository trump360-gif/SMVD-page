'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { NavigationItem } from '@/hooks/useNavigationEditor';

interface NavigationRowProps {
  item: NavigationItem;
  onEdit: (item: NavigationItem) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => Promise<void | NavigationItem>;
}

export default function NavigationRow({
  item,
  onEdit,
  onDelete,
  onToggle,
}: NavigationRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    if (!confirm(`"${item.label}" 메뉴를 삭제하시겠습니까?`)) return;
    try {
      await onDelete(item.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  const handleToggle = async () => {
    try {
      await onToggle(item.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '상태 변경 실패');
    }
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 transition-colors ${
        isDragging ? 'bg-blue-50' : 'hover:bg-gray-50 bg-white'
      }`}
      data-testid={`navigation-row-${item.id}`}
    >
      {/* Drag handle */}
      <td className="px-3 py-3 w-10">
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded transition-colors"
          title="드래그해서 순서 변경"
          aria-label={`${item.label} 순서 변경 핸들`}
        >
          <GripVertical size={18} className="text-gray-400" />
        </button>
      </td>

      {/* Label */}
      <td className="px-3 py-3">
        <span className="font-medium text-gray-900 text-sm">{item.label}</span>
        {item.parentId && (
          <span className="ml-2 text-xs text-gray-400">(하위 메뉴)</span>
        )}
      </td>

      {/* Href */}
      <td className="px-3 py-3">
        <span className="text-sm text-gray-600 font-mono">{item.href}</span>
      </td>

      {/* Order */}
      <td className="px-3 py-3 text-center">
        <span className="text-sm text-gray-500">{item.order}</span>
      </td>

      {/* IsActive toggle */}
      <td className="px-3 py-3 text-center">
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
            item.isActive ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={item.isActive}
          aria-label={`${item.label} ${item.isActive ? '비활성화' : '활성화'}`}
          data-testid={`navigation-toggle-${item.id}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              item.isActive ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </td>

      {/* Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="수정"
            aria-label={`${item.label} 수정`}
            data-testid={`navigation-edit-btn-${item.id}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="삭제"
            aria-label={`${item.label} 삭제`}
            data-testid={`navigation-delete-btn-${item.id}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
