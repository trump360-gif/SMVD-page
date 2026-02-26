import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth';
import { getNewsPageData } from '@/lib/admin-data';
import NewsEditorClient from './NewsEditorClient';
import type { NewsArticleData } from '@/hooks/useNewsEditor';

export default async function NewsEditorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/admin/login');

  const { articles } = await getNewsPageData();

  return <NewsEditorClient initialArticles={articles as unknown as NewsArticleData[]} />;
}
