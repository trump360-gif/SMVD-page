'use client';


interface NewsDetailLayoutProps {
  children: React.ReactNode;
}

/**
 * Responsive layout wrapper for News detail pages.
 * Handles padding/gap responsive values as a client component,
 * since the News detail page itself is a server component.
 */
export default function NewsDetailLayout({ children }: NewsDetailLayoutProps) {

  return (
    <div
      className="w-full pt-0 pb-10 sm:pb-[61px] px-4 sm:px-6 lg:px-10 bg-[#ffffffff]"
    >
      <div
        className="max-w-[1440px] mx-auto flex flex-col gap-10 sm:gap-[60px] lg:gap-[100px]"
      >
        {children}
      </div>
    </div>
  );
}
