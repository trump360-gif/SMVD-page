'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface ProfessorCardProps {
  id: string;
  name: string;
  badge: string;
  profileImage: string;
  href?: string;
}

export default function ProfessorCard({
  id,
  name,
  badge,
  profileImage,
  href,
}: ProfessorCardProps) {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = '0.8';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = '1';
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <Image
          src={profileImage}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div style={{ fontSize: '12px', color: '#1A46E7', fontWeight: '600', marginBottom: '4px' }}>
        {badge}
      </div>
      <div style={{ fontSize: '20px', fontWeight: '600', color: '#000' }}>
        {name}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
