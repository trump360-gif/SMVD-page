import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smvd.sookmyung.ac.kr';

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/curriculum`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/people`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  try {
    // Add dynamic pages (if any)
    const pages = await prisma.page.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const dynamicPages = pages
      .filter((page: { slug: string; updatedAt: Date }) =>
        !['home', 'about', 'curriculum', 'people', 'work', 'news'].includes(page.slug)
      )
      .map((page: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticPages;
  }
}
