'use client';

import Link from 'next/link';
import { WorkDetail } from '@/constants/work-details';

interface WorkDetailPageProps {
  project: WorkDetail;
}

export default function WorkDetailPage({ project }: WorkDetailPageProps) {
  return (
    <div
      style={{
        width: '100%',
        paddingTop: '0px',
        paddingBottom: '61px',
        paddingLeft: '40px',
        paddingRight: '40px',
        backgroundColor: '#ffffffff',
      }}
    >
      {/* Header Navigation - Same as Archive */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%',
          paddingTop: '80px',
          paddingBottom: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1b1d1fff',
            fontFamily: 'Satoshi',
            margin: '0',
            letterSpacing: '-0.24px',
          }}
        >
          Achieve
        </h1>

        {/* Category Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            width: '100%',
            paddingBottom: '20px',
            borderBottom: '1px solid #e5e5e5ff',
          }}
        >
          {['All', 'UX/UI', 'Motion', 'Branding', 'Game', 'Graphics'].map((category) => (
            <span
              key={category}
              style={{
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'Satoshi',
                color: project.category === category ? '#141414ff' : '#7b828eff',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
              }}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '80px',
          paddingTop: '80px',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '100px',
            width: '100%',
          }}
        >
          {/* Hero Image */}
          <div
            style={{
              width: '100%',
              height: '860px',
              backgroundColor: '#d9d9d9ff',
              borderRadius: '0px',
              overflow: 'hidden',
            }}
          >
            <img
              src={project.heroImage}
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Text Section - 2 Column Layout */}
          <div
            style={{
              display: 'flex',
              gap: '90px',
              width: '100%',
            }}
          >
            {/* Left Column - Title and Author */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: '0 0 auto',
                minWidth: '400px',
              }}
            >
              {/* Title */}
              <h1
                style={{
                  fontSize: '60px',
                  fontWeight: '700',
                  color: '#1b1d1fff',
                  fontFamily: 'Satoshi',
                  margin: '0',
                  letterSpacing: '-0.6px',
                  lineHeight: '1.2',
                }}
              >
                {project.title}
              </h1>

              {/* Author and Email - Single Line */}
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  color: '#1b1d1fff',
                  margin: '0',
                }}
              >
                {project.author}
                <span
                  style={{
                    fontWeight: '400',
                    color: '#7b828eff',
                    marginLeft: '16px',
                  }}
                >
                  {project.email}
                </span>
              </p>
            </div>

            {/* Right Column - Description */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: '1',
              }}
            >
              {/* Description - 3 Lines */}
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '400',
                  fontFamily: 'Pretendard',
                  color: '#1b1d1fff',
                  lineHeight: '1.8',
                  letterSpacing: '-0.18px',
                  margin: '0',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {project.description}
              </p>
            </div>
          </div>

          {/* Gallery */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              width: '100%',
            }}
          >
            {project.galleryImages.map((image, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  backgroundColor: '#f0f0f0ff',
                  borderRadius: '0px',
                  overflow: 'hidden',
                  lineHeight: '0',
                  margin: index > 0 ? '-1px 0 0 0' : '0',
                  padding: '0',
                  fontSize: '0',
                }}
              >
                <img
                  src={image}
                  alt={`${project.title} gallery ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '0',
                    padding: '0',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
          }}
        >
          {/* Previous Project */}
          {project.previousProject ? (
            <Link href={`/work/${project.previousProject.id}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5ff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#efefefff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#f5f5f5ff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(0)';
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    color: '#1b1d1fff',
                  }}
                >
                  ← Previous
                </span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}

          {/* Next Project */}
          {project.nextProject ? (
            <Link href={`/work/${project.nextProject.id}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5ff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#efefefff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    '#f5f5f5ff';
                  (e.currentTarget as HTMLElement).style.transform =
                    'translateY(0)';
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Pretendard',
                    color: '#1b1d1fff',
                  }}
                >
                  Next →
                </span>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
