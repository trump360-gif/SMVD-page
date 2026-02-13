'use client';

interface VisionSectionProps {
  line1?: string;
  line2?: string;
}

export default function VisionSection({
  line1 = 'FROM VISUAL DELIVERY',
  line2 = 'TO SYSTEMIC SOLUTIONS SOLVING PROBLEMS. SHAPING THE FUTURE OF VISUALS',
}: VisionSectionProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '40px',
        width: '100%',
      }}
    >
      <p
        style={{
          margin: '0',
          fontSize: '18px',
          fontWeight: '400',
          lineHeight: 1.6,
          color: '#1b1d1fff',
          fontFamily: 'Helvetica',
        }}
      >
        {line1}
      </p>
      <p
        style={{
          margin: '0',
          fontSize: '18px',
          fontWeight: '400',
          lineHeight: 1.6,
          color: '#1b1d1fff',
          fontFamily: 'Helvetica',
        }}
      >
        {line2}
      </p>
    </div>
  );
}
