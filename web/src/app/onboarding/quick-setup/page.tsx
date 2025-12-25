'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import QuickSetupWizard, { type QuickSetupData } from '@/components/onboarding/QuickSetupWizard';
import { createQuickProfile } from '@/actions/profiles';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function QuickSetupPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/onboarding/quick-setup');
        return;
      }
      if (user?.role !== 'pro') {
        router.push('/dashboard');
        return;
      }
      setIsReady(true);
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleComplete = async (data: QuickSetupData) => {
    const result = await createQuickProfile({
      name: data.name,
      bio: data.bio,
      specialty: data.specialty,
      location: data.location,
      priceRange: data.priceRange,
      contactType: data.contactType,
      contactValue: data.contactValue,
    });

    return result;
  };

  if (isLoading || !isReady) {
    return <LoadingSpinner message="로딩 중..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-tee-background to-white">
      {/* Header */}
      <header className="border-b border-tee-stone bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-bold text-tee-ink-strong">
            TEE<span className="text-tee-accent-primary">:</span>UP
          </Link>
          <p className="text-sm text-tee-ink-muted">
            5분 안에 완료!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-tee-ink-strong">
              빠른 프로필 설정
            </h1>
            <p className="text-tee-ink-light">
              인스타그램에 바로 공유할 수 있는
              <br />
              멋진 프로필 페이지를 만들어보세요
            </p>
          </div>

          <QuickSetupWizard onComplete={handleComplete} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-tee-stone bg-white py-6">
        <p className="text-center text-xs text-tee-ink-muted">
          나중에 대시보드에서 더 자세한 정보를 추가할 수 있어요
        </p>
      </footer>
    </div>
  );
}
