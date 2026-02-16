import {
  Header,
  Footer,
} from '@/components/public/home';
import { WorkDetailPage } from '@/components/public/work';
import { workDetails, WorkDetail } from '@/constants/work-details';
import type { BlogContent } from '@/components/admin/shared/BlockEditor/types';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

// ISR: regenerate every 60 seconds. Admin API calls revalidatePath() on mutations.
export const revalidate = 60;

async function getProjectFromDB(slug: string): Promise<WorkDetail | null> {
  try {
    const project = await prisma.workProject.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
        published: true,
      },
    });

    if (!project) return null;

    // Get all projects for prev/next navigation
    const allProjects = await prisma.workProject.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      select: { slug: true, title: true, order: true },
    });

    const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
    const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
    const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

    const galleryImages = Array.isArray(project.galleryImages)
      ? (project.galleryImages as string[])
      : [];

    return {
      id: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      category: project.category,
      tags: project.tags,
      description: project.description,
      author: project.author,
      email: project.email,
      heroImage: project.heroImage,
      galleryImages,
      content: (project.content && typeof project.content === 'object' && 'blocks' in (project.content as object) ? project.content as unknown as BlogContent : null), // BlockEditor content if available
      previousProject: prevProject
        ? { id: prevProject.slug, title: prevProject.title }
        : undefined,
      nextProject: nextProject
        ? { id: nextProject.slug, title: nextProject.title }
        : undefined,
    };
  } catch (error) {
    console.error('Work detail DB fetch error:', error);
    return null;
  }
}

export default async function WorkDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try DB first, then fallback to hardcoded
  const project = (await getProjectFromDB(id)) ?? workDetails[id];

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Header />
      <WorkDetailPage project={project} />
      <Footer />
    </div>
  );
}
