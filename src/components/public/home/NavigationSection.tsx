'use client';

export default function NavigationSection() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 0',
        borderTop: '1px solid #000000ff',
        width: '100%',
        marginBottom: '40px',
      }}
    >
      {/* First Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          justifyContent: 'space-between',
          height: '36px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <span style={{ fontSize: '20px' }}>→</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#000000ff',
              fontFamily: 'Helvetica',
            }}
          >
            About Major
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000000ff',
        }}
      />

      {/* Second Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          height: '36px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <span style={{ fontSize: '20px' }}>→</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#000000ff',
              fontFamily: 'Helvetica',
            }}
          >
            Curriculum / People / Work
          </span>
        </div>
      </div>
    </div>
  );
}
