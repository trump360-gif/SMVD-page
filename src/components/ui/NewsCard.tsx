'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface NewsCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  description?: string;
  image?: string;
  href?: string;
}

export default function NewsCard({
  id,
  title,
  category,
  date,
  description,
  image,
  href,
}: NewsCardProps) {
  const displayImage = image || '/Group-27.svg';

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
        <Image
          src={displayImage}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#1A46E7', fontWeight: '600' }}>
            {category}
          </span>
          <span style={{ fontSize: '14px', color: '#999' }}>{date}</span>
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#000', margin: '0 0 8px 0' }}>
          {title}
        </h3>
        {description && (
          <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
