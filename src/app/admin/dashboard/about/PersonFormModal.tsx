'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AboutPerson } from '@/hooks/useAboutEditor';
import Image from 'next/image';

interface PersonFormModalProps {
  isOpen: boolean;
  person: AboutPerson | null;
  role: 'professor' | 'instructor';
  onClose: () => void;
  onSubmit: (data: Omit<AboutPerson, 'id' | 'order'>) => Promise<void>;
}

const EMPTY_PROFESSOR_FORM: Omit<AboutPerson, 'id' | 'order'> = {
  name: '',
  title: '',
  role: 'professor',
  office: '',
  email: [],
  phone: '',
  major: '',
  specialty: '',
  badge: '',
  profileImage: '',
  courses: {
    undergraduate: [],
    graduate: [],
  },
  biography: {
    cvText: '',
    position: '',
    education: [],
    experience: [],
  },
};

const EMPTY_INSTRUCTOR_FORM: Omit<AboutPerson, 'id' | 'order'> = {
  name: '',
  title: '',
  role: 'instructor',
  office: '',
  email: [],
  phone: '',
  major: '',
  specialty: '',
  badge: '',
  profileImage: '',
  courses: {
    undergraduate: [],
    graduate: [],
  },
  biography: {
    cvText: '',
    position: '',
    education: [],
    experience: [],
  },
};

