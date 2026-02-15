'use client';

import React from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { GalleryData } from '@/hooks/useNewsEditor';

interface GalleryEditorProps {
  gallery: GalleryData;
  onChange: (gallery: GalleryData) => void;
}

function ImageSlot({
  label,
  value,
  onChange,
  aspectRatio,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspectRatio?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 hover:border-blue-400 transition-colors"
        style={{ aspectRatio: aspectRatio || '1', minHeight: '80px' }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
              title="이미지 제거"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 p-2">
            <ImagePlus size={20} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">경로 입력</span>
          </div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/news/..."
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}

export default function GalleryEditor({ gallery, onChange }: GalleryEditorProps) {
  const updateField = (field: keyof GalleryData, value: string) => {
    onChange({ ...gallery, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          복합 갤러리 (1+2+3 레이아웃)
        </h4>
        <span className="text-xs text-gray-400">
          메인 1 + 센터 2 + 하단 3
        </span>
      </div>

      {/* Layout Preview */}
      <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
        {/* Main Image (full width) */}
        <ImageSlot
          label="메인 이미지 (전폭)"
          value={gallery.main}
          onChange={(v) => updateField('main', v)}
          aspectRatio="16/9"
        />

        {/* Center 2 Images (50/50) */}
        <div className="grid grid-cols-2 gap-2">
          <ImageSlot
            label="센터 좌측"
            value={gallery.centerLeft}
            onChange={(v) => updateField('centerLeft', v)}
          />
          <ImageSlot
            label="센터 우측"
            value={gallery.centerRight}
            onChange={(v) => updateField('centerRight', v)}
          />
        </div>

        {/* Bottom 3 Images (33/33/33) */}
        <div className="grid grid-cols-3 gap-2">
          <ImageSlot
            label="하단 좌측"
            value={gallery.bottomLeft}
            onChange={(v) => updateField('bottomLeft', v)}
          />
          <ImageSlot
            label="하단 중앙"
            value={gallery.bottomCenter}
            onChange={(v) => updateField('bottomCenter', v)}
          />
          <ImageSlot
            label="하단 우측"
            value={gallery.bottomRight}
            onChange={(v) => updateField('bottomRight', v)}
          />
        </div>
      </div>
    </div>
  );
}
