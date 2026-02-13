'use client';

export default function Footer() {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#ebeef4ff',
        borderTop: '1px solid #e5e7ebff',
        paddingTop: '81px',
        paddingBottom: '81px',
        paddingLeft: '40px',
        paddingRight: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '100%',
        }}
      >
        {/* Left Section - Icon & Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}
        >
          {/* Icon */}
          <img
            src="/images/icon/Group-27-3.svg"
            alt="logo"
            width={31}
            height={32}
            style={{ display: 'block' }}
          />

          {/* Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0px',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              숙명여자대학교 미술대학 시각영상디자인학과
            </p>
            <p
              style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              University of Sookmyung Women, Visual Media Design
            </p>
          </div>
        </div>

        {/* Right Section - Contact */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#434850ff',
              fontFamily: 'Inter',
              margin: '0',
              lineHeight: 1.6,
              letterSpacing: '-0.3125px',
            }}
          >
            Contact
          </p>
          <p
            style={{
              fontSize: '16px',
              fontWeight: '400',
              color: '#434850ff',
              fontFamily: 'Inter',
              margin: '0',
              lineHeight: 1.6,
              letterSpacing: '-0.3125px',
            }}
          >
            +82 (0)2 710 9958<br />
            서울 특별시 용산구 청파로 47길 100 숙명여자대학교<br />
            시각영상디자인과 (미술대학 201호)
          </p>
        </div>
      </div>
    </footer>
  );
}
