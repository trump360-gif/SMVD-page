import type { GraduateModule } from './types';
import { TRACK_COLORS } from './data';

interface TrackTableProps {
  modules: GraduateModule[];
}

export default function TrackTable({ modules }: TrackTableProps) {
  return (
    <>
      {/* Section Title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingBottom: '20px',
          borderBottom: '3px solid #000000ff',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1b1d1fff',
            fontFamily: 'Pretendard',
            margin: '0',
          }}
        >
          트랙별 과목 및 이수기준
        </h2>
      </div>

      {/* Information Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          marginTop: '40px',
        }}
      >
        {/* Info Box 1 */}
        <div style={{ display: 'flex', gap: '24px', paddingBottom: '20px' }}>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#4e535bff',
              fontFamily: 'Pretendard',
              margin: '0',
              width: '60px',
              flexShrink: 0,
            }}
          >
            트랙
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '400',
              color: '#4e535bff',
              fontFamily: 'Pretendard',
              margin: '0',
              lineHeight: 1.6,
            }}
          >
            전공교육과정을 기반으로 한 전문 인재육성 교육커리큘럼, 진출분야 및
            역량강화를 위한 모듈과 교과목으로 구성된 전공로드맵
          </p>
        </div>

        {/* Info Box 2 */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#4e535bff',
              fontFamily: 'Pretendard',
              margin: '0',
              width: '60px',
              flexShrink: 0,
            }}
          >
            모듈
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '400',
              color: '#4e535bff',
              fontFamily: 'Pretendard',
              margin: '0',
              lineHeight: 1.6,
            }}
          >
            공통된 주제의 교과목으로 구성된 집합체
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr',
          gap: '20px',
          width: '100%',
          marginBottom: '0',
          marginTop: '40px',
        }}
      >
        {['트랙명', '해당과목', '이수기준', '기준학점'].map((header) => (
          <div
            key={header}
            style={{
              padding: '0px 0 4px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#000000ff',
              fontFamily: 'Pretendard',
              textAlign: 'left',
            }}
          >
            {header}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {modules.map((module, index) => {
          const moduleColor = TRACK_COLORS[index % TRACK_COLORS.length];

          return (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr',
                gap: '20px',
                alignItems: 'center',
                minHeight: '80px',
                borderBottom: '1px solid #000000ff',
                borderTop: '1px solid #000000ff',
                boxSizing: 'border-box',
              }}
            >
              {/* Track Name with Color Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  height: '100%',
                  padding: '20px 12px',
                  borderRight: 'none',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: moduleColor,
                    flexShrink: 0,
                  }}
                />
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
                  {module.track}
                </p>
              </div>

              {/* Courses */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  height: '100%',
                  padding: '20px 12px',
                  borderRight: 'none',
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
                  {module.courses.replace(/\\n/g, '\n')}
                </p>
              </div>

              {/* Requirements */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: '100%',
                  padding: '20px 12px',
                  borderRight: 'none',
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
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                  }}
                >
                  {module.requirements}
                </p>
              </div>

              {/* Credits */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: '100%',
                  padding: '20px 12px',
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
                  }}
                >
                  {module.credits}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
