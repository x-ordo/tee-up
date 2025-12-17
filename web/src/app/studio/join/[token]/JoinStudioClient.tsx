'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  type Studio,
  type StudioInvite,
  acceptStudioInvite,
} from '@/actions/studios';

interface JoinStudioClientProps {
  studio: Studio;
  invite: StudioInvite;
  token: string;
}

export function JoinStudioClient({
  studio,
  invite,
  token,
}: JoinStudioClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAccept = () => {
    startTransition(async () => {
      setError(null);
      const result = await acceptStudioInvite(token);

      if (result.success) {
        setSuccess(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.error || '초대 수락에 실패했습니다.');
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-tee-background flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-tee-surface rounded-2xl border border-tee-stone p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-tee-ink-strong mb-2">
            환영합니다!
          </h1>
          <p className="text-tee-ink-light mb-6">
            {studio.name}의 멤버가 되었습니다.
            <br />
            잠시 후 대시보드로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tee-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-tee-surface rounded-2xl border border-tee-stone p-8">
        {/* Studio Info */}
        <div className="text-center mb-8">
          {studio.logo_url ? (
            <img
              src={studio.logo_url}
              alt={studio.name}
              className="w-20 h-20 mx-auto rounded-xl object-cover mb-4"
            />
          ) : (
            <div className="w-20 h-20 mx-auto rounded-xl bg-tee-accent-primary/10 flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-tee-accent-primary" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-tee-ink-strong">
            {studio.name}
          </h1>
          {studio.location && (
            <p className="text-sm text-tee-ink-light mt-1">{studio.location}</p>
          )}
        </div>

        {/* Invite Info */}
        <div className="bg-tee-stone/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-tee-ink-light" />
            <div>
              <p className="text-sm text-tee-ink-strong font-medium">
                스튜디오 가입 초대
              </p>
              <p className="text-xs text-tee-ink-muted">
                이 초대를 수락하면 {studio.name}의 멤버가 됩니다.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleAccept}
            disabled={isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? '처리 중...' : '초대 수락하기'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            disabled={isPending}
            className="w-full"
          >
            취소
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-tee-ink-muted text-center mt-6">
          초대를 수락하려면 프로 계정이 필요합니다.
          <br />
          아직 프로 계정이 없다면 먼저 가입해주세요.
        </p>
      </div>
    </div>
  );
}
