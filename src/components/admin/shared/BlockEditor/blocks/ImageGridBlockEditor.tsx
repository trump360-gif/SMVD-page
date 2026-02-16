'use client';

import React, { useState } from 'react';
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Trash2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ImageGridBlock, ImageData, ImageGridRow } from '../types';

interface ImageGridBlockEditorProps {
  block: ImageGridBlock;
  onChange: (block: ImageGridBlock) => void;
  onRemove: () => void;
}

interface DraggableImageItemProps {
  image: ImageData;
  rowId: string;
  onRemove: (imageId: string) => void;
  onUpdateImage: (imageId: string, field: keyof ImageData, value: string) => void;
}

/**
 * 드래그 가능한 이미지 아이템
 */
function DraggableImageItem({
  image,
  rowId,
  onRemove,
  onUpdateImage,
}: DraggableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border rounded-lg overflow-hidden transition-all ${
        isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing bg-black bg-opacity-50 text-white px-1.5 py-0.5 rounded text-[10px] font-bold"
      >
        ⋮⋮
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-1 right-1 z-10 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
      >
        <X size={12} />
      </button>

      {/* Image Preview */}
      {image.url ? (
        <img
          src={image.url}
          alt={image.alt || 'Preview'}
          className="w-full h-20 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
          No image
        </div>
      )}

      {/* URL Input */}
      <input
        type="text"
        placeholder="URL"
        value={image.url}
        onChange={(e) => onUpdateImage(image.id, 'url', e.target.value)}
        className="w-full text-xs px-1 py-0.5 border-t border-gray-200 focus:outline-none focus:border-blue-400"
      />

      {/* Alt Text Input */}
      <input
        type="text"
        placeholder="Alt"
        value={image.alt || ''}
        onChange={(e) => onUpdateImage(image.id, 'alt', e.target.value)}
        className="w-full text-xs px-1 py-0.5 border-t border-gray-200 focus:outline-none focus:border-blue-400"
      />
    </div>
  );
}

/**
 * 드롭 가능한 영역 컴포넌트
 */
interface DropZoneProps {
  rowId: string;
  columns: number;
  isEmpty: boolean;
  children: React.ReactNode;
}

function DropZone({ rowId, isOver, children }: { rowId: string; isOver?: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver: isOverDropZone } = useDroppable({
    id: rowId,
  });
  console.log('[DropZone] Created with rowId:', rowId);

  const over = isOverDropZone;

  return (
    <div
      ref={setNodeRef}
      className={`transition-all ${over ? 'ring-2 ring-green-400 bg-green-50 rounded' : ''}`}
    >
      {children}
    </div>
  );
}

/**
 * 행 단위 배치 시스템
 * 각 행에 이미지들을 드래그해서 배치
 */
