'use client';

import { useEffect, useState } from 'react';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useFooterEditor } from '@/hooks/useFooterEditor';
import { SOCIAL_PLATFORMS } from '@/types/schemas';
import FooterTextForm from './FooterTextForm';
import SocialLinkTable from './SocialLinkTable';
import SocialLinkModal from './SocialLinkModal';
import type { SocialPlatform } from '@/types/schemas';

export default function FooterEditor() {
  const {
    footer,
    isLoading,
    error,
    fetchFooter,
    updateFooter,
    upsertSocialLink,
    deleteSocialLink,
    toggleSocialLink,
    clearError,
  } = useFooterEditor();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform | null>(null);

  useEffect(() => {
    fetchFooter();
  }, [fetchFooter]);

  const socialLinks = (footer?.socialLinks ?? {}) as Record<string, { url: string; isActive: boolean }>;
  const takenPlatforms = Object.keys(socialLinks) as SocialPlatform[];
  const canAddMore = takenPlatforms.length < SOCIAL_PLATFORMS.length;

  const handleOpenAddModal = () => {
    if (!canAddMore) return;
    setEditingPlatform(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (platform: SocialPlatform) => {
    setEditingPlatform(platform);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlatform(null);
  };

  const handleModalSubmit = async (
    platform: SocialPlatform,
    input: { url: string; isActive: boolean }
  ) => {
    await upsertSocialLink(platform, input);
  };

  const handleToggle = async (platform: SocialPlatform) => {
    await toggleSocialLink(platform);
  };

  const handleDelete = async (platform: SocialPlatform) => {
    await deleteSocialLink(platform);
  };

  return (
    <div
      className="space-y-6"
      data-testid="footer-editor"
    >
      {/* Global error banner */}
      {error && (
        <div
          className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl"
          role="alert"
          data-testid="footer-error-banner"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-xs text-red-500 hover:text-red-700 underline"
            aria-label="에러 메시지 닫기"
          >
            닫기
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 gap-3 text-gray-500"
          data-testid="footer-loading"
        >
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-sm">푸터 정보를 불러오는 중...</span>
        </div>
      ) : footer ? (
        <>
          {/* Section 1: 푸터 텍스트 정보 */}
          <div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            data-testid="footer-text-section"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">푸터 텍스트 정보</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                학과명, 주소, 연락처 등 푸터에 표시될 기본 정보를 수정합니다.
              </p>
            </div>
            <div className="px-6 py-5">
              <FooterTextForm footer={footer} onSave={updateFooter} />
            </div>
          </div>

          {/* Section 2: SNS 링크 관리 */}
          <div
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            data-testid="footer-social-section"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-base font-semibold text-gray-900">SNS 링크 관리</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Instagram, YouTube 등 SNS 링크를 추가하거나 수정합니다.
                </p>
              </div>
              <button
                onClick={handleOpenAddModal}
                disabled={!canAddMore}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canAddMore ? '모든 플랫폼이 등록되었습니다' : undefined}
                data-testid="social-link-add-btn"
              >
                <Plus size={16} />
                Add SNS
              </button>
            </div>

            <div className="px-6 py-4">
              <SocialLinkTable
                socialLinks={socialLinks}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            </div>
          </div>
        </>
      ) : (
        <div
          className="text-center py-12 text-gray-500 text-sm"
          data-testid="footer-no-data"
        >
          푸터 데이터를 불러올 수 없습니다.
        </div>
      )}

      {/* SNS 링크 모달 */}
      {footer && (
        <SocialLinkModal
          isOpen={isModalOpen}
          editingPlatform={editingPlatform}
          existingLink={
            editingPlatform ? (socialLinks[editingPlatform] ?? null) : null
          }
          takenPlatforms={takenPlatforms}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
