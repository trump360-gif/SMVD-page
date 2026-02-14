import type { Meta } from '@storybook/react';
import { spacing, gaps, borderRadius, shadows } from '@/constants/spacing';

const meta = {
  title: 'Design System/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '공간 시스템. 8px 기반 스케일 + Border Radius + Shadows.',
      },
    },
  },
} satisfies Meta;

export default meta;

// Spacing Scale
export const SpacingScale = () => {
  const mainSpacings = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48] as const;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
        Spacing Scale (8px base)
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mainSpacings.map((key) => {
          const value = spacing[key];
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '80px',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Inter',
                  color: '#1A46E7',
                }}
              >
                {key} ({value})
              </div>
              <div
                style={{
                  width: value,
                  height: '32px',
                  backgroundColor: '#1A46E7',
                  borderRadius: '4px',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Border Radius
export const BorderRadius = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Border Radius
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
      {Object.entries(borderRadius).map(([name, value]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#489AFF',
              borderRadius: value,
              marginBottom: '12px',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Inter', marginBottom: '4px' }}>
            {name}
          </div>
          <div style={{ fontSize: '12px', color: '#8E98A8', fontFamily: 'Inter' }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Gaps (특수 간격)
export const Gaps = () => {
  const gapDescriptions: Record<string, string> = {
    xs: '최소 간격',
    sm: '작은 간격',
    md: '중간 간격',
    lg: '기본 간격',
    xl: '큰 간격',
    '2xl': '매우 큰 간격',
    '3xl': '섹션 내부 간격',
    '4xl': '섹션 간격',
    '5xl': '페이지 간격',
    hero: 'Home Vision 섹션 간격',
    section: '일반 페이지 섹션 간격',
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
        Gaps (특수 간격)
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.entries(gaps).map(([name, value]) => (
          <div
            key={name}
            style={{
              padding: '16px',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ width: '100px', flexShrink: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Inter', color: '#1A46E7' }}>
                {name}
              </div>
              <div style={{ fontSize: '12px', color: '#8E98A8', fontFamily: 'Inter' }}>
                {value}
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#626872', fontFamily: 'Inter' }}>
              {gapDescriptions[name]}
            </div>
            <div
              style={{
                width: value,
                height: '24px',
                backgroundColor: '#489AFF',
                borderRadius: '4px',
                marginLeft: 'auto',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Shadows
export const Shadows = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Shadows
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      {Object.entries(shadows).map(([name, value]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '160px',
              height: '120px',
              backgroundColor: '#FFFFFF',
              boxShadow: value,
              borderRadius: '8px',
              marginBottom: '12px',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1A46E7',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Inter', marginBottom: '4px' }}>
            {name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#8E98A8',
              fontFamily: 'Inter',
              wordBreak: 'break-all',
              padding: '0 8px',
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// All Spacing Values
export const AllSpacingValues = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Complete Spacing Scale
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Object.entries(spacing).map(([key, value]) => (
        <div
          key={key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '8px',
            borderBottom: '1px solid #F5F5F5',
          }}
        >
          <div
            style={{
              width: '60px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'Inter',
              color: '#1A46E7',
            }}
          >
            {key}
          </div>
          <div
            style={{
              width: '60px',
              fontSize: '13px',
              fontFamily: 'Inter',
              color: '#8E98A8',
            }}
          >
            {value}
          </div>
          <div
            style={{
              width: value,
              height: '24px',
              backgroundColor: '#489AFF',
              borderRadius: '4px',
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

// Spacing Usage Examples
export const SpacingUsageExamples = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Spacing Usage Examples
    </h2>

    {/* Card Example */}
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter', color: '#1A46E7' }}>
        Card Component
      </h3>
      <div
        style={{
          width: '320px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E0E0E0',
          borderRadius: borderRadius.card,
          padding: spacing[6],
          boxShadow: shadows.md,
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: 600,
            fontFamily: 'Inter',
            marginBottom: spacing[3],
          }}
        >
          Card Title
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#8E98A8',
            fontFamily: 'Inter',
            marginBottom: spacing[4],
          }}
        >
          This card uses spacing tokens for padding and margins.
        </div>
        <button
          style={{
            backgroundColor: '#1A46E7',
            color: '#FFFFFF',
            padding: `${spacing[2]} ${spacing[4]}`,
            borderRadius: borderRadius.button,
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter',
            cursor: 'pointer',
          }}
        >
          Button
        </button>
      </div>
      <div style={{ fontSize: '13px', color: '#8E98A8', fontFamily: 'Inter', marginTop: '12px' }}>
        Padding: spacing[6] (24px) • Border Radius: borderRadius.card (12px) • Shadow: shadows.md
      </div>
    </div>

    {/* Stack Example */}
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter', color: '#1A46E7' }}>
        Stack Layout
      </h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: gaps.lg,
          backgroundColor: '#F5F5F5',
          padding: spacing[6],
          borderRadius: borderRadius.md,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              padding: spacing[4],
              borderRadius: borderRadius.sm,
              fontSize: '14px',
              fontFamily: 'Inter',
            }}
          >
            Item {i}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '13px', color: '#8E98A8', fontFamily: 'Inter', marginTop: '12px' }}>
        Gap: gaps.lg (16px) • Padding: spacing[6] (24px)
      </div>
    </div>

    {/* Grid Example */}
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter', color: '#1A46E7' }}>
        Grid Layout
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: gaps.xl,
          backgroundColor: '#F5F5F5',
          padding: spacing[6],
          borderRadius: borderRadius.md,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              padding: spacing[4],
              borderRadius: borderRadius.sm,
              fontSize: '14px',
              fontFamily: 'Inter',
              textAlign: 'center',
            }}
          >
            {i}
          </div>
        ))}
      </div>
      <div style={{ fontSize: '13px', color: '#8E98A8', fontFamily: 'Inter', marginTop: '12px' }}>
        Gap: gaps.xl (24px) • Padding: spacing[4] (16px)
      </div>
    </div>
  </div>
);
