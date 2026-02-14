'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface WorkCardProps {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  href?: string;
}

export default function WorkCard({
  id,
  title,
  category,
  subtitle,
  image,
  href,
}: WorkCardProps) {
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
          aspectRatio: '332 / 240',
          backgroundColor: '#e1e1e1ff',
          overflow: 'hidden',
          marginBottom: '16px',
          borderRadius: '8px',
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div style={{ paddingTop: '14px', borderTop: '1px solid #e1e1e1ff' }}>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '500',
            color: '#000000ff',
            fontFamily: 'Inter',
            margin: '0 0 8px 0',
            letterSpacing: '-0.449px',
          }}
        >
          {title}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666', fontFamily: 'Inter' }}>
            {subtitle}
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 'normal',
              color: '#000000ff',
              fontFamily: 'Inter',
              opacity: 0.6,
              letterSpacing: '-0.439px',
            }}
          >
            {category}
          </span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
