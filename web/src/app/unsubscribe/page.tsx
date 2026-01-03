'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { unsubscribeFromRetargeting } from '@/actions/retargeting';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reason, setReason] = useState('');

  const handleUnsubscribe = async () => {
    if (!email) return;

    setStatus('loading');

    try {
      const result = await unsubscribeFromRetargeting({
        email,
        reason: reason || undefined,
      });

      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tee-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tee-success/10">
              <CheckCircle className="h-8 w-8 text-tee-success" />
            </div>
            <h1 className="text-xl font-bold text-tee-ink-strong">수신 거부 완료</h1>
            <p className="text-tee-ink-muted">
              더 이상 마케팅 이메일을 받지 않습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tee-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-tee-stone/50">
              <Mail className="h-8 w-8 text-tee-ink-light" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-tee-ink-strong">이메일 수신 거부</h1>
              <p className="mt-2 text-sm text-tee-ink-muted">
                TEE:UP 마케팅 이메일 수신을 거부합니다.
              </p>
            </div>
          </div>

          {email && (
            <div className="rounded-lg bg-tee-stone/30 p-3 text-center">
              <span className="text-sm text-tee-ink-light">{email}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-tee-ink-light">
              수신 거부 이유 (선택)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="피드백을 남겨주시면 서비스 개선에 참고하겠습니다."
              className="h-24 w-full resize-none rounded-lg border border-tee-stone bg-white p-3 text-sm text-tee-ink-strong placeholder:text-tee-ink-muted focus:border-tee-accent-primary focus:outline-none focus:ring-1 focus:ring-tee-accent-primary"
            />
          </div>

          {status === 'error' && (
            <p className="text-center text-sm text-tee-error">
              오류가 발생했습니다. 다시 시도해주세요.
            </p>
          )}

          <Button
            variant="primary"
            onClick={handleUnsubscribe}
            disabled={!email || status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '수신 거부하기'
            )}
          </Button>

          <p className="text-center text-xs text-tee-ink-muted">
            중요한 서비스 알림(예약 확인 등)은 계속 수신됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
