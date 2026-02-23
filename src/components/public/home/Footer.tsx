'use client';

import { Instagram, Youtube, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';

interface FooterData {
  title?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoImagePath?: string | null;
}

interface SocialLink {
  url: string;
  isActive: boolean;
}

interface SocialLinks {
  instagram?: SocialLink;
  youtube?: SocialLink;
  facebook?: SocialLink;
  twitter?: SocialLink;
  linkedin?: SocialLink;
}

export interface FooterProps {
  data?: FooterData;
  socialLinks?: SocialLinks;
}

const SOCIAL_ICON_MAP = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
} as const;

type SocialPlatform = keyof typeof SOCIAL_ICON_MAP;

export function Footer({ data, socialLinks }: FooterProps) {
  const { isMobile, isTablet } = useResponsive();

  const footerPadding = isMobile ? '32px' : isTablet ? '48px' : '81px';
  const padding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;
  const footerGap = isMobile ? '24px' : '40px';
  const fontSize = isMobile ? '14px' : isTablet ? '15px' : '16px';
  const iconSize = isMobile ? '24px' : '31px';
  const iconHeight = isMobile ? '24px' : '32px';

  const title = data?.title ?? '숙명여자대학교 미술대학 시각영상디자인학과';
  const description = data?.description ?? 'University of Sookmyung Women, Visual Media Design';
  const address = data?.address ?? '서울 특별시 용산구 청파로 47길 100 숙명여자대학교 시각영상디자인과 (미술대학 201호)';
  const phone = data?.phone ?? '+82 (0)2 710 9958';
  const email = data?.email;
  const logoSrc = data?.logoImagePath ?? '/images/icon/Group-27-3.svg';

  const activeSocialLinks = socialLinks
    ? (Object.entries(socialLinks) as [SocialPlatform, SocialLink][]).filter(
        ([, link]) => link.isActive
      )
    : [];

  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: '#ebeef4ff',
        borderTop: '1px solid #e5e7ebff',
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: footerPadding,
          paddingBottom: footerPadding,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          gap: footerGap,
        }}
      >
        {/* Left Section - Icon & Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Icon */}
          <img
            src={logoSrc}
            alt="logo"
            width={isMobile ? 24 : 31}
            height={isMobile ? 24 : 32}
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
                fontSize,
                fontWeight: '700',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontSize,
                fontWeight: '400',
                color: '#434850ff',
                fontFamily: 'Inter',
                margin: '0',
                lineHeight: 1.6,
                letterSpacing: '-0.3125px',
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Right Section - Contact */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
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
            {phone}
            {email && (
              <>
                <br />
                <a
                  href={`mailto:${email}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {email}
                </a>
              </>
            )}
            <br />
            {address}
          </p>

          {/* SNS Links */}
          {activeSocialLinks.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '8px',
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
                Follow Us
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {activeSocialLinks.map(([platform, link]) => {
                  const IconComponent = SOCIAL_ICON_MAP[platform];
                  return (
                    <a
                      key={platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#434850ff',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#1A46E7';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#434850ff';
                      }}
                    >
                      <IconComponent
                        width={iconSize}
                        height={iconHeight}
                        strokeWidth={1.5}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
