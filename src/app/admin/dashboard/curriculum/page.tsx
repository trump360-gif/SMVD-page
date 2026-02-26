import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getCurriculumPageData } from '@/lib/admin-data';
import CurriculumEditorClient from './CurriculumEditorClient';
import type { CurriculumSection } from '@/hooks/curriculum';

export default async function CurriculumEditorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const { sections } = await getCurriculumPageData();

  return <CurriculumEditorClient initialSections={sections as unknown as CurriculumSection[]} />;
}
