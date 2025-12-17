import { redirect } from 'next/navigation';
import { validateStudioInvite } from '@/actions/studios';
import { JoinStudioClient } from './JoinStudioClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinStudioPage({ params }: PageProps) {
  const { token } = await params;

  const result = await validateStudioInvite(token);

  if (!result.success || !result.data) {
    // Invalid or expired invite
    redirect('/studio/join/invalid');
  }

  const { studio, invite } = result.data;

  return <JoinStudioClient studio={studio} invite={invite} token={token} />;
}
