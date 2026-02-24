'use client';

import type { UpdateFooterTextInput } from '@/hooks/useFooterEditor';

interface FooterTextFormProps {
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  onChange: (input: UpdateFooterTextInput) => void;
}

export default function FooterTextForm({
  title,
  description,
  address,
  phone,
  email,
  copyright,
  onChange,
}: FooterTextFormProps) {
  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';

  return (
    <div data-testid="footer-text-form">
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
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="예: 숙명여자대학교 시각영상디자인과"
            className={inputClass}
            data-testid="footer-title-input"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="footer-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            설명 (Description)
            <span className="ml-1 text-xs text-gray-500">(선택)</span>
          </label>
          <textarea
            id="footer-description"
            value={description}
            onChange={(e) => onChange({ description: e.target.value || null })}
            placeholder="학과 소개 한 줄 설명..."
            rows={2}
            className={`${inputClass} resize-none`}
            data-testid="footer-description-input"
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="footer-address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            주소 (Address)
            <span className="ml-1 text-xs text-gray-500">(선택)</span>
          </label>
          <input
            id="footer-address"
            type="text"
            value={address}
            onChange={(e) => onChange({ address: e.target.value || null })}
            placeholder="예: 서울특별시 용산구 청파로47길 100 숙명여자대학교"
            className={inputClass}
            data-testid="footer-address-input"
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
              <span className="ml-1 text-xs text-gray-500">(선택)</span>
            </label>
            <input
              id="footer-phone"
              type="text"
              value={phone}
              onChange={(e) => onChange({ phone: e.target.value || null })}
              placeholder="예: 02-2077-0000"
              className={inputClass}
              data-testid="footer-phone-input"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="footer-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이메일 (Email)
              <span className="ml-1 text-xs text-gray-500">(선택)</span>
            </label>
            <input
              id="footer-email"
              type="text"
              value={email}
              onChange={(e) => onChange({ email: e.target.value || null })}
              placeholder="예: design@sookmyung.ac.kr"
              className={inputClass}
              data-testid="footer-email-input"
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
            <span className="ml-1 text-xs text-gray-500">(선택)</span>
          </label>
          <input
            id="footer-copyright"
            type="text"
            value={copyright}
            onChange={(e) => onChange({ copyright: e.target.value || null })}
            placeholder="예: © 2025 숙명여자대학교 시각영상디자인과"
            className={inputClass}
            data-testid="footer-copyright-input"
          />
        </div>
      </div>
    </div>
  );
}
