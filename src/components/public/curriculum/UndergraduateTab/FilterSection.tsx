import { useResponsive } from '@/lib/responsive';
import type { FilterOption } from './types';

interface FilterSectionProps {
  checkedClassification: string;
  classificationOptions: FilterOption[];
  trackOptions: FilterOption[];
}

export default function FilterSection({
  checkedClassification,
  classificationOptions,
  trackOptions,
}: FilterSectionProps) {
  const { isMobile, isTablet } = useResponsive();

  const containerGap = isMobile ? '24px' : isTablet ? '40px' : '60px';
  const labelFontSize = isMobile ? '14px' : '18px';
  const trackGridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, auto)' : 'repeat(3, auto)';
  const trackGap = isMobile ? '12px' : '20px';
  const labelWidth = isMobile ? 'auto' : '35px';
  const trackItemFontSize = isMobile ? '14px' : '18px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: containerGap,
        flexWrap: isMobile ? 'nowrap' : 'wrap',
        paddingBottom: '20px',
        borderBottom: '1px solid #e0e0e0ff',
        alignItems: 'flex-start',
      }}
    >
      {/* Classification Filter */}
      <div style={{ display: 'flex', gap: isMobile ? '12px' : '20px', alignItems: 'flex-start', minWidth: 0 }}>
        <p
          style={{
            fontSize: labelFontSize,
            fontWeight: '500',
            fontFamily: 'Pretendard',
            color: '#000000ff',
            margin: '0',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          분류
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {classificationOptions.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: labelFontSize,
                fontWeight: '500',
                fontFamily: 'Pretendard',
                color: '#000000ff',
                margin: '0',
              }}
            >
              <input
                type="checkbox"
                checked={checkedClassification === option.value}
                onChange={() => {}}
                disabled
                style={{
                  appearance: 'none',
                  width: '12px',
                  height: '12px',
                  cursor: 'not-allowed',
                  backgroundColor: checkedClassification === option.value ? '#d0d0d0ff' : '#ffffffff',
                  border: '1px solid #ccc',
                  borderRadius: '2px',
                  flexShrink: 0,
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Track Filter */}
      <div style={{ display: 'flex', gap: isMobile ? '12px' : '30px', alignItems: 'flex-start', minWidth: 0 }}>
        <p
          style={{
            fontSize: labelFontSize,
            fontWeight: '500',
            fontFamily: 'Pretendard',
            color: '#000000ff',
            margin: '0',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            width: labelWidth,
          }}
        >
          트랙
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: trackGridColumns,
            columnGap: trackGap,
            rowGap: isMobile ? '12px' : '20px',
          }}
        >
          {trackOptions.map((option) => (
            <div
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0',
                borderRadius: '0',
                backgroundColor: 'transparent',
                border: 'none',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: option.color,
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontSize: trackItemFontSize,
                  fontWeight: '500',
                  fontFamily: 'Pretendard',
                  color: '#000000ff',
                  margin: '0',
                  whiteSpace: 'nowrap',
                  wordBreak: 'keep-all',
                  lineHeight: 1.3,
                }}
              >
                {option.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
