'use client';

import { useResponsive } from '@/lib/responsive';
import { PADDING } from '@/constants/responsive';
import {
  Header,
  VideoHero,
  ExhibitionSection,
  AboutSection,
  WorkSection,
  Footer,
} from '@/components/public/home';
import type { FooterProps } from '@/components/public/home/Footer';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  parentId: string | null;
}

interface HeaderConfigData {
  logoImagePath?: string | null;
  faviconImagePath?: string | null;
}

interface HomePageContentProps {
  exhibitionItems: Array<{
    year: string;
    src: string;
    alt: string;
  }>;
  workItems: Array<{
    src: string;
    alt: string;
    title: string;
    category: string;
  }>;
  aboutContent: string;
  navigation?: NavigationItem[];
  headerConfig?: HeaderConfigData;
  footerData?: FooterProps['data'];
  socialLinks?: FooterProps['socialLinks'];
}

export default function HomePageContent({
  exhibitionItems,
  workItems,
  aboutContent,
  navigation,
  headerConfig,
  footerData,
  socialLinks,
}: HomePageContentProps) {
  const { isMobile, isTablet } = useResponsive();

  const containerPadding = isMobile ? PADDING.mobile : isTablet ? PADDING.tablet : PADDING.desktop;

  return (
    <div>
      {/* Header */}
      <Header navigation={navigation} headerConfig={headerConfig} />

      {/* Video Hero */}
      <VideoHero />

      {/* Main Content Container - Responsive */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          paddingLeft: `${containerPadding}px`,
          paddingRight: `${containerPadding}px`,
        }}
      >
        {/* Exhibition Section */}
        <ExhibitionSection items={exhibitionItems} />
      </div>

      {/* About Section (Full Width) */}
      <AboutSection content={aboutContent} />

      {/* Work Section (Full Width) */}
      <WorkSection items={workItems} />

      {/* Footer */}
      <Footer data={footerData} socialLinks={socialLinks} />
    </div>
  );
}
