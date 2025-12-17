import { notFound, redirect } from 'next/navigation';
import { getStudioById, getStudioDashboardStats } from '@/actions/studios';
import { StudioDashboardClient } from './StudioDashboardClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioDashboardPage({ params }: PageProps) {
  const { id } = await params;

  const [studioResult, statsResult] = await Promise.all([
    getStudioById(id),
    getStudioDashboardStats(id),
  ]);

  if (!studioResult.success) {
    // Check if unauthorized
    if (studioResult.error === 'Not authenticated') {
      redirect('/auth/login?redirect=/dashboard/studio/' + id);
    }
    notFound();
  }

  if (!studioResult.data) {
    notFound();
  }

  const studio = studioResult.data;
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <StudioDashboardClient
      studio={studio}
      initialStats={stats}
    />
  );
}
