import { useResponsive } from '@/lib/responsive';
import type { ModuleDetail } from './types';

interface ModuleDetailsTableProps {
  moduleDetails: ModuleDetail[];
}

export default function ModuleDetailsTable({
  moduleDetails,
}: ModuleDetailsTableProps) {
  const { isMobile, isTablet } = useResponsive();

  return (
    <>
      {/* Module Details Table Header */}
      {!isMobile && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : '1fr 1.5fr 1fr',
            gap: '0',
            width: '100%',
            marginBottom: '0',
            marginTop: '40px',
          }}
        >
          {(isTablet
            ? [
                { label: '구분', padding: '12px 0' },
                { label: '설명', padding: '12px 0 12px 12px' },
              ]
            : [
                { label: '구분', padding: '12px 0' },
                { label: '설명', padding: '12px 0 12px 12px' },
                { label: '해당과목', padding: '12px 0 12px 12px' },
              ]
          ).map((header) => (
            <div
              key={header.label}
              style={{
                padding: header.padding,
                borderBottom: '1px solid #000000ff',
                fontSize: isTablet ? '14px' : '18px',
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
      )}

      {/* Module Details Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {moduleDetails.map((detail, index) => {
          const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : '1fr 1.5fr 1fr';

          return (
            <div
              key={index}
              style={{
                display: isMobile ? 'flex' : 'grid',
                flexDirection: isMobile ? 'column' : undefined,
                gridTemplateColumns: isMobile ? undefined : gridCols,
                gap: isMobile ? '12px' : '0',
                alignItems: isMobile ? 'flex-start' : 'center',
                minHeight: isMobile ? 'auto' : isTablet ? '100px' : '80px',
                borderBottom: '1px solid #000000ff',
                borderTop: '1px solid #000000ff',
                boxSizing: 'border-box',
                padding: isMobile ? '16px 12px' : '0',
              }}
            >
              {/* Module & Title */}
              <div
                style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  justifyContent: 'flex-start',
                  padding: isMobile ? '0' : '0px 0px',
                  height: isMobile ? 'auto' : '100%',
                  gap: isMobile ? '0' : '8px',
                  flexDirection: isMobile ? 'column' : 'row',
                  width: isMobile ? '100%' : 'auto',
                }}
              >
                {isMobile && (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4e535bff',
                      marginBottom: '4px',
                    }}
                  >
                    구분
                  </span>
                )}
                <p
                  style={{
                    fontSize: isMobile ? '13px' : isTablet ? '14px' : '18px',
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
                    fontSize: isMobile ? '13px' : isTablet ? '14px' : '18px',
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
                  alignItems: isMobile ? 'flex-start' : 'center',
                  justifyContent: 'flex-start',
                  padding: isMobile ? '0' : '0px 12px',
                  height: isMobile ? 'auto' : '100%',
                  flexDirection: isMobile ? 'column' : 'row',
                  width: isMobile ? '100%' : 'auto',
                  gap: isMobile ? '4px' : '0',
                }}
              >
                {isMobile && (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4e535bff',
                    }}
                  >
                    설명
                  </span>
                )}
                <p
                  style={{
                    fontSize: isMobile ? '13px' : isTablet ? '14px' : '18px',
                    fontWeight: '500',
                    color: '#353030ff',
                    fontFamily: 'Pretendard',
                    margin: '0',
                    textAlign: 'left',
                    lineHeight: 1.5,
                    wordBreak: 'keep-all',
                  }}
                >
                  {detail.description}
                </p>
              </div>

              {/* Courses */}
              {!isMobile && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    padding: '0px 12px',
                    height: '100%',
                  }}
                >
                  <p
                    style={{
                      fontSize: isTablet ? '13px' : '18px',
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
              )}

              {isMobile && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    padding: '0',
                    height: 'auto',
                    flexDirection: 'column',
                    width: '100%',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4e535bff',
                    }}
                  >
                    해당과목
                  </span>
                  <p
                    style={{
                      fontSize: '13px',
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
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
