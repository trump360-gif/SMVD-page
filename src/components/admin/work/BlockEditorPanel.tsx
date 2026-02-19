'use client';

import React, { memo } from 'react';
import { Trash2, FileText, RotateCcw, RotateCw } from 'lucide-react';
import type { Block } from '@/components/admin/shared/BlockEditor/types';

// Import all 14 block editors
import TextBlockEditor from '@/components/admin/shared/BlockEditor/blocks/TextBlockEditor';
import HeadingBlockEditor from '@/components/admin/shared/BlockEditor/blocks/HeadingBlockEditor';
import ImageBlockEditor from '@/components/admin/shared/BlockEditor/blocks/ImageBlockEditor';
import GalleryBlockEditor from '@/components/admin/shared/BlockEditor/blocks/GalleryBlockEditor';
import SpacerBlockEditor from '@/components/admin/shared/BlockEditor/blocks/SpacerBlockEditor';
import DividerBlockEditor from '@/components/admin/shared/BlockEditor/blocks/DividerBlockEditor';
import HeroImageBlockEditor from '@/components/admin/shared/BlockEditor/blocks/HeroImageBlockEditor';
import HeroSectionBlockEditor from '@/components/admin/shared/BlockEditor/blocks/HeroSectionBlockEditor';
import WorkTitleBlockEditor from '@/components/admin/shared/BlockEditor/blocks/WorkTitleBlockEditor';
import WorkMetadataBlockEditor from '@/components/admin/shared/BlockEditor/blocks/WorkMetadataBlockEditor';
import WorkLayoutConfigBlockEditor from '@/components/admin/shared/BlockEditor/blocks/WorkLayoutConfigBlockEditor';
import LayoutRowBlockEditor from '@/components/admin/shared/BlockEditor/blocks/LayoutRowBlockEditor';
import LayoutGridBlockEditor from '@/components/admin/shared/BlockEditor/blocks/LayoutGridBlockEditor';
import ImageRowBlockEditor from '@/components/admin/shared/BlockEditor/blocks/ImageRowBlockEditor';
import ImageGridBlockEditor from '@/components/admin/shared/BlockEditor/blocks/ImageGridBlockEditor';

interface BlockEditorPanelProps {
  block: Block | null;
  onChange: (id: string, data: Partial<Block>) => void;
  onDelete: (id: string) => void;
  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

// 블록 타입별 라벨
const BLOCK_LABELS: Record<string, string> = {
  text: '텍스트',
  heading: '제목',
  image: '이미지',
  gallery: '갤러리',
  spacer: '여백',
  divider: '구분선',
  'hero-image': '히어로 이미지',
  'hero-section': '히어로 섹션',
  'work-title': '작품명 + 작가',
  'work-metadata': '작가 정보',
  'work-layout-config': '레이아웃 설정',
  'layout-row': '행 레이아웃',
  'layout-grid': '그리드 레이아웃',
  'image-row': '이미지 행',
  'image-grid': '이미지 그리드',
};

/**
 * EmptyState - 블록이 선택되지 않았을 때 표시
 */
const EmptyState = memo(function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <FileText size={64} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">선택된 블록이 없습니다</h3>
      <p className="text-sm text-gray-400">
        왼쪽의 블록을 클릭하여 편집하세요
      </p>
    </div>
  );
});

/**
 * 선택된 블록의 에디터를 렌더링
 */
function renderBlockEditor(
  block: Block,
  onUpdate: (data: Partial<Block>) => void
): React.ReactNode {
  const handleChange = (data: Partial<Block>) => {
    onUpdate(data);
  };

  // @ts-ignore - Type casting for specific block types
  switch (block.type) {
    case 'text':
      return <TextBlockEditor block={block} onChange={handleChange} />;
    case 'heading':
      return <HeadingBlockEditor block={block} onChange={handleChange} />;
    case 'image':
      return <ImageBlockEditor block={block} onChange={handleChange} />;
    case 'gallery':
      return <GalleryBlockEditor block={block} onChange={handleChange} />;
    case 'spacer':
      return <SpacerBlockEditor block={block} onChange={handleChange} />;
    case 'divider':
      return <DividerBlockEditor block={block} onChange={handleChange} />;
    case 'hero-image':
      return <HeroImageBlockEditor block={block} onChange={handleChange} />;
    case 'hero-section':
      return <HeroSectionBlockEditor block={block} onChange={handleChange} />;
    case 'work-title':
      return <WorkTitleBlockEditor block={block} onChange={handleChange} />;
    case 'work-metadata':
      return <WorkMetadataBlockEditor block={block} onChange={handleChange} />;
    case 'work-layout-config':
      return <WorkLayoutConfigBlockEditor block={block} onChange={handleChange} />;
    case 'layout-row':
      return <LayoutRowBlockEditor block={block} onChange={handleChange} />;
    case 'layout-grid':
      return <LayoutGridBlockEditor block={block} onChange={handleChange} />;
    case 'image-row':
      return <ImageRowBlockEditor block={block} onChange={handleChange} onRemove={() => {}} />;
    case 'image-grid':
      return <ImageGridBlockEditor block={block} onChange={handleChange} onRemove={() => {}} />;
    default:
      // TypeScript exhaustive check
      const _exhaustive: never = block;
      return null;
  }
}

/**
 * BlockEditorPanel - 중앙 패널: 선택된 블록의 상세 편집
 */
export default memo(function BlockEditorPanel({
  block,
  onChange,
  onDelete,
  undo,
  redo,
  canUndo,
  canRedo,
}: BlockEditorPanelProps) {
  if (!block) {
    return <EmptyState />;
  }

  const blockLabel = BLOCK_LABELS[block.type] || block.type;
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(block.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleUpdate = (data: Partial<Block>) => {
    onChange(block.id, data);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">편집: {blockLabel}</span>
        </div>

        {/* Undo/Redo & Delete Buttons */}
        <div className="flex items-center gap-2">
          {/* Undo Button */}
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo
                ? 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="되돌리기 (Ctrl+Z)"
            aria-label="되돌리기"
          >
            <RotateCcw size={16} />
          </button>

          {/* Redo Button */}
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo
                ? 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="다시하기 (Ctrl+Y)"
            aria-label="다시하기"
          >
            <RotateCw size={16} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            onBlur={() => setShowDeleteConfirm(false)}
          aria-label={showDeleteConfirm ? '블록 삭제 확인' : '블록 삭제'}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-200
            ${
              showDeleteConfirm
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }
          `}
          title={showDeleteConfirm ? '다시 클릭하여 삭제 확인' : '블록 삭제'}
        >
          <Trash2 size={14} />
          {showDeleteConfirm && <span className="text-xs font-medium">확인</span>}
        </button>
        </div>
      </div>

      {/* Block Editor Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4">
        {renderBlockEditor(block, handleUpdate)}
      </div>
    </div>
  );
});
