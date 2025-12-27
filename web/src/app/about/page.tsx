import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-theme(spacing.20))] items-center justify-center overflow-hidden px-space-4 py-space-16 md:py-space-32">
        <div className="relative z-10 mx-auto max-w-screen-md text-center bg-tee-surface p-space-8 rounded-xl shadow-card">
          <div className="mb-space-4 inline-flex items-center gap-space-2 rounded-full border border-tee-ink-light/20 bg-tee-background px-space-4 py-space-1">
            <span className="h-space-2 w-space-2 animate-pulse rounded-full bg-tee-accent-primary" />
            <span className="text-caption font-medium text-tee-ink-light">AI가 추천하는 맞춤 프로</span>
          </div>

          <h1 className="mb-space-4 text-h1 font-bold leading-tight tracking-tight text-tee-ink-strong">
            나에게 꼭 맞는
            <br />
            <span className="text-tee-accent-primary">프리미엄 골프 레슨을 간편하게</span>
          </h1>

          <p className="mx-auto mb-space-8 max-w-prose text-body leading-normal text-tee-ink-strong">
            투어 경험이 풍부한 프로들을 한눈에 비교하고, 원하는 스타일로 바로 상담하세요.
            AI 추천과 실시간 매칭으로 실력 향상의 지름길을 안내합니다.
          </p>

          <div className="flex justify-center">
            <Button asChild variant="primary" size="lg">
              <Link href="/onboarding/mood">
                3분 만에 AI 매칭 시작하기
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-space-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="flex flex-col items-center gap-space-1 text-tee-ink-light">
            <span className="text-caption uppercase tracking-wider">Scroll</span>
            <svg className="h-space-5 w-space-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* AI Matching Section */}
      <section className="bg-tee-background px-space-4 py-space-16 md:py-space-32">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-space-12 text-center">
            <h2 className="mb-space-4 text-h2 font-bold text-tee-ink-strong">
              AI가 찾아주는
              <br />
              <span className="text-tee-accent-primary">나만의 프로</span>
            </h2>
            <p className="mx-auto max-w-prose text-body text-tee-ink-strong">
              몇 가지 질문에 답하면 내 플레이 성향과 목표에 딱 맞는 프로를 추천해드려요.
            </p>
          </div>

          <div className="grid gap-space-8 md:grid-cols-3 stagger-fade-in">
            {[
              {
                icon: '🎯',
                title: '목표 설정',
                description: '현재 실력과 바라는 변화를 알려주세요.',
              },
              {
                icon: '🤖',
                title: 'AI 추천',
                description: '수천 건의 데이터를 기반으로 어울리는 프로를 찾아드려요.',
              },
              {
                icon: '✨',
                title: '바로 상담',
                description: '마음에 드는 프로와 바로 상담을 시작해보세요.',
              },
            ].map((step, idx) => (
              <Card
                key={idx}
                className="group p-space-8"
              >
                <div className="mb-space-6 text-6xl">{step.icon}</div>
                <h3 className="mb-space-3 text-h3 font-bold text-tee-ink-strong">{step.title}</h3>
                <p className="text-body leading-normal text-tee-ink-strong">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pros Snippet */}
      <section className="px-space-4 py-space-16 md:py-space-32">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-space-12 text-center">
            <h2 className="mb-space-4 text-h2 font-bold text-tee-ink-strong">
              믿고 맡길 수 있는 프로 골퍼
            </h2>
            <p className="mx-auto max-w-prose text-body text-tee-ink-strong">
              LPGA, PGA 투어 경험을 갖춘 프로들이 친절하게 도와드립니다.
            </p>
          </div>

          {/* Abstract Pro Cards */}
          <div className="grid gap-space-6 md:grid-cols-3">
            {[
              { initial: 'H', title: 'LPGA Tour', tours: '8+ 투어' },
              { initial: 'J', title: 'PGA Master', tours: '10+ 투어' },
              { initial: 'S', title: 'KLPGA', tours: '5+ 투어' },
            ].map((pro, idx) => (
              <Card
                key={idx}
                className="group p-space-8"
              >
                <div className="flex items-center gap-space-6">
                  <div className="flex h-space-20 w-space-20 items-center justify-center rounded-full bg-tee-accent-primary text-3xl font-bold text-tee-surface">
                    {pro.initial}
                  </div>
                  <div>
                    <p className="mb-space-1 text-body font-medium text-tee-accent-secondary">{pro.title}</p>
                    <p className="text-h3 font-bold text-tee-ink-strong">{pro.tours}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-space-12 text-center">
            <Link
              href="/profile"
              className="inline-flex items-center gap-space-2 text-body font-semibold text-tee-accent-primary transition-all hover:gap-space-4"
            >
              모든 프로 살펴보기
              <svg className="h-space-5 w-space-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-tee-background px-space-4 py-space-16 md:py-space-32">
        <div className="mx-auto max-w-screen-xl">
          <Card className="p-space-16">
            <div className="grid gap-space-12 md:grid-cols-4">
              {[
                { value: '50+', label: '검증된 프로' },
                { value: '1,200+', label: '성공 매칭' },
                { value: '4.9', label: '평균 평점' },
                { value: '95%', label: '재예약률' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="mb-space-3 text-h1 font-bold text-tee-accent-secondary">
                    {stat.value}
                  </div>
                  <p className="text-body font-medium uppercase tracking-wide text-tee-ink-strong">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-space-4 py-space-16 md:py-space-32">
        <div className="mx-auto max-w-screen-lg">
          <Card className="border border-tee-accent-primary bg-tee-background p-space-16 text-center">
            <h2 className="mb-space-6 text-h2 font-bold text-tee-ink-strong">
              지금 바로 시작해보세요
            </h2>
            <p className="mx-auto mb-space-10 max-w-prose text-body text-tee-ink-strong">
              간단한 질문만으로 내게 맞는 프로를 추천받고, 바로 상담까지 이어가세요.
            </p>
            <Button asChild variant="primary" size="lg">
              <Link href="/get-started">
                무료 매칭 받아보기
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </div>
  )
}