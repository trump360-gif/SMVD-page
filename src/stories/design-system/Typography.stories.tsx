import type { Meta } from '@storybook/react';
import { typography } from '@/constants/typography';

const meta = {
  title: 'Design System/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '타이포그래피 계층 구조. Pretendard(한글) + Satoshi(영문).',
      },
    },
  },
} satisfies Meta;

export default meta;

// Heading Hierarchy
export const Headings = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Heading Hierarchy
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {Object.entries(typography.heading).map(([level, styles]) => (
        <div key={level} style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '24px' }}>
          <div
            style={{
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              lineHeight: styles.lineHeight,
              letterSpacing: 'letterSpacing' in styles ? styles.letterSpacing : '0',
              fontFamily: typography.fontFamily.primary.join(', '),
              marginBottom: '12px',
            }}
          >
            숙명여자대학교 시각영상디자인과 SMVD Department
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#8E98A8', fontFamily: 'Inter' }}>
            <span><strong>{level.toUpperCase()}</strong></span>
            <span>Size: {styles.fontSize}</span>
            <span>Weight: {styles.fontWeight}</span>
            <span>Line Height: {styles.lineHeight}</span>
            {'letterSpacing' in styles && <span>Letter Spacing: {styles.letterSpacing}</span>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Body Text Variants
export const BodyText = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Body Text Variants
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {Object.entries(typography.body).map(([variant, styles]) => (
        <div key={variant} style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '24px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#1A46E7', fontFamily: 'Inter' }}>
            {variant}
          </div>
          <p
            style={{
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              lineHeight: styles.lineHeight,
              letterSpacing: 'letterSpacing' in styles ? styles.letterSpacing : '0',
              fontFamily: typography.fontFamily.primary.join(', '),
              marginBottom: '12px',
              maxWidth: '800px',
            }}
          >
            숙명여자대학교 시각영상디자인과는 UX/UI, 그래픽 디자인, 에디토리얼, 일러스트레이션, 브랜딩, CM/CF, 게임 등 다양한 분야의 전문 교육을 제공하며,
            창의적이고 혁신적인 디자이너 양성을 목표로 합니다.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8E98A8', fontFamily: 'Inter' }}>
            <span>Size: {styles.fontSize}</span>
            <span>Weight: {styles.fontWeight}</span>
            <span>Line Height: {styles.lineHeight}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Label & Button Text
export const LabelText = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Label & Button Text
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {Object.entries(typography.label).map(([variant, styles]) => (
        <div key={variant} style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '24px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#1A46E7', fontFamily: 'Inter' }}>
            {variant}
          </div>
          <div
            style={{
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              lineHeight: styles.lineHeight,
              letterSpacing: styles.letterSpacing,
              fontFamily: typography.fontFamily.primary.join(', '),
              marginBottom: '12px',
            }}
          >
            ABOUT MAJOR • 학과소개 • BUTTON TEXT
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#8E98A8', fontFamily: 'Inter' }}>
            <span>Size: {styles.fontSize}</span>
            <span>Weight: {styles.fontWeight}</span>
            <span>Line Height: {styles.lineHeight}</span>
            <span>Letter Spacing: {styles.letterSpacing}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Font Weights
export const FontWeights = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Font Weights
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      {Object.entries(typography.fontWeight).map(([name, weight]) => (
        <div key={name} style={{ padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#8E98A8', marginBottom: '8px', fontFamily: 'Inter' }}>
            {name} ({weight})
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: weight,
              fontFamily: typography.fontFamily.primary.join(', '),
            }}
          >
            가나다라 ABCD 1234
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Font Families
export const FontFamilies = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Font Families
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ padding: '24px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A46E7', marginBottom: '12px', fontFamily: 'Inter' }}>
          Primary (Pretendard) - 한글 전용
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: '500',
            fontFamily: typography.fontFamily.primary.join(', '),
            marginBottom: '8px',
          }}
        >
          숙명여자대학교 시각영상디자인과
        </div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '400',
            fontFamily: typography.fontFamily.primary.join(', '),
            color: '#8E98A8',
          }}
        >
          UX/UI, 그래픽 디자인, 에디토리얼, 일러스트레이션, 브랜딩
        </div>
      </div>

      <div style={{ padding: '24px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A46E7', marginBottom: '12px', fontFamily: 'Inter' }}>
          Secondary (Satoshi) - 영문 전용
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: '500',
            fontFamily: typography.fontFamily.secondary.join(', '),
            marginBottom: '8px',
          }}
        >
          Sookmyung Visual & Media Design
        </div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '400',
            fontFamily: typography.fontFamily.secondary.join(', '),
            color: '#8E98A8',
          }}
        >
          UX/UI, Graphic Design, Editorial, Illustration, Branding
        </div>
      </div>

      <div style={{ padding: '24px', backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A46E7', marginBottom: '12px', fontFamily: 'Inter' }}>
          Mono (Monospace) - 코드, 고정폭
        </div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: '400',
            fontFamily: typography.fontFamily.mono.join(', '),
            color: '#1D1D1D',
            backgroundColor: '#FFFFFF',
            padding: '12px',
            borderRadius: '4px',
          }}
        >
          const colors = &#123; primary: '#1A46E7', neutral: '#E0E0E0' &#125;;
        </div>
      </div>
    </div>
  </div>
);

// All Typography Scales
export const AllScales = () => (
  <div style={{ padding: '24px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Inter' }}>
      Complete Typography System
    </h2>

    {/* Font Sizes */}
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter', color: '#1A46E7' }}>
        Font Sizes
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {Object.entries(typography.fontSize).map(([name, size]) => (
          <div key={name} style={{ padding: '12px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#8E98A8', marginBottom: '4px', fontFamily: 'Inter' }}>
              {name}
            </div>
            <div style={{ fontSize: size, fontFamily: typography.fontFamily.primary.join(', ') }}>
              Aa
            </div>
            <div style={{ fontSize: '11px', color: '#8E98A8', marginTop: '4px', fontFamily: 'Inter' }}>
              {size}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Line Heights */}
    <div style={{ marginBottom: '48px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter', color: '#1A46E7' }}>
        Line Heights
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {Object.entries(typography.lineHeight).map(([name, height]) => (
          <div key={name} style={{ padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', fontFamily: 'Inter' }}>
              {name} ({height})
            </div>
            <p
              style={{
                fontSize: '16px',
                lineHeight: height,
                fontFamily: typography.fontFamily.primary.join(', '),
                margin: 0,
              }}
            >
              숙명여자대학교 시각영상디자인과는 창의적이고 혁신적인 디자이너 양성을 목표로 합니다.
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Letter Spacing */}
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', fontFamily: 'Inter', color: '#1A46E7' }}>
        Letter Spacing
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {Object.entries(typography.letterSpacing).map(([name, spacing]) => (
          <div key={name} style={{ padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', fontFamily: 'Inter' }}>
              {name} ({spacing})
            </div>
            <div
              style={{
                fontSize: '20px',
                letterSpacing: spacing,
                fontFamily: typography.fontFamily.primary.join(', '),
              }}
            >
              SOOKMYUNG VISUAL & MEDIA DESIGN
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