export default function ImageGridBlockEditor({
  block,
  onChange,
  onRemove,
}: ImageGridBlockEditorProps) {
  const [localBlock, setLocalBlock] = useState(block);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 이미지 제거
  const handleRemoveImage = (imageId: string) => {
    const updated = {
      ...localBlock,
      images: localBlock.images.filter((img) => img.id !== imageId),
      rows: localBlock.rows.map((row) => ({
        ...row,
        imageCount: row.imageCount - (row.imageCount > 0 ? 1 : 0),
      })),
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  // 이미지 업데이트
  const handleUpdateImage = (imageId: string, field: keyof ImageData, value: string) => {
    const updated = {
      ...localBlock,
      images: localBlock.images.map((img) =>
        img.id === imageId ? { ...img, [field]: value } : img
      ),
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  // 이미지 추가
  const handleAddImage = () => {
    const newImage: ImageData = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: '',
      alt: '',
    };
    const updated = {
      ...localBlock,
      images: [...localBlock.images, newImage],
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  // 행 추가
  const handleAddRow = () => {
    const newRow: ImageGridRow = {
      id: `row-${Date.now()}`,
      columns: 1,
      imageCount: 0,
    };
    const updated = {
      ...localBlock,
      rows: [...localBlock.rows, newRow],
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  // 행 삭제
  const handleDeleteRow = (rowId: string) => {
    const updated = {
      ...localBlock,
      rows: localBlock.rows.filter((r) => r.id !== rowId),
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  // 행의 열 개수 변경
  const handleUpdateRowColumns = (rowId: string, columns: 1 | 2 | 3) => {
    const updated = {
      ...localBlock,
      rows: localBlock.rows.map((row) =>
        row.id === rowId ? { ...row, columns } : row
      ),
    };
    setLocalBlock(updated);
    onChange(updated);
  };

  // 드래그 끝
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('[ImageGridBlockEditor] Drag ended:', { activeId: active.id, overId: over?.id });
    setActiveId(null);

    if (!over) {
      console.log('[ImageGridBlockEditor] No drop target');
      return;
    }

    const draggedImageId = active.id as string;
    const draggedImage = localBlock.images.find((img) => img.id === draggedImageId);
    if (!draggedImage) {
      console.log('[ImageGridBlockEditor] Dragged image not found:', draggedImageId);
      return;
    }

    // over.id가 드롭된 행의 ID
    const targetRowId = over.id as string;
    console.log('[ImageGridBlockEditor] Target row ID:', targetRowId);
    console.log('[ImageGridBlockEditor] Available row IDs:', localBlock.rows.map((r) => r.id));

    // "available-images"면 그 자리 유지
    if (targetRowId === 'available-images') {
      console.log('[ImageGridBlockEditor] Dropped on available images - keeping in place');
      return;
    }

    const isValidRow = localBlock.rows.some((row) => row.id === targetRowId);
    console.log('[ImageGridBlockEditor] Is valid row?', isValidRow);

    if (targetRowId && isValidRow) {
      // 1. 각 행에서 이 이미지가 있는지 확인 (이미지가 어느 행에 속하는지 찾기)
      let imageIdx = 0;
      let sourceRowId: string | null = null;
      for (const row of localBlock.rows) {
        const startIdx = imageIdx;
        const endIdx = imageIdx + row.imageCount;
        if (localBlock.images.slice(startIdx, endIdx).some((img) => img.id === draggedImageId)) {
          sourceRowId = row.id;
          break;
        }
        imageIdx = endIdx;
      }

      console.log('[ImageGridBlockEditor] Source row ID:', sourceRowId);

      // 2. 행 업데이트
      const newRows = localBlock.rows.map((row) => {
        if (row.id === sourceRowId && sourceRowId !== targetRowId) {
          // 원래 행: imageCount 감소 (Available에서 온 경우 sourceRowId가 null)
          if (sourceRowId) {
            return { ...row, imageCount: Math.max(0, row.imageCount - 1) };
          }
        }
        if (row.id === targetRowId) {
          // 대상 행: imageCount 증가
          return { ...row, imageCount: row.imageCount + 1 };
        }
        return row;
      });

      const updated = { ...localBlock, rows: newRows };
      setLocalBlock(updated);
      onChange(updated);
      console.log('[ImageGridBlockEditor] Image moved successfully', { sourceRowId, targetRowId });
    }
  };

  const handleDragStart = (event: any) => {
    console.log('[ImageGridBlockEditor] Drag started:', event.active.id);
    setActiveId(event.active.id);
  };

  const draggedImage = activeId && localBlock.images.find((img) => img.id === activeId);

  // 각 행의 이미지 계산
  const getRowImages = (rowIndex: number): ImageData[] => {
    let imageIdx = 0;
    for (let i = 0; i < rowIndex; i++) {
      imageIdx += localBlock.rows[i].imageCount;
    }
    const row = localBlock.rows[rowIndex];
    return localBlock.images.slice(imageIdx, imageIdx + row.imageCount);
  };

  return (
    <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          Image Grid ({localBlock.images.length} images)
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Row-based Layout */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* All sortable items (rows + available) */}
        <SortableContext items={localBlock.images.map((img) => img.id)}>
          <div className="space-y-2">
            {localBlock.rows.map((row, rowIdx) => {
              const rowImages = getRowImages(rowIdx);

              return (
                <div
                  key={row.id}
                  className="bg-white p-2 rounded border border-gray-200 space-y-2"
                >
                  {/* Row Header */}
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-gray-600 flex-1">
                      Row {rowIdx + 1} ({row.columns} col{row.columns > 1 ? 's' : ''},{' '}
                      {rowImages.length} img{rowImages.length !== 1 ? 's' : ''})
                    </div>

                    {/* Column Selector */}
                    <select
                      value={row.columns}
                      onChange={(e) =>
                        handleUpdateRowColumns(row.id, parseInt(e.target.value) as 1 | 2 | 3)
                      }
                      className="text-xs px-1.5 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    >
                      <option value="1">1 Column</option>
                      <option value="2">2 Columns</option>
                      <option value="3">3 Columns</option>
                    </select>

                    {/* Delete Row */}
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-0.5 text-gray-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Drop Zone */}
                  <DropZone rowId={row.id}>
                    <div
                      className={`grid gap-2 p-2 bg-gray-50 rounded border-2 border-dashed transition-colors ${
                        rowImages.length > 0 ? 'border-blue-300' : 'border-gray-300'
                      }`}
                      style={{
                        gridTemplateColumns: `repeat(${row.columns}, 1fr)`,
                      }}
                    >
                    {rowImages.length > 0 ? (
                      rowImages.map((image) => (
                        <DraggableImageItem
                          key={image.id}
                          image={image}
                          rowId={row.id}
                          onRemove={handleRemoveImage}
                          onUpdateImage={handleUpdateImage}
                        />
                      ))
                    ) : (
                      <div className="text-center text-xs text-gray-400 py-2 col-span-full">
                        Drag images here ⬇️
                      </div>
                    )}
                    </div>
                  </DropZone>
                </div>
              );
            })}
          </div>

          {/* Images Pool - INSIDE SortableContext for proper drag-drop */}
          <DropZone rowId="available-images">
          <div className="bg-white p-2 rounded border border-gray-200 space-y-2">
              <div className="text-xs font-medium text-gray-700">
                Available Images ({localBlock.images.filter((img) => {
                  return !localBlock.rows.some((row) => {
                    const rowImages = getRowImages(
                      localBlock.rows.findIndex((r) => r.id === row.id)
                    );
                    return rowImages.some((m) => m.id === img.id);
                  });
                }).length})
              </div>

              {localBlock.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-1 max-h-40 overflow-y-auto">
                  {localBlock.images.map((image) => {
                    const isAssigned = localBlock.rows.some((row) => {
                      const rowImages = getRowImages(
                        localBlock.rows.findIndex((r) => r.id === row.id)
                      );
                      return rowImages.some((img) => img.id === image.id);
                    });

                    if (isAssigned) return null; // 배치된 이미지는 표시 안 함

                    return (
                      <DraggableImageItem
                        key={image.id}
                        image={image}
                        rowId="available"
                        onRemove={handleRemoveImage}
                        onUpdateImage={handleUpdateImage}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-400 text-center py-3">No images yet</div>
              )}

              {/* Add Image Button */}
              <button
                type="button"
                onClick={handleAddImage}
                className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs text-gray-600 border border-dashed border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                <Plus size={12} />
                Add Image
              </button>
          </div>
          </DropZone>
        </SortableContext>

        {/* Add Row Button - Outside SortableContext (not draggable) */}
        <button
          type="button"
          onClick={handleAddRow}
          className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-600 border border-dashed border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          <Plus size={14} />
          Add Row
        </button>

        <DragOverlay>
          {draggedImage ? (
            <div className="w-24 h-24 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-1">
              {draggedImage.url && (
                <img
                  src={draggedImage.url}
                  alt={draggedImage.alt}
                  className="w-full h-16 object-cover rounded mb-0.5"
                />
              )}
              <p className="text-[10px] text-gray-600 truncate">{draggedImage.alt || 'Img'}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
