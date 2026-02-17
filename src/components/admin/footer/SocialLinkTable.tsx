'use client';

import SocialLinkRow from './SocialLinkRow';
import type { SocialPlatform } from '@/types/schemas';
import type { SocialLinksMap } from '@/hooks/useFooterEditor';

interface SocialLinkTableProps {
  socialLinks: SocialLinksMap;
  onEdit: (platform: SocialPlatform) => void;
  onDelete: (platform: SocialPlatform) => Promise<void>;
  onToggle: (platform: SocialPlatform) => Promise<void>;
}

export default function SocialLinkTable({
  socialLinks,
  onEdit,
  onDelete,
  onToggle,
}: SocialLinkTableProps) {
  const entries = Object.entries(socialLinks) as [SocialPlatform, { url: string; isActive: boolean }][];

  if (entries.length === 0) {
    return (
      <div
        className="text-center py-10 text-gray-500 text-sm"
        data-testid="social-link-empty-state"
      >
        등록된 SNS 링크가 없습니다. 상단의 + Add SNS 버튼을 눌러 추가해주세요.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" data-testid="social-link-table">
      <table
        className="w-full text-left"
        aria-label="SNS 링크 목록"
      >
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([platform, link]) => (
            <SocialLinkRow
              key={platform}
              platform={platform}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
