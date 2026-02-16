import type { ModuleDetail } from './types';

interface ModuleDetailsTableProps {
  moduleDetails: ModuleDetail[];
}

export default function ModuleDetailsTable({
  moduleDetails,
}: ModuleDetailsTableProps) {
  return (
    <>
      {/* Module Details Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr',
          gap: '0',
          width: '100%',
          marginBottom: '0',
          marginTop: '40px',
        }}
      >
        {[
          { label: '구분', padding: '12px 0' },
          { label: '설명', padding: '12px 0 12px 12px' },
          { label: '해당과목', padding: '12px 0 12px 12px' },
        ].map((header) => (
          <div
            key={header.label}
            style={{
              padding: header.padding,
              borderBottom: '1px solid #000000ff',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            {header.label}
          </div>
        ))}
      </div>

      {/* Module Details Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {moduleDetails.map((detail, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr',
              gap: '0',
              alignItems: 'center',
              minHeight: '150px',
              borderBottom: '1px solid #000000ff',
              borderTop: '1px solid #000000ff',
              boxSizing: 'border-box',
            }}
          >
            {/* Module & Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0px 0px',
                height: '100%',
                gap: '8px',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'left',
                }}
              >
                {detail.module}
              </p>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#000000ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'left',
                }}
              >
                {detail.title}
              </p>
            </div>

            {/* Description */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0px 12px',
                height: '100%',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#353030ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                {detail.description}
              </p>
            </div>

            {/* Courses */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0px 12px',
                height: '100%',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#353030ff',
                  fontFamily: 'Pretendard',
                  margin: '0',
                  textAlign: 'left',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                  lineHeight: 1.6,
                }}
              >
                {detail.courses}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
