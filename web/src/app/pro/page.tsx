import Link from 'next/link';
import ConsultationChannels from './ConsultationChannels';
import EarningsCalculator from './components/EarningsCalculator';
import { TrackedLink, PageViewTracker } from '@/components/analytics';

export default function ProLandingPage() {
  return (
    <div className="bg-tee-background text-tee-ink-strong">
      {/* Analytics Tracking */}
      <PageViewTracker pageType="pro_landing" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tee-background via-white to-tee-background" aria-hidden="true" />
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-tee-accent-primary/10 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-tee-stone bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-light">
              Pro Manager Service
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              프로 골퍼 전용 매니저 서비스
            </h1>
            <p className="text-lg text-tee-ink-light">
              명품급 프로필, 홍보/PR, 일정/문의 관리를 한 번에. 더 높은 가치의 계약과 스폰서십을 만들 수 있도록 팀이 함께합니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <TrackedLink
                href="/onboarding/quick-setup"
                trackId="pro_hero_signup"
                ctaType="signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-tee-accent-secondary px-8 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                지금 등록하기
              </TrackedLink>
              <a
                href="#consultation"
                className="inline-flex h-12 items-center justify-center rounded-full border-2 border-tee-accent-secondary px-6 text-sm font-semibold text-tee-accent-secondary transition-colors hover:bg-tee-accent-secondary/10"
              >
                상담 먼저 받기
              </a>
            </div>
            <p className="text-sm text-tee-ink-muted">
              프로 인증 완료 시 24시간 내 노출이 시작되고 리드 연결이 진행됩니다.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-tee-ink-muted">
              <span className="rounded-full border border-tee-stone/60 bg-white/70 px-3 py-1">프로 인증 보장</span>
              <span className="rounded-full border border-tee-stone/60 bg-white/70 px-3 py-1">전담 매니저 배정</span>
              <span className="rounded-full border border-tee-stone/60 bg-white/70 px-3 py-1">맞춤형 템플릿 제작</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Stats Section */}
      <section className="border-y border-tee-accent-secondary/20 bg-gradient-to-r from-tee-accent-secondary/5 via-white to-tee-accent-secondary/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <span className="text-4xl font-bold text-tee-accent-secondary">150+</span>
              <p className="mt-2 text-sm text-tee-ink-light">등록된 프로</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-tee-accent-secondary">89%</span>
              <p className="mt-2 text-sm text-tee-ink-light">리드 전환율</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-tee-accent-secondary">3.2x</span>
              <p className="mt-2 text-sm text-tee-ink-light">평균 문의 증가</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-tee-accent-secondary">24h</span>
              <p className="mt-2 text-sm text-tee-ink-light">프로필 공개</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Gradient Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-tee-accent-secondary/40 to-transparent" />

      {/* Earnings Calculator Section */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">
              ROI Calculator
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-tee-ink-strong">
              나의 예상 수익은?
            </h2>
            <p className="mt-4 text-tee-ink-light">
              주당 레슨 수와 희망 단가를 입력하면 월 예상 수익을 계산해드립니다.
              TEE:UP과 함께 효율적인 리드 관리로 수익을 극대화하세요.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tee-accent-secondary/10">
                  <svg className="h-4 w-4 text-tee-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-tee-ink-light">프로필 공개 후 평균 3.2배 문의 증가</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tee-accent-secondary/10">
                  <svg className="h-4 w-4 text-tee-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-tee-ink-light">리드 전환율 89% 달성</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tee-accent-secondary/10">
                  <svg className="h-4 w-4 text-tee-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-tee-ink-light">Pro 요금제 시 수수료 0%</span>
              </div>
            </div>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-tee-stone/40 to-transparent" />

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: '명품급 프로필', copy: '프리미엄 톤의 프로필과 콘텐츠 구성을 제공해 브랜드 가치를 올립니다.' },
            { title: '홍보/PR 운영', copy: '스토리텔링, 미디어 노출, 스폰서십 연결을 위한 홍보 전략을 운영합니다.' },
            { title: '일정/문의 관리', copy: '리드 수집부터 일정 조율까지, 매니저가 직접 케어합니다.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-tee-stone/60 bg-white p-6 shadow-card">
              <h3 className="text-base font-semibold text-tee-ink-strong">{item.title}</h3>
              <p className="mt-3 text-sm text-tee-ink-light">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-tee-stone/60 bg-white p-8 shadow-card">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Concierge</p>
              <h2 className="mt-2 text-2xl font-semibold">전담 매니저가 붙는 프리미엄 케어</h2>
              <p className="mt-3 text-sm text-tee-ink-light">
                고액 구독 시 실제 매니저가 프로필 제작, 일정 관리, 브랜드 제안을 전담합니다.
              </p>
            </div>
            <div className="rounded-2xl border border-tee-stone bg-tee-background px-5 py-4 text-sm text-tee-ink-light">
              맞춤 제작 · 전담 운영 · 스폰서십 컨설팅
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Templates</p>
            <h2 className="mt-2 text-2xl font-semibold">프로만을 위한 프리미엄 템플릿</h2>
          </div>
          <span className="text-xs text-tee-ink-muted">맞춤 제작 가능</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Signature Visual', 'Performance Story', 'Media Centric'].map((label) => (
            <div key={label} className="rounded-2xl border border-tee-stone/60 bg-white p-6 shadow-card">
              <div className="h-28 rounded-xl bg-gradient-to-br from-tee-background to-white" />
              <p className="mt-4 text-sm font-semibold text-tee-ink-strong">{label}</p>
              <p className="mt-2 text-xs text-tee-ink-muted">프로필 톤과 스토리에 맞춰 템플릿을 커스텀합니다.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-tee-stone/60 bg-white p-8 shadow-card">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Proof</p>
              <h3 className="mt-2 text-lg font-semibold">인증 기반 신뢰</h3>
              <p className="mt-2 text-sm text-tee-ink-light">협회/리그 인증을 우선으로 검증합니다.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">SLA</p>
              <h3 className="mt-2 text-lg font-semibold">운영 기준 1차 응답</h3>
              <p className="mt-2 text-sm text-tee-ink-light">운영 기준 평균 1시간 내 1차 응답을 유지합니다.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Results</p>
              <h3 className="mt-2 text-lg font-semibold">리드 전환 성장</h3>
              <p className="mt-2 text-sm text-tee-ink-light">프로필 공개 후 문의 전환율 개선 사례를 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-tee-stone/60 bg-tee-background p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Pricing</p>
              <h3 className="mt-2 text-2xl font-semibold">요금제와 컨시어지 옵션을 확인하세요</h3>
              <p className="mt-2 text-sm text-tee-ink-light">운영팀 상담 전 요금 기준과 혜택을 확인할 수 있습니다.</p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-full bg-tee-accent-secondary px-6 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              요금제 확인
            </Link>
          </div>
        </div>
      </section>

      <section id="consultation" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-[1.1fr,1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Consultation</p>
            <h2 className="mt-2 text-3xl font-semibold">상담 방식은 직접 선택하세요</h2>
            <p className="mt-4 text-sm text-tee-ink-light">
              채팅, 간단 폼, 콜백 예약 중 원하는 방식으로 상담을 시작할 수 있습니다. 팀이 확인 후 빠르게 안내드립니다.
            </p>
          </div>
          <ConsultationChannels />
        </div>
      </section>
    </div>
  );
}
