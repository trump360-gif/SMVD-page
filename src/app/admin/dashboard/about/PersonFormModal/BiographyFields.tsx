import type { PersonFormData } from './types';

interface BiographyFieldsProps {
  form: PersonFormData;
  setForm: (form: PersonFormData) => void;
  emailText: string;
  setEmailText: (v: string) => void;
  educationText: string;
  setEducationText: (v: string) => void;
  experienceText: string;
  setExperienceText: (v: string) => void;
  cvFile: File | null;
  cvInputRef: React.RefObject<HTMLInputElement | null>;
  isUploadingCv: boolean;
  handleCvFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadCvFile: () => Promise<string | null>;
}

export default function BiographyFields({
  form,
  setForm,
  emailText,
  setEmailText,
  educationText,
  setEducationText,
  experienceText,
  setExperienceText,
  cvFile,
  cvInputRef,
  isUploadingCv,
  handleCvFileChange,
  uploadCvFile,
}: BiographyFieldsProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-sm font-bold text-green-900 mb-4">
        교수 상세 페이지 정보
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
        <h4 className="text-sm font-medium text-gray-700 mb-3">연락처 정보</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              연구실
            </label>
            <input
              type="text"
              value={form.office || ''}
              onChange={(e) => setForm({ ...form, office: e.target.value })}
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
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="02-710-XXXX"
            />
          </div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">학과 정보</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              전공
            </label>
            <input
              type="text"
              value={form.major || ''}
              onChange={(e) => setForm({ ...form, major: e.target.value })}
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
        <h4 className="text-sm font-medium text-gray-700 mb-3">약력</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV 파일 업로드
              </label>
              {form.biography?.cvText && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-700">CV 파일 업로드됨</span>
                  <a
                    href={form.biography.cvText}
                    download
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    다운로드
                  </a>
                </div>
              )}
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
              {cvFile && (
                <button
                  type="button"
                  onClick={() => uploadCvFile()}
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
              placeholder={
                '숙명여자대학교 시각디자인학과 학사\n서울대학교 디자인학과 석사'
              }
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
              placeholder={
                '2020 - 현재 숙명여자대학교 교수\n2015 - 2020 삼성전자 디자인센터'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
