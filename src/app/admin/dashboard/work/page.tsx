import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getWorkPageData } from '@/lib/admin-data';
import type { WorkProjectData, WorkExhibitionData } from '@/hooks/useWorkEditor';
import WorkEditorClient from './WorkEditorClient';

export default async function WorkEditorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const { projects, exhibitions } = await getWorkPageData();

  return (
    <WorkEditorClient
      initialProjects={projects as unknown as WorkProjectData[]}
      initialExhibitions={exhibitions as unknown as WorkExhibitionData[]}
    />
  );
}
