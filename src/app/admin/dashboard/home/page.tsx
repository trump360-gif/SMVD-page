import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getHomePageData } from '@/lib/admin-data';
import HomeEditorClient from './HomeEditorClient';

export default async function HomeEditorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const { pageId, sections } = await getHomePageData();

  return <HomeEditorClient initialSections={sections} homePageId={pageId} />;
}
