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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-tee-ink-strong">
          안녕하세요, {profile.title.split(' ')[0]}님
        </h1>
        <p className="mt-2 text-tee-ink-light">
          오늘도 좋은 하루 되세요!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Approval Status */}
      {!profile.is_approved && (
        <Card className="border-tee-warning/50 bg-tee-warning/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tee-warning/20">
              <svg className="h-5 w-5 text-tee-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-tee-ink-strong">
                프로필 승인 대기 중
              </h3>
              <p className="text-sm text-tee-ink-light">
                관리자 승인 후 프로필이 공개됩니다. 보통 1-2일 소요됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
