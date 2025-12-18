'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

interface DangerZoneProps {
  profileId: string;
}

export default function DangerZone({ profileId }: DangerZoneProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('확인을 위해 DELETE를 정확히 입력해주세요');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Delete pro profile first (cascade will handle related data)
      const { error: profileError } = await supabase
        .from('pro_profiles')
        .delete()
        .eq('id', profileId);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Sign out the user
      await supabase.auth.signOut();

      // Redirect to home
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '계정 삭제 중 오류가 발생했습니다');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Message */}
      <div className="rounded-lg border border-tee-warning/30 bg-tee-warning/5 p-4">
        <div className="flex gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-tee-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h4 className="font-medium text-tee-ink-strong">주의</h4>
            <p className="mt-1 text-sm text-tee-ink-light">
              계정을 삭제하면 모든 데이터(프로필, 포트폴리오, 리드 기록)가 영구적으로 삭제됩니다.
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="rounded-lg border border-tee-error/30 p-6">
        <h4 className="font-medium text-tee-error">계정 삭제</h4>
        <p className="mt-2 text-sm text-tee-ink-light">
          계정을 삭제하면 다음 데이터가 모두 삭제됩니다:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-tee-ink-light">
          <li>• 프로 프로필 및 포트폴리오</li>
          <li>• 모든 섹션 및 콘텐츠</li>
          <li>• 리드 및 문의 기록</li>
          <li>• 구독 정보</li>
        </ul>

        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            className="mt-4 border-tee-error text-tee-error hover:bg-tee-error/5"
            onClick={() => setShowDeleteConfirm(true)}
          >
            계정 삭제하기
          </Button>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="confirmDelete" className="block text-sm font-medium text-tee-ink-strong">
                확인을 위해 <span className="font-mono font-bold">DELETE</span>를 입력하세요
              </label>
              <Input
                id="confirmDelete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-1"
                disabled={isDeleting}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-tee-error/20 bg-tee-error/5 p-3">
                <p className="text-sm text-tee-error">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmText('');
                  setError(null);
                }}
                disabled={isDeleting}
              >
                취소
              </Button>
              <Button
                className="bg-tee-error hover:bg-tee-error/90"
                onClick={handleDeleteAccount}
                disabled={isDeleting || confirmText !== 'DELETE'}
              >
                {isDeleting ? '삭제 중...' : '영구 삭제'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Export Data */}
      <div className="rounded-lg bg-tee-stone/30 p-4">
        <h4 className="text-sm font-medium text-tee-ink-strong">데이터 내보내기</h4>
        <p className="mt-2 text-sm text-tee-ink-light">
          계정 삭제 전에 데이터를 내보내시겠습니까?
        </p>
        <Button variant="outline" className="mt-3" disabled>
          데이터 내보내기 (준비 중)
        </Button>
      </div>
    </div>
  );
}
