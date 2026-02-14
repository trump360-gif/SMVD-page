import type { Meta } from '@storybook/react';
import { colors } from '@/constants/colors';

const meta = {
  title: 'Design System/Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '모든 브랜드 컬러 팔레트. 48개의 중립색 + 주요 브랜드 색상.',
      },
    },
  },
} satisfies Meta;

export default meta;

// Primary Colors (주요 색상)
export const PrimaryColors = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Inter' }}>
      Primary Brand Colors
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {Object.entries(colors.primary).map(([name, hex]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: hex,
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          />
          <div style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#8E98A8' }}>
            {hex}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Accent Colors
export const AccentColors = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Inter' }}>
      Accent Colors
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {Object.entries(colors.accent).map(([name, hex]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: hex,
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          />
          <div style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#8E98A8' }}>
            {hex}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Semantic Colors (에러, 경고, 성공)
export const SemanticColors = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Inter' }}>
      Semantic Colors
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {Object.entries(colors.semantic).map(([name, hex]) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: hex,
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          />
          <div style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
            {name}
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: '12px', color: '#8E98A8' }}>
            {hex}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Neutral Scale (48단계 중립색)
export const NeutralScale = () => {
  const neutralEntries = Object.entries(colors.neutral);

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Inter' }}>
        Neutral Scale (48 levels)
      </h2>
      <p style={{ fontSize: '14px', color: '#8E98A8', marginBottom: '24px', fontFamily: 'Inter' }}>
        0 (White) → 3400 (Black)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' }}>
        {neutralEntries.map(([level, hex]) => (
          <div key={level} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: hex,
                borderRadius: '8px',
                marginBottom: '8px',
                border: '1px solid #e0e0e0',
              }}
            />
            <div style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, marginBottom: '2px' }}>
              {level}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', color: '#8E98A8' }}>
              {hex}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// All Colors Overview
export const AllColors = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Complete Color System
    </h2>

    {/* Primary */}
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter' }}>
        Primary
      </h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {Object.entries(colors.primary).map(([name, hex]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: hex,
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            />
            <div style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600 }}>
              {name}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#8E98A8' }}>
              {hex}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Accent */}
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter' }}>
        Accent
      </h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {Object.entries(colors.accent).map(([name, hex]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: hex,
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            />
            <div style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600 }}>
              {name}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#8E98A8' }}>
              {hex}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Semantic */}
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter' }}>
        Semantic
      </h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {Object.entries(colors.semantic).map(([name, hex]) => (
          <div key={name} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: hex,
                borderRadius: '8px',
                marginBottom: '8px',
              }}
            />
            <div style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600 }}>
              {name}
            </div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', color: '#8E98A8' }}>
              {hex}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
