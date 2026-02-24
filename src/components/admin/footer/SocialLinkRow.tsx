'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { SocialPlatform } from '@/types/schemas';
import type { SocialLinkItem } from '@/hooks/useFooterEditor';

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  twitter: 'Twitter (X)',
  linkedin: 'LinkedIn',
};

const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  instagram: 'IG',
  youtube: 'YT',
  facebook: 'FB',
  twitter: 'TW',
  linkedin: 'LI',
};

interface SocialLinkRowProps {
  platform: SocialPlatform;
  link: SocialLinkItem;
  onEdit: (platform: SocialPlatform) => void;
  onDelete: (platform: SocialPlatform) => void;
  onToggle: (platform: SocialPlatform) => void;
}

export default function SocialLinkRow({
  platform,
  link,
  onEdit,
  onDelete,
  onToggle,
}: SocialLinkRowProps) {
  const handleDelete = async () => {
    if (!confirm(`"${PLATFORM_LABELS[platform]}" 링크를 삭제하시겠습니까?`)) return;
    try {
      await onDelete(platform);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패');
    }
  };

  const handleToggle = async () => {
    try {
      await onToggle(platform);
    } catch (err) {
      alert(err instanceof Error ? err.message : '상태 변경 실패');
    }
  };

  return (
    <tr
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      data-testid={`social-link-row-${platform}`}
    >
      {/* Platform */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 text-xs font-bold text-gray-600">
            {PLATFORM_ICONS[platform]}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {PLATFORM_LABELS[platform]}
          </span>
        </div>
      </td>

      {/* URL */}
      <td className="px-4 py-3 max-w-xs">
        {link.url ? (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block"
            title={link.url}
            data-testid={`social-link-url-${platform}`}
          >
            {link.url}
          </a>
        ) : (
          <span className="text-sm text-gray-400 italic" data-testid={`social-link-url-${platform}`}>
            URL 미설정
          </span>
        )}
      </td>

      {/* Active toggle */}
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
            link.isActive ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={link.isActive ?? false}
          aria-label={`${PLATFORM_LABELS[platform]} ${link.isActive ? '비활성화' : '활성화'}`}
          data-testid={`social-link-toggle-${platform}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
              link.isActive ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span
          className={`ml-2 text-xs ${link.isActive ? 'text-blue-600' : 'text-gray-500'}`}
        >
          {link.isActive ? '활성' : '비활성'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(platform)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            title="수정"
            aria-label={`${PLATFORM_LABELS[platform]} 링크 수정`}
            data-testid={`social-link-edit-btn-${platform}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="삭제"
            aria-label={`${PLATFORM_LABELS[platform]} 링크 삭제`}
            data-testid={`social-link-delete-btn-${platform}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
