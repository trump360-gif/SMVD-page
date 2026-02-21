'use client';

import type { PersonFormModalProps } from './types';
import { usePersonForm } from './usePersonForm';
import BasicInfoFields from './BasicInfoFields';
import BiographyFields from './BiographyFields';
import { UnsavedChangesDialog } from '@/components/admin/shared/UnsavedChangesDialog';

export default function PersonFormModal({
  isOpen,
  person,
  role,
  onClose,
  onSubmit,
}: PersonFormModalProps) {
  const formState = usePersonForm(isOpen, person, role, onClose, onSubmit);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={formState.handleCloseAttempt}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {formState.isEditing
                ? '교수/강사 수정'
                : '새로운 교수/강사 추가'}
            </h2>
            <button
              onClick={formState.handleCloseAttempt}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &#215;
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Error */}
            {formState.uploadError && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {formState.uploadError}
              </div>
            )}

            {/* INSTRUCTOR FORM (Simple) */}
            {role === 'instructor' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={formState.form.name}
                    onChange={(e) =>
                      formState.setForm({
                        ...formState.form,
                        name: e.target.value,
                      })
                    }
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
                    value={formState.form.specialty || ''}
                    onChange={(e) =>
                      formState.setForm({
                        ...formState.form,
                        specialty: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="기초그래픽디자인 I/II"
                  />
                </div>
              </>
            ) : (
              <>
                {/* PROFESSOR FORM */}
                <BasicInfoFields
                  form={formState.form}
                  setForm={formState.setForm}
                  undergraduateText={formState.undergraduateText}
                  setUndergraduateText={formState.setUndergraduateText}
                  graduateText={formState.graduateText}
                  setGraduateText={formState.setGraduateText}
                  profileImagePreview={formState.profileImagePreview}
                  profileImageFile={formState.profileImageFile}
                  profileImageInputRef={formState.profileImageInputRef}
                  isUploadingImage={formState.isUploadingImage}
                  handleProfileImageChange={formState.handleProfileImageChange}
                  uploadProfileImage={formState.uploadProfileImage}
                />
                <BiographyFields
                  form={formState.form}
                  setForm={formState.setForm}
                  emailText={formState.emailText}
                  setEmailText={formState.setEmailText}
                  educationText={formState.educationText}
                  setEducationText={formState.setEducationText}
                  experienceText={formState.experienceText}
                  setExperienceText={formState.setExperienceText}
                  cvFile={formState.cvFile}
                  cvInputRef={formState.cvInputRef}
                  isUploadingCv={formState.isUploadingCv}
                  handleCvFileChange={formState.handleCvFileChange}
                  uploadCvFile={formState.uploadCvFile}
                />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
            {formState.isDirty && (
              <button
                type="button"
                onClick={formState.handleRevert}
                disabled={formState.isSaving}
                className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors font-medium disabled:opacity-50"
              >
                되돌리기
              </button>
            )}
            <button
              type="button"
              onClick={formState.handleCloseAttempt}
              disabled={formState.isSaving}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={formState.handleSubmit}
              disabled={formState.isSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {formState.isSaving
                ? '저장 중...'
                : formState.isEditing
                  ? '수정 저장'
                  : '추가'}
            </button>
          </div>
        </div>
      </div>

      <UnsavedChangesDialog
        isOpen={formState.showCloseConfirm}
        onKeepEditing={() => formState.setShowCloseConfirm(false)}
        onDiscard={() => {
          formState.setShowCloseConfirm(false);
          onClose();
        }}
      />
    </>
  );
}
