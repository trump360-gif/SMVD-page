import Image from 'next/image';
import type { PersonFormData } from './types';

interface BasicInfoFieldsProps {
  form: PersonFormData;
  setForm: (form: PersonFormData) => void;
  undergraduateText: string;
  setUndergraduateText: (v: string) => void;
  graduateText: string;
  setGraduateText: (v: string) => void;
  profileImagePreview: string;
  profileImageFile: File | null;
  profileImageInputRef: React.RefObject<HTMLInputElement | null>;
  isUploadingImage: boolean;
  handleProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadProfileImage: () => Promise<string | null>;
}

export default function BasicInfoFields({
  form,
  setForm,
  undergraduateText,
  setUndergraduateText,
  graduateText,
  setGraduateText,
  profileImagePreview,
  profileImageFile,
  profileImageInputRef,
  isUploadingImage,
  handleProfileImageChange,
  uploadProfileImage,
}: BasicInfoFieldsProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-bold text-blue-900 mb-4">
        Our People 페이지 정보
      </h3>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이름 *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="홍길동"
        />
      </div>

      {/* Profile Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          프로필 이미지
        </label>
        {profileImagePreview && (
          <div className="mb-3 flex items-center gap-3">
            <div className="relative w-24 h-24">
              <Image
                src={profileImagePreview}
                alt="프로필 미리보기"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">현재 이미지</p>
              {profileImageFile && (
                <p className="text-xs text-blue-600">
                  {profileImageFile.name}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-2 mb-2">
          <input
            ref={profileImageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleProfileImageChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={() => profileImageInputRef.current?.click()}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
          >
            선택
          </button>
        </div>
        {profileImageFile && (
          <button
            type="button"
            onClick={() => uploadProfileImage()}
            disabled={isUploadingImage}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isUploadingImage ? '업로드 중...' : '이미지 업로드'}
          </button>
        )}
        <p className="text-xs text-gray-500 mt-2">
          JPEG, PNG, WebP, GIF (최대 5MB)
        </p>
      </div>

      {/* Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          담당과목
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              학사과정 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={undergraduateText}
              onChange={(e) => setUndergraduateText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="기초디자인, 타이포그래피, 편집디자인"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              석사과정 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={graduateText}
              onChange={(e) => setGraduateText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="디자인연구, 고급편집디자인"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
