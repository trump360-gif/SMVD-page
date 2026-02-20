'use client';

import ImageUploadField from '@/components/admin/shared/ImageUploadField';

const CATEGORIES = ['UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'];

interface WorkBasicInfoFormProps {
  title: string;
  subtitle: string;
  category: string;
  tags: string;
  author: string;
  email: string;
  year: string;
  description: string; // NEW - 2026-02-20
  thumbnailImage: string;
  published: boolean;
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onDescriptionChange: (value: string) => void; // NEW - 2026-02-20
  onThumbnailImageChange: (value: string | null) => void;
  onPublishedChange: (value: boolean) => void;
}

export default function WorkBasicInfoForm({
  title,
  subtitle,
  category,
  tags,
  author,
  email,
  year,
  description, // NEW - 2026-02-20
  thumbnailImage,
  published,
  isEditing,
  onTitleChange,
  onSubtitleChange,
  onCategoryChange,
  onTagsChange,
  onAuthorChange,
  onEmailChange,
  onYearChange,
  onDescriptionChange, // NEW - 2026-02-20
  onThumbnailImageChange,
  onPublishedChange,
}: WorkBasicInfoFormProps) {
  return (
    <div className="space-y-5 max-w-3xl p-6">
      {/* Title + Category */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label htmlFor="wb-title" className="block text-sm font-medium text-gray-700 mb-1">
            제목 *
          </label>
          <input
            id="wb-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="작품명"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="wb-category" className="block text-sm font-medium text-gray-700 mb-1">
            카테고리 *
          </label>
          <select
            id="wb-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            <option value="">선택하세요</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subtitle */}
      <div>
        <label htmlFor="wb-subtitle" className="block text-sm font-medium text-gray-700 mb-1">
          부제목 *
        </label>
        <input
          id="wb-subtitle"
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="작가명, 2025"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Author + Email + Year */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="wb-author" className="block text-sm font-medium text-gray-700 mb-1">
            작가 *
          </label>
          <input
            id="wb-author"
            type="text"
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            placeholder="작가명"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="wb-email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일 *
          </label>
          <input
            id="wb-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="contact@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="wb-year" className="block text-sm font-medium text-gray-700 mb-1">
            연도
          </label>
          <input
            id="wb-year"
            type="text"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            placeholder="2025"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="wb-tags" className="block text-sm font-medium text-gray-700 mb-1">
          태그 (쉼표로 구분)
        </label>
        <input
          id="wb-tags"
          type="text"
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="UX/UI, 브랜딩, 모션"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
        {tags && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {tags.split(',').map((t, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full"
              >
                {t.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description - NEW 2026-02-20 */}
      <div>
        <label htmlFor="wb-description" className="block text-sm font-medium text-gray-700 mb-1">
          프로젝트 설명
        </label>
        <textarea
          id="wb-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="프로젝트에 대한 간단한 설명을 입력하세요..."
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-vertical"
        />
        <p className="text-xs text-gray-400 mt-1">
          공개 페이지의 우측 컬럼에 표시됩니다.
        </p>
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          썸네일 {!isEditing && '*'}
        </label>
        <ImageUploadField
          imageUrl={thumbnailImage}
          onImageChange={onThumbnailImageChange}
          label="썸네일 이미지 (드래그앤드롭 또는 클릭)"
        />
        <p className="text-xs text-gray-400 mt-2">
          히어로 이미지는 콘텐츠 (블록) 탭에서 히어로 이미지 블록을 사용하여 관리됩니다.
        </p>
      </div>

      {/* Published */}
      <div className="flex items-center gap-2 pt-2">
        <input
          id="wb-published"
          type="checkbox"
          checked={published}
          onChange={(e) => onPublishedChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="wb-published" className="text-sm font-medium text-gray-700">
          공개 (공개 상태)
        </label>
      </div>
    </div>
  );
}
