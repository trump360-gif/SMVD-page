'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import type { FooterData, UpdateFooterTextInput } from '@/hooks/useFooterEditor';

interface FooterTextFormProps {
  footer: FooterData;
  onSave: (input: UpdateFooterTextInput) => Promise<FooterData | void>;
}

export default function FooterTextForm({ footer, onSave }: FooterTextFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [copyright, setCopyright] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(footer.title ?? '');
    setDescription(footer.description ?? '');
    setAddress(footer.address ?? '');
    setPhone(footer.phone ?? '');
    setEmail(footer.email ?? '');
    setCopyright(footer.copyright ?? '');
  }, [footer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await onSave({
        title: title.trim() || undefined,
        description: description.trim() || null,
        address: address.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        copyright: copyright.trim() || null,
      });
      setSuccessMessage('푸터 정보가 저장되었습니다.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500';

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-testid="footer-text-form"
    >
      {/* Success message */}
      {successMessage && (
        <div
          className="flex items-center gap-2 mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
          role="status"
          data-testid="footer-success-message"
        >
          <CheckCircle size={16} className="shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Form error */}
      {formError && (
        <div
          className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          role="alert"
          data-testid="footer-form-error"
        >
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Title */}
        <div>
          <label
            htmlFor="footer-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            학과명 (Title)
          </label>
          <input
            id="footer-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 숙명여자대학교 시각영상디자인과"
            className={inputClass}
            data-testid="footer-title-input"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="footer-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            설명 (Description)
            <span className="ml-1 text-xs text-gray-400">(선택)</span>
          </label>
          <textarea
            id="footer-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="학과 소개 한 줄 설명..."
            rows={2}
            className={`${inputClass} resize-none`}
            data-testid="footer-description-input"
            disabled={isSubmitting}
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="footer-address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            주소 (Address)
            <span className="ml-1 text-xs text-gray-400">(선택)</span>
          </label>
          <input
            id="footer-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="예: 서울특별시 용산구 청파로47길 100 숙명여자대학교"
            className={inputClass}
            data-testid="footer-address-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label
              htmlFor="footer-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              전화번호 (Phone)
              <span className="ml-1 text-xs text-gray-400">(선택)</span>
            </label>
            <input
              id="footer-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 02-2077-0000"
              className={inputClass}
              data-testid="footer-phone-input"
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="footer-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일 (Email)
              <span className="ml-1 text-xs text-gray-400">(선택)</span>
            </label>
            <input
              id="footer-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="예: design@sookmyung.ac.kr"
              className={inputClass}
              data-testid="footer-email-input"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Copyright */}
        <div>
          <label
            htmlFor="footer-copyright"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            저작권 (Copyright)
            <span className="ml-1 text-xs text-gray-400">(선택)</span>
          </label>
          <input
            id="footer-copyright"
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            placeholder="예: © 2025 숙명여자대학교 시각영상디자인과"
            className={inputClass}
            data-testid="footer-copyright-input"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="footer-text-save-btn"
          disabled={isSubmitting}
        >
          <Save size={16} />
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}
