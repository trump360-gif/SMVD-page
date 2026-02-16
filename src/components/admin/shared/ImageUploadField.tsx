'use client';

import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  /** 선택된 이미지 URL (경로) */
  imageUrl: string | null;
  /** 이미지 URL 변경 콜백 */
  onImageChange: (url: string | null) => void;
  /** 업로드 중 상태 */
  isLoading?: boolean;
  /** 라벨 텍스트 */
  label?: string;
}

/**
 * 드래그앤드롭 + 파일 선택을 지원하는 이미지 업로드 필드
 * ExhibitionItemModal의 업로드 로직을 재사용
 */
export default function ImageUploadField({
  imageUrl,
  onImageChange,
  isLoading = false,
  label = 'Upload Image',
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (file: File) => {
    // 파일 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '이미지 업로드 실패');
      }

      // 업로드된 이미지 경로 설정
      onImageChange(data.data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드 실패');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-gray-600">
          {label}
        </label>
      )}

      {imageUrl ? (
        <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-32 object-cover"
          />
          <button
            type="button"
            onClick={() => onImageChange(null)}
            disabled={isLoading || isUploading}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDragAreaClick}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          } ${isLoading || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            disabled={isLoading || isUploading}
            className="hidden"
          />
          <div className="cursor-pointer block">
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              이미지를 드래그하거나 클릭하여 선택
            </p>
            {isUploading && (
              <p className="text-xs text-blue-600 mt-1">업로드 중...</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex gap-2 items-start p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={14} className="text-red-600 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
