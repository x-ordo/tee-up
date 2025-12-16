import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?next=/dashboard');
  }

  // Check if user has pro role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'pro') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Dashboard Navigation */}
      <nav className="border-b border-tee-ink-light/10 bg-tee-surface">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Home */}
            <Link
              href="/dashboard"
              className="font-pretendard text-xl font-bold text-tee-ink-strong"
            >
              대시보드
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard/portfolio"
                className="text-sm font-medium text-tee-ink-light transition-colors hover:text-tee-ink-strong"
              >
                포트폴리오
              </Link>
              <Link
                href="/dashboard/leads"
                className="text-sm font-medium text-tee-ink-light transition-colors hover:text-tee-ink-strong"
              >
                리드 관리
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium text-tee-ink-light transition-colors hover:text-tee-ink-strong"
              >
                설정
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-tee-ink-light">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm font-medium text-tee-ink-light transition-colors hover:text-tee-error"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
