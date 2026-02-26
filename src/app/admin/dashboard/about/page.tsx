import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getAboutPageData } from '@/lib/admin-data';
import AboutEditorClient from './AboutEditorClient';
import type { AboutSection, AboutPerson } from '@/hooks/useAboutEditor';

export default async function AboutEditorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const { sections, people } = await getAboutPageData();

  return (
    <AboutEditorClient
      initialSections={sections as unknown as AboutSection[]}
      initialPeople={people as unknown as AboutPerson[]}
    />
  );
}
