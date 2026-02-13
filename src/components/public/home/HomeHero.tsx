'use client';

interface HomeHeroProps {
  eventLabel?: string;
  eventDate?: string;
  title?: string;
}

export default function HomeHero({
  eventLabel = 'Event',
  eventDate = '2024.01.05',
  title = '2024 시각영상디자인과 졸업전시회',
}: HomeHeroProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingBottom: '20px',
        borderBottom: '2px solid #000000ff',
        width: '100%',
      }}
    >
      {/* Event Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '28px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '28px',
            backgroundColor: '#0000001a',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            fontFamily: 'Helvetica',
            color: '#000000ff',
          }}
        >
          {eventLabel}
        </div>
        <p
          style={{
            margin: '0',
            fontSize: '14px',
            fontWeight: '500',
            color: '#575a60ff',
            fontFamily: 'Helvetica',
          }}
        >
          {eventDate}
        </p>
      </div>

      {/* Title */}
      <h1
        style={{
          margin: '0',
          fontSize: '48px',
          fontWeight: '700',
          lineHeight: 1.45,
          letterSpacing: '-0.48px',
          color: '#000000ff',
          fontFamily: 'Helvetica',
        }}
      >
        {title}
      </h1>
    </div>
  );
}
