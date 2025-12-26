import Link from 'next/link';
import { getCurrentUserProfile } from '@/actions/profiles';
import { getLeadStats } from '@/actions/leads';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default async function DashboardPage() {
  const profileResult = await getCurrentUserProfile();
  const leadStatsResult = await getLeadStats();

  const profile = profileResult.success ? profileResult.data : null;
  const leadStats = leadStatsResult.success ? leadStatsResult.data : null;

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold text-tee-ink-strong">
          프로 프로필이 없습니다
        </h1>
        <p className="mb-8 text-tee-ink-light">
          먼저 프로 프로필을 생성해주세요.
        </p>
        <Button asChild>
          <Link href="/dashboard/portfolio">프로필 만들기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-space-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-h2 font-pretendard text-tee-ink-strong">
          안녕하세요, {profile.title.split(' ')[0]}님
        </h1>
        <p className="mt-space-2 text-body text-tee-ink-light">
          오늘도 좋은 하루 되세요!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-space-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-tee-ink-light">
              프로필 조회수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-tee-ink-strong">
              {profile.profile_views.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-tee-ink-light">
              이번 달 리드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-tee-ink-strong">
              {leadStats?.monthly_leads || 0}
            </div>
            {leadStats && !leadStats.is_premium && (
              <p className="mt-1 text-xs text-tee-ink-light">
                무료 리드 {leadStats.free_leads_remaining}개 남음
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-tee-ink-light">
              전체 리드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-tee-ink-strong">
              {leadStats?.total_leads || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-tee-ink-light">
              구독 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-tee-accent-primary capitalize">
              {profile.subscription_tier}
            </div>
            {profile.subscription_tier === 'free' && (
              <Button variant="link" className="mt-1 h-auto p-0 text-xs" asChild>
                <Link href="/dashboard/settings">업그레이드</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-space-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>포트폴리오 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-tee-ink-light">
              템플릿 변경, 섹션 편집, 이미지 업로드
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/portfolio">편집하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>리드 확인</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-tee-ink-light">
              새로운 문의 확인 및 관리
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/leads">확인하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>프로필 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-tee-ink-light">
              방문자에게 보이는 화면 확인
            </p>
            <Button variant="outline" asChild>
              <a href={`/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                미리보기
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Approval Status - Enhanced UX */}
      {!profile.is_approved && (
        <Card className="border-tee-info/30 bg-gradient-to-r from-tee-info/5 to-transparent">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tee-info/10">
                <svg className="h-6 w-6 text-tee-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-tee-ink-strong">
                  프로필 승인 대기 중 (1-2일 소요)
                </h3>
                <p className="mt-1 text-sm text-tee-ink-light">
                  승인이 완료되면 알림을 보내드립니다. 그동안 아래 작업을 진행해보세요!
                </p>

                {/* What you can do now */}
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-tee-ink-muted">
                    지금 할 수 있는 작업
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/dashboard/portfolio"
                      className="inline-flex items-center gap-1.5 rounded-full bg-tee-surface px-3 py-1.5 text-xs font-medium text-tee-ink-strong shadow-sm transition-all hover:bg-tee-stone/50 hover:shadow"
                    >
                      <svg className="h-3.5 w-3.5 text-tee-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      포트폴리오 꾸미기
                    </Link>
                    <Link
                      href="/dashboard/portfolio"
                      className="inline-flex items-center gap-1.5 rounded-full bg-tee-surface px-3 py-1.5 text-xs font-medium text-tee-ink-strong shadow-sm transition-all hover:bg-tee-stone/50 hover:shadow"
                    >
                      <svg className="h-3.5 w-3.5 text-tee-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      사진 업로드
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="inline-flex items-center gap-1.5 rounded-full bg-tee-surface px-3 py-1.5 text-xs font-medium text-tee-ink-strong shadow-sm transition-all hover:bg-tee-stone/50 hover:shadow"
                    >
                      <svg className="h-3.5 w-3.5 text-tee-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      연락처 설정
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
