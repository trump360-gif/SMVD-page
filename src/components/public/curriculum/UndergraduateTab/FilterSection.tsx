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
  return (
    <div
      style={{
        display: 'flex',
        gap: '60px',
        flexWrap: 'wrap',
        paddingBottom: '20px',
        borderBottom: '1px solid #e0e0e0ff',
        alignItems: 'flex-start',
      }}
    >
      {/* Classification Filter */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <p
          style={{
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: 'Pretendard',
            color: '#000000ff',
            margin: '0',
            whiteSpace: 'nowrap',
          }}
        >
          분류
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {classificationOptions.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '18px',
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
                  width: '14px',
                  height: '14px',
                  cursor: 'not-allowed',
                  backgroundColor: checkedClassification === option.value ? '#d0d0d0ff' : '#ffffffff',
                  border: '1px solid #ccc',
                  borderRadius: '2px',
                }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      {/* Track Filter */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <p
          style={{
            fontSize: '18px',
            fontWeight: '500',
            fontFamily: 'Pretendard',
            color: '#000000ff',
            margin: '0',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            width: '35px',
          }}
        >
          트랙
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            columnGap: '20px',
            rowGap: '20px',
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
                  fontSize: '18px',
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
