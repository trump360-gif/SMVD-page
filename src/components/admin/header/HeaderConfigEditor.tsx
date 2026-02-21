'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Upload, X } from 'lucide-react';
import { useHeaderConfigEditor } from '@/hooks/useHeaderConfigEditor';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { SaveBar } from '@/components/admin/shared/SaveBar';

export default function HeaderConfigEditor() {
  const {
    editState,
    isLoading,
    isSaving,
    isDirty,
    changeCount,
    error: hookError,
    fetchHeaderConfig,
    updateLocal,
    saveChanges,
    revert,
    clearError,
  } = useHeaderConfigEditor();

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const error = uploadError || hookError;

  useBeforeUnload(isDirty);

  const handleClearError = () => {
    setUploadError(null);
    clearError();
  };

  useEffect(() => {
    fetchHeaderConfig();
  }, [fetchHeaderConfig]);

  const handleLogoUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '로고 업로드 실패');
      }

      const response = await res.json();
      const uploadedMedia = response.data;

      // Local-only: update edit state (no API call)
      updateLocal({
        logoImageId: uploadedMedia.id,
        logoPreview: uploadedMedia.path,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '로고 업로드 실패';
      setUploadError(msg);
      console.error(msg);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploadingFavicon(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '파비콘 업로드 실패');
      }

      const response = await res.json();
      const uploadedMedia = response.data;

      // Local-only: update edit state (no API call)
      updateLocal({
        faviconImageId: uploadedMedia.id,
        faviconPreview: uploadedMedia.path,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '파비콘 업로드 실패';
      setUploadError(msg);
      console.error(msg);
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const handleRemoveLogo = () => {
    updateLocal({ logoImageId: null, logoPreview: null });
  };

  const handleRemoveFavicon = () => {
    updateLocal({ faviconImageId: null, faviconPreview: null });
  };

  const handleSave = async () => {
    try {
      await saveChanges();
    } catch {
      // error is already set in hook
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      data-testid="header-config-editor"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-base font-semibold text-gray-900">헤더 로고 & 파비콘</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            메인페이지 헤더에 표시될 로고와 브라우저 탭에 표시될 파비콘을 관리합니다.
          </p>
        </div>
      </div>

      {/* SaveBar */}
      <div className="px-6 pt-4">
        <SaveBar
          isDirty={isDirty}
          changeCount={changeCount}
          isSaving={isSaving}
          onSave={handleSave}
          onRevert={revert}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="flex items-start gap-3 px-6 py-3 bg-red-50 border-b border-red-100"
          role="alert"
          data-testid="header-config-error-banner"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={handleClearError}
            className="text-xs text-red-500 hover:text-red-700 underline"
            aria-label="에러 메시지 닫기"
          >
            닫기
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div
            className="flex items-center justify-center py-12 gap-3 text-gray-500"
            data-testid="header-config-loading"
          >
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm">헤더 설정을 불러오는 중...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">메인 로고</h3>
                <p className="text-xs text-gray-500 mt-1">
                  메인페이지 헤더에 표시될 로고 이미지입니다.
                </p>
              </div>

              {/* Logo Preview */}
              <div className="flex items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {editState.logoPreview ? (
                  <img
                    src={editState.logoPreview}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-500">이미지 미리보기</span>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="relative inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="logo-upload-btn"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                  <Upload size={16} className="mr-2" />
                  {isUploadingLogo ? '업로드 중...' : '로고 업로드'}
                </label>
              </div>

              {/* Remove Logo */}
              {editState.logoPreview && (
                <button
                  onClick={handleRemoveLogo}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  data-testid="logo-remove-btn"
                >
                  <X size={16} />
                  로고 제거
                </button>
              )}
            </div>

            {/* Favicon Section */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">파비콘</h3>
                <p className="text-xs text-gray-500 mt-1">
                  브라우저 탭에 표시될 파비콘입니다. (32x32px 권장)
                </p>
              </div>

              {/* Favicon Preview */}
              <div className="flex items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {editState.faviconPreview ? (
                  <img
                    src={editState.faviconPreview}
                    alt="Favicon preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-500">이미지 미리보기</span>
                )}
              </div>

              {/* Favicon Upload */}
              <div>
                <label className="relative inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="favicon-upload-btn"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFaviconUpload(file);
                    }}
                    disabled={isUploadingFavicon}
                    className="hidden"
                  />
                  <Upload size={16} className="mr-2" />
                  {isUploadingFavicon ? '업로드 중...' : '파비콘 업로드'}
                </label>
              </div>

              {/* Remove Favicon */}
              {editState.faviconPreview && (
                <button
                  onClick={handleRemoveFavicon}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  data-testid="favicon-remove-btn"
                >
                  <X size={16} />
                  파비콘 제거
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
