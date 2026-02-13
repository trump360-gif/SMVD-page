'use client';

import {
  Header,
  Footer,
} from '@/components/public/home';
import { WorkDetailPage } from '@/components/public/work';
import { workDetails } from '@/constants/work-details';
import { useParams } from 'next/navigation';

export default function WorkDetailRoute() {
  const params = useParams();
  const id = params?.id as string;

  const project = workDetails[id];

  if (!project) {
    return (
      <div>
        <Header />
        <div style={{ padding: '80px 40px', textAlign: 'center' }}>
          <h1>Project not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <WorkDetailPage project={project} />
      <Footer />
    </div>
  );
}
