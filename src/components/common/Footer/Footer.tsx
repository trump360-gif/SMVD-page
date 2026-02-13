import Link from 'next/link';

interface FooterLink {
  text: string;
  href: string;
}

interface FooterData {
  id: string;
  title: string;
  content: string;
  links?: FooterLink[];
}

interface FooterProps {
  data: FooterData | null;
}

export function Footer({ data }: FooterProps) {
  return (
    <footer style={{ backgroundColor: 'var(--color-neutral-1450)' }}>
      <div className="section-container py-12 lg:py-16">
        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Info */}
            <div>
              <h3
                className="font-bold mb-3"
                style={{
                  fontSize: '1.125rem',
                  color: 'var(--color-neutral-0)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {data.title}
              </h3>
              <p
                className="whitespace-pre-line"
                style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.7,
                  color: 'var(--color-neutral-500)',
                }}
              >
                {data.content}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="font-semibold mb-4"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-neutral-300)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                {data.links?.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="transition-colors"
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-neutral-500)',
                      }}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="font-semibold mb-4"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-neutral-300)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Contact
              </h4>
              <ul className="space-y-2">
                <li style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
                  Tel: 02-710-9240
                </li>
                <li style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
                  Email: smvd@sookmyung.ac.kr
                </li>
                <li style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
                  Address: 100 Cheongpa-ro 47-gil, Yongsan-gu, Seoul
                </li>
              </ul>
            </div>
          </div>
        ) : null}

        {/* Copyright */}
        <div
          className="mt-10 pt-8 text-center"
          style={{
            borderTop: '1px solid var(--color-neutral-1150)',
            fontSize: '0.8125rem',
            color: 'var(--color-neutral-700)',
          }}
        >
          <p>&copy; 2026 Sookmyung Women&apos;s University. Visual &amp; Media Design Department. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
