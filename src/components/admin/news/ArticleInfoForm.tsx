'use client';

const CATEGORIES = ['Notice', 'Event', 'Awards', 'Recruiting'];

interface ArticleInfoFormProps {
  title: string;
  category: string;
  excerpt: string;
  thumbnailImage: string;
  publishedAt: string;
  published: boolean;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onThumbnailImageChange: (value: string) => void;
  onPublishedAtChange: (value: string) => void;
  onPublishedChange: (value: boolean) => void;
}

export default function ArticleInfoForm({
  title,
  category,
  excerpt,
  thumbnailImage,
  publishedAt,
  published,
  onTitleChange,
  onCategoryChange,
  onExcerptChange,
  onThumbnailImageChange,
  onPublishedAtChange,
  onPublishedChange,
}: ArticleInfoFormProps) {
  return (
    <div className="space-y-5 max-w-3xl p-6">
      {/* Title + Category */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label htmlFor="nb-title" className="block text-sm font-medium text-gray-700 mb-1">
            제목 *
          </label>
          <input
            id="nb-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="기사 제목"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="nb-category" className="block text-sm font-medium text-gray-700 mb-1">
            카테고리 *
          </label>
          <select
            id="nb-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="nb-excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          요약 (목록에 표시됨)
        </label>
        <textarea
          id="nb-excerpt"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="목록 보기에 표시할 간단한 설명 (최대 2줄)..."
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y"
        />
      </div>

      {/* Thumbnail + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nb-thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
            썸네일
          </label>
          <input
            id="nb-thumbnail"
            type="text"
            value={thumbnailImage}
            onChange={(e) => onThumbnailImageChange(e.target.value)}
            placeholder="/Group-27.svg"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          {thumbnailImage && (
            <div className="mt-2 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              <img src={thumbnailImage} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="nb-date" className="block text-sm font-medium text-gray-700 mb-1">
            발행 날짜
          </label>
          <input
            id="nb-date"
            type="date"
            value={publishedAt}
            onChange={(e) => onPublishedAtChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Published */}
      <div className="flex items-center gap-2 pt-2">
        <input
          id="nb-published"
          type="checkbox"
          checked={published}
          onChange={(e) => onPublishedChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="nb-published" className="text-sm font-medium text-gray-700">
          공개 (공개 상태)
        </label>
      </div>
    </div>
  );
}
