interface CurriculumFooterNoteProps {
  href: string;
  text: string;
}

export default function CurriculumFooterNote({ href, text }: CurriculumFooterNoteProps) {
  return (
    <div
      style={{
        textAlign: 'right',
        marginTop: '-55px',
        padding: '0',
      }}
    >
      <p
        style={{
          fontSize: '16px',
          fontWeight: '400',
          color: '#666666',
          fontFamily: 'Pretendard',
          margin: '0',
          lineHeight: 1,
          padding: '0',
        }}
      >
        *
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#666666',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {text}
        </a>
        에서 확인 가능
      </p>
    </div>
  );
}
