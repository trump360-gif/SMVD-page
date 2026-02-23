import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Professor } from '@/components/public/people/types';
import ProfessorDetailContent from './content';

export const revalidate = 60;

export async function generateStaticParams() {
  const professors = await prisma.people.findMany({
    select: { id: true },
    where: { archivedAt: null, role: { not: 'instructor' } },
  });
  
  return professors.map((prof) => ({
    id: prof.id,
  }));
}

export default async function ProfessorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = await prisma.people.findUnique({
    where: { id },
  });

  if (!person || person.archivedAt) {
    notFound();
  }

  const courses = (person.courses as Professor['courses']) ?? {
    undergraduate: [],
    graduate: [],
  };

  const biography = (person.biography as Professor['biography']) ?? {
    cvText: '',
    position: '',
    education: [],
    experience: [],
  };

  const professor: Professor = {
    id: person.id,
    name: person.name,
    badge: person.badge ?? '',
    office: person.office ?? '',
    email: person.email,
    phone: person.phone ?? '',
    homepage: person.homepage ?? undefined,
    courses,
    biography,
    profileImage: person.profileImage ?? '/images/people/default.png',
  };

  return <ProfessorDetailContent professor={professor} />;
}