export default function PersonFormModal({
  isOpen,
  person,
  role,
  onClose,
  onSubmit,
}: PersonFormModalProps) {
  const emptyForm = role === 'professor' ? EMPTY_PROFESSOR_FORM : EMPTY_INSTRUCTOR_FORM;
  const [form, setForm] = useState(emptyForm);
  const [emailText, setEmailText] = useState('');
  const [undergraduateText, setUndergraduateText] = useState('');
  const [graduateText, setGraduateText] = useState('');
  const [educationText, setEducationText] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 파일 업로드 상태
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!person;

  useEffect(() => {
    if (isOpen && person) {
      setForm({
        name: person.name,
        title: person.title,
        role: person.role || role,
        office: person.office || '',
        email: person.email || [],
        phone: person.phone || '',
        major: person.major || '',
        specialty: person.specialty || '',
        badge: person.badge || '',
        profileImage: person.profileImage || '',
        courses: person.courses || { undergraduate: [], graduate: [] },
        biography: person.biography || {
          cvText: '',
          position: '',
          education: [],
          experience: [],
        },
      });
      setEmailText((person.email || []).join(', '));
      setUndergraduateText(
        (person.courses?.undergraduate || []).join(', ')
      );
      setGraduateText((person.courses?.graduate || []).join(', '));
      setEducationText(
        (person.biography?.education || []).join('\n')
      );
      setExperienceText(
        (person.biography?.experience || []).join('\n')
      );
      // 기존 이미지 미리보기 설정
      if (person.profileImage) {
        setProfileImagePreview(person.profileImage);
      }
    } else if (isOpen && !person) {
      setForm(emptyForm);
      setEmailText('');
      setUndergraduateText('');
      setGraduateText('');
      setEducationText('');
      setExperienceText('');
      setProfileImageFile(null);
      setProfileImagePreview('');
      setCvFile(null);
    }
  }, [isOpen, person, role, emptyForm]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // 프로필 이미지 파일 선택
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      // 이미지 파일 타입 확인
      if (!file.type.startsWith('image/')) {
        setUploadError('이미지 파일만 업로드 가능합니다');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('파일 크기는 5MB 이하여야 합니다');
        return;
      }
      setProfileImageFile(file);
      setUploadError(null);

      // 미리보기
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 업로드
  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImageFile) return null;

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', profileImageFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '이미지 업로드 실패');
      }

      setProfileImageFile(null);
      return data.data.path; // 경로 반환
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '이미지 업로드 실패');
      throw err;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // CV 파일 선택
  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      // PDF 또는 문서 파일만 허용
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('PDF 또는 Word 문서만 업로드 가능합니다');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('파일 크기는 10MB 이하여야 합니다');
        return;
      }
      setCvFile(file);
      setUploadError(null);
    }
  };

  // CV 파일 업로드
  const uploadCvFile = async (): Promise<string | null> => {
    if (!cvFile) return null;

    setIsUploadingCv(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', cvFile);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'CV 파일 업로드 실패');
      }

      setCvFile(null);
      return data.data.path; // 경로 반환
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'CV 파일 업로드 실패');
      throw err;
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleSubmit = async () => {
    if (role === 'instructor') {
      if (!form.name.trim()) {
        alert('이름은 필수 입력입니다.');
        return;
      }
    } else {
      if (!form.name.trim() || !form.title.trim()) {
        alert('이름과 직함은 필수 입력입니다.');
        return;
      }
    }

    try {
      setIsSaving(true);
      setUploadError(null);

      // 프로필 이미지 파일이 선택되었으면 업로드
      let profileImagePath = form.profileImage || '';
      if (profileImageFile) {
        const uploadedPath = await uploadProfileImage();
        if (uploadedPath) {
          profileImagePath = uploadedPath;
        }
      }

      // CV 파일이 선택되었으면 업로드
      let cvFilePath = form.biography?.cvText || '';
      if (cvFile) {
        const uploadedPath = await uploadCvFile();
        if (uploadedPath) {
          cvFilePath = uploadedPath;
        }
      }

      const data: Omit<AboutPerson, 'id' | 'order'> = role === 'instructor'
        ? {
            name: form.name,
            title: form.title,
            role: 'instructor',
            email: [],
            office: '',
            phone: '',
            major: '',
            specialty: form.specialty || '',
            badge: '',
            profileImage: '',
            courses: { undergraduate: [], graduate: [] },
            biography: {
              cvText: '',
              position: '',
              education: [],
              experience: [],
            },
          }
        : {
            ...form,
            role: 'professor',
            email: emailText
              .split(',')
              .map((e) => e.trim())
              .filter(Boolean),
            profileImage: profileImagePath, // 업로드된 이미지 경로 사용
            courses: {
              undergraduate: undergraduateText
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
              graduate: graduateText
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
            },
            biography: {
              cvText: cvFilePath, // 업로드된 CV 경로 사용
              position: form.biography?.position || '',
              education: educationText
                .split('\n')
                .map((e) => e.trim())
                .filter(Boolean),
              experience: experienceText
                .split('\n')
                .map((e) => e.trim())
                .filter(Boolean),
            },
          };
      await onSubmit(data);
    } catch {
      // Error handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? '교수/강사 수정' : '새로운 교수/강사 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &#215;
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 에러 메시지 */}
          {uploadError && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {uploadError}
            </div>
          )}

          {/* INSTRUCTOR FORM (Simple) */}
          {role === 'instructor' ? (
            <>
              {/* Instructor: 이름 + 전문분야 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="강사명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전문분야
                </label>
                <input
                  type="text"
                  value={form.specialty || ''}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="기초그래픽디자인 I/II"
                />
              </div>
            </>
          ) : (
            <>
              {/* PROFESSOR FORM (Complex) */}
              {/* ===== Our People 페이지 정보 ===== */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-bold text-blue-900 mb-4">
                  📄 Our People 페이지 정보
                </h3>

                {/* 이름 */}
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

                {/* 프로필 이미지 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    프로필 이미지
                  </label>

                  {/* 이미지 미리보기 */}
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
                        {profileImageFile && <p className="text-xs text-blue-600">{profileImageFile.name}</p>}
                      </div>
                    </div>
                  )}

                  {/* 파일 입력 */}
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

                  {/* 업로드 버튼 */}
                  {profileImageFile && (
                    <button
                      type="button"
                      onClick={uploadProfileImage}
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

                {/* 담당과목 */}
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

              {/* ===== 상세 페이지 정보 ===== */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-green-900 mb-4">
                  📝 교수 상세 페이지 정보
                </h3>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      직함 *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="교수"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      뱃지
                    </label>
                    <input
                      type="text"
                      value={form.badge || ''}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Research & Mentoring"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    연락처 정보
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        연구실
                      </label>
                      <input
                        type="text"
                        value={form.office || ''}
                        onChange={(e) =>
                          setForm({ ...form, office: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="미술대학 711호"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        이메일 (쉼표로 구분)
                      </label>
                      <input
                        type="text"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="professor@sookmyung.ac.kr, name@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        전화
                      </label>
                      <input
                        type="text"
                        value={form.phone || ''}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="02-710-XXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    학과 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        전공
                      </label>
                      <input
                        type="text"
                        value={form.major || ''}
                        onChange={(e) =>
                          setForm({ ...form, major: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="시각디자인"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        전문분야
                      </label>
                      <input
                        type="text"
                        value={form.specialty || ''}
                        onChange={(e) =>
                          setForm({ ...form, specialty: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="UX/UI Design"
                      />
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    약력
                  </h4>
                  <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CV 파일 업로드
                  </label>

                  {/* 업로드된 CV 파일 표시 */}
                  {form.biography?.cvText && (
                    <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        📄 CV 파일 업로드됨
                      </span>
                      <a
                        href={form.biography.cvText}
                        download
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        다운로드
                      </a>
                    </div>
                  )}

                  {/* 파일 입력 */}
                  <div className="flex gap-2 mb-2">
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvFileChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      선택
                    </button>
                  </div>

                  {/* 업로드 버튼 */}
                  {cvFile && (
                    <button
                      type="button"
                      onClick={uploadCvFile}
                      disabled={isUploadingCv}
                      className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {isUploadingCv ? '업로드 중...' : 'CV 파일 업로드'}
                    </button>
                  )}

                  {cvFile && (
                    <p className="text-xs text-gray-600 mt-2">
                      선택: {cvFile.name}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    PDF, Word (최대 10MB)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    직책
                  </label>
                  <input
                    type="text"
                    value={form.biography?.position || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        biography: {
                          ...form.biography!,
                          position: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="시각영상디자인학과 교수"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학력 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={educationText}
                  onChange={(e) => setEducationText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="숙명여자대학교 시각디자인학과 학사&#10;서울대학교 디자인학과 석사"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  경력 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="2020 - 현재 숙명여자대학교 교수&#10;2015 - 2020 삼성전자 디자인센터"
                />
              </div>
            </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {isSaving
              ? '저장 중...'
              : isEditing
                ? '수정 저장'
                : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
}
