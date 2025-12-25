'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, X, Sparkles, Building2, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// ===========================================
// New Pricing Structure (C+D Hybrid Model)
// Feature-gating instead of lead-based pricing
// ===========================================

interface PricingPlan {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  price: number;
  priceYearly: number;
  interval: 'month' | 'year';
  features: {
    text: string;
    included: boolean;
    highlight?: boolean;
  }[];
  isPopular?: boolean;
  isEnterprise?: boolean;
  icon: React.ReactNode;
  ctaText: string;
  ctaVariant: 'primary' | 'outline' | 'secondary';
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameKo: '무료',
    description: '인스타 프로필에 넣을 있어 보이는 내 페이지',
    price: 0,
    priceYearly: 0,
    interval: 'month',
    icon: <Zap className="h-6 w-6" />,
    features: [
      { text: '프로필 페이지 1개', included: true },
      { text: '무제한 리드 캡처', included: true, highlight: true },
      { text: '예약 요청 받기', included: true, highlight: true },
      { text: '기본 템플릿', included: true },
      { text: '카카오 오픈채팅 연동', included: true },
      { text: 'TEE:UP 브랜딩 표시', included: true },
      { text: '자동 리마인더', included: false },
      { text: '커스텀 도메인', included: false },
      { text: '결제 연동', included: false },
    ],
    ctaText: '무료로 시작하기',
    ctaVariant: 'outline',
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    nameKo: '프로',
    description: '노쇼 줄이고 예약 관리까지 한번에',
    price: 49000,
    priceYearly: 490000,
    interval: 'month',
    icon: <Sparkles className="h-6 w-6" />,
    isPopular: true,
    features: [
      { text: '프로필 페이지 1개', included: true },
      { text: '무제한 리드 캡처', included: true },
      { text: '예약 요청 받기', included: true },
      { text: '자동 리마인더 알림', included: true, highlight: true },
      { text: '노쇼 관리', included: true, highlight: true },
      { text: '예약 캘린더', included: true, highlight: true },
      { text: '커스텀 도메인 연결', included: true },
      { text: 'TEE:UP 브랜딩 제거', included: true },
      { text: '기본 방문자 분석', included: true },
    ],
    ctaText: 'Pro 시작하기',
    ctaVariant: 'primary',
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    nameKo: '프리미엄',
    description: '결제부터 정산까지 올인원 관리',
    price: 99000,
    priceYearly: 990000,
    interval: 'month',
    icon: <Crown className="h-6 w-6" />,
    features: [
      { text: '프로필 페이지 3개', included: true },
      { text: '무제한 리드 캡처', included: true },
      { text: '모든 Pro 기능 포함', included: true },
      { text: '결제 연동', included: true, highlight: true },
      { text: '정산 리포트', included: true, highlight: true },
      { text: '고급 방문자 분석', included: true },
      { text: '우선 고객 지원', included: true, highlight: true },
      { text: 'SEO 최적화 도구', included: true },
      { text: '카카오 알림 연동', included: true },
    ],
    ctaText: 'Premium 시작하기',
    ctaVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameKo: '엔터프라이즈',
    description: '아카데미 및 스튜디오를 위한 맞춤 플랜',
    price: -1, // Custom pricing
    priceYearly: -1,
    interval: 'month',
    icon: <Building2 className="h-6 w-6" />,
    isEnterprise: true,
    features: [
      { text: '무제한 프로필 페이지', included: true },
      { text: '무제한 리드 캡처', included: true },
      { text: '모든 Premium 기능 포함', included: true },
      { text: '화이트라벨 (완전 브랜딩 제거)', included: true, highlight: true },
      { text: 'API 접근', included: true, highlight: true },
      { text: 'CRM 연동', included: true },
      { text: '전담 계정 매니저', included: true, highlight: true },
      { text: '맞춤 온보딩', included: true },
      { text: 'SLA 보장', included: true },
    ],
    ctaText: '문의하기',
    ctaVariant: 'secondary',
  },
];

// Feature comparison data
const FEATURE_COMPARISON = [
  {
    category: '프로필 & 리드',
    features: [
      { name: '프로필 페이지', free: '1개', pro: '1개', premium: '3개', enterprise: '무제한' },
      { name: '리드 캡처', free: '무제한', pro: '무제한', premium: '무제한', enterprise: '무제한' },
      { name: '예약 요청', free: true, pro: true, premium: true, enterprise: true },
      { name: '카카오 연동', free: true, pro: true, premium: true, enterprise: true },
    ],
  },
  {
    category: '예약 관리',
    features: [
      { name: '자동 리마인더', free: false, pro: true, premium: true, enterprise: true },
      { name: '노쇼 관리', free: false, pro: true, premium: true, enterprise: true },
      { name: '예약 캘린더', free: false, pro: true, premium: true, enterprise: true },
      { name: '카카오 알림', free: false, pro: true, premium: true, enterprise: true },
    ],
  },
  {
    category: '브랜딩',
    features: [
      { name: 'TEE:UP 로고 제거', free: false, pro: true, premium: true, enterprise: true },
      { name: '커스텀 도메인', free: false, pro: true, premium: true, enterprise: '다중' },
      { name: '화이트라벨', free: false, pro: false, premium: false, enterprise: true },
    ],
  },
  {
    category: '결제 & 분석',
    features: [
      { name: '결제 연동', free: false, pro: false, premium: true, enterprise: true },
      { name: '정산 리포트', free: false, pro: false, premium: true, enterprise: true },
      { name: '방문자 분석', free: false, pro: '기본', premium: '고급', enterprise: '고급' },
      { name: 'SEO 최적화', free: false, pro: false, premium: true, enterprise: true },
    ],
  },
  {
    category: '지원',
    features: [
      { name: '이메일 지원', free: true, pro: true, premium: true, enterprise: true },
      { name: '우선 지원', free: false, pro: false, premium: true, enterprise: true },
      { name: '전담 매니저', free: false, pro: false, premium: false, enterprise: true },
      { name: '맞춤 온보딩', free: false, pro: false, premium: false, enterprise: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: '무료 플랜으로도 충분한가요?',
    answer: '네! 무료 플랜만으로도 있어 보이는 프로필 페이지를 만들고, 무제한으로 예약 요청을 받을 수 있습니다. 노쇼 관리나 자동 리마인더가 필요해지면 Pro로 업그레이드하세요.',
  },
  {
    question: 'Pro와 Premium의 차이가 뭔가요?',
    answer: 'Pro는 예약 관리에 집중합니다 (리마인더, 노쇼 관리, 캘린더). Premium은 여기에 결제 연동과 정산 리포트가 추가됩니다. 카드 결제를 받고 싶다면 Premium을 추천합니다.',
  },
  {
    question: '연간 결제 시 얼마나 할인되나요?',
    answer: '연간 결제 시 약 17% 할인됩니다. Pro 플랜 기준 월 ₩49,000 → 연 ₩490,000 (월 ₩40,833 상당), Premium 플랜 기준 월 ₩99,000 → 연 ₩990,000 (월 ₩82,500 상당)입니다.',
  },
  {
    question: '언제든지 플랜을 변경할 수 있나요?',
    answer: '네, 언제든지 업그레이드 또는 다운그레이드가 가능합니다. 업그레이드 시 즉시 적용되며, 다운그레이드는 현재 결제 주기 종료 후 적용됩니다.',
  },
  {
    question: 'Enterprise 플랜은 어떤 경우에 적합한가요?',
    answer: '5명 이상의 프로가 소속된 골프 아카데미, 스튜디오, 또는 골프장에서 통합 관리가 필요한 경우에 적합합니다. 화이트라벨, API 연동, 전담 지원이 포함됩니다.',
  },
  {
    question: '환불 정책은 어떻게 되나요?',
    answer: '첫 결제 후 14일 이내에 요청 시 전액 환불해 드립니다. 14일 이후에는 남은 기간에 대한 환불은 제공되지 않으며, 결제 주기 종료 시까지 서비스를 이용할 수 있습니다.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.isEnterprise) {
      // Enterprise는 문의 페이지로 이동
      window.location.href = 'mailto:hello@teeup.golf?subject=Enterprise 플랜 문의';
      return;
    }

    if (!isAuthenticated || !user) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }

    if (user.role !== 'pro') {
      alert('프로 계정만 구독할 수 있습니다.');
      return;
    }

    if (plan.price === 0) {
      router.push('/dashboard');
      return;
    }

    setIsLoading(plan.id);
    try {
      // TODO: Implement new payment flow
      router.push(`/payment/checkout?plan=${plan.id}&interval=${billingInterval}`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(null);
    }
  };

  const getDisplayPrice = (plan: PricingPlan) => {
    if (plan.price === -1) return null;
    if (plan.price === 0) return { amount: 0, period: '' };

    const amount = billingInterval === 'year' ? plan.priceYearly : plan.price;
    const period = billingInterval === 'year' ? '/년' : '/월';
    const monthlyEquivalent = billingInterval === 'year' ? Math.round(plan.priceYearly / 12) : null;

    return { amount, period, monthlyEquivalent };
  };

  return (
    <div className="min-h-screen bg-tee-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-tee-stone bg-tee-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-2xl font-bold text-tee-ink-strong">
            TEE<span className="text-tee-accent-primary">:</span>UP
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild variant="primary" size="sm">
                <Link href="/dashboard">대시보드</Link>
              </Button>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-tee-ink-light hover:text-tee-ink-strong">
                  로그인
                </Link>
                <Button asChild variant="primary" size="sm">
                  <Link href="/auth/signup">시작하기</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 pb-24 pt-28">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-tee-accent-primary/20 bg-tee-accent-primary/5 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-tee-accent-primary" />
              <span className="text-sm font-medium text-tee-accent-primary">기능 기반 요금제</span>
            </div>
            <h1 className="mb-4 font-display text-4xl font-bold text-tee-ink-strong md:text-5xl">
              당신의 브랜드에 맞는 <span className="text-tee-accent-primary">플랜</span>을 선택하세요
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-tee-ink-light">
              모든 플랜에서 무제한 리드 캡처가 가능합니다.
              <br />
              필요한 기능에 따라 플랜을 선택하세요.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium transition-colors ${
                billingInterval === 'month' ? 'text-tee-ink-strong' : 'text-tee-ink-muted'
              }`}
            >
              월간 결제
            </span>
            <button
              onClick={() => setBillingInterval((prev) => (prev === 'month' ? 'year' : 'month'))}
              role="switch"
              aria-checked={billingInterval === 'year'}
              aria-label={`결제 주기 전환 (현재: ${billingInterval === 'year' ? '연간' : '월간'})`}
              className={`
                relative h-8 w-14 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-tee-accent-primary focus-visible:ring-offset-2
                ${billingInterval === 'year' ? 'bg-tee-accent-primary' : 'bg-tee-stone'}
              `}
            >
              <span
                className={`
                  absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform
                  ${billingInterval === 'year' ? 'translate-x-7' : 'translate-x-1'}
                `}
              />
            </button>
            <span
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                billingInterval === 'year' ? 'text-tee-ink-strong' : 'text-tee-ink-muted'
              }`}
            >
              연간 결제
              <span className="rounded-full bg-tee-success/10 px-2 py-0.5 text-xs font-semibold text-tee-success">
                17% 할인
              </span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan) => {
              const displayPrice = getDisplayPrice(plan);

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col overflow-hidden p-6 ${
                    plan.isPopular
                      ? 'border-2 border-tee-accent-primary ring-4 ring-tee-accent-primary/10'
                      : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute -right-8 top-4 rotate-45 bg-tee-accent-primary px-10 py-1 text-xs font-bold text-white">
                      추천
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <div className={`rounded-lg p-2 ${plan.isPopular ? 'bg-tee-accent-primary/10 text-tee-accent-primary' : 'bg-tee-stone/50 text-tee-ink-light'}`}>
                        {plan.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-tee-ink-strong">{plan.name}</h3>
                        <p className="text-xs text-tee-ink-muted">{plan.nameKo}</p>
                      </div>
                    </div>
                    <p className="text-sm text-tee-ink-light">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {displayPrice ? (
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-3xl font-bold text-tee-ink-strong">
                          {displayPrice.amount === 0 ? '무료' : `₩${displayPrice.amount.toLocaleString()}`}
                        </span>
                        {displayPrice.amount > 0 && (
                          <span className="text-sm text-tee-ink-muted">{displayPrice.period}</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-tee-ink-strong">맞춤 견적</div>
                    )}
                    {displayPrice?.monthlyEquivalent && (
                      <p className="mt-1 text-xs text-tee-ink-muted">
                        월 ₩{displayPrice.monthlyEquivalent.toLocaleString()} 상당
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-6 flex-1 space-y-3">
                    {plan.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${feature.highlight ? 'text-tee-accent-primary' : 'text-tee-success'}`} />
                        ) : (
                          <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-tee-ink-muted" />
                        )}
                        <span className={`text-sm ${feature.included ? (feature.highlight ? 'font-medium text-tee-ink-strong' : 'text-tee-ink-light') : 'text-tee-ink-muted'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isLoading === plan.id}
                    variant={plan.ctaVariant}
                    className="w-full"
                  >
                    {isLoading === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        처리 중...
                      </span>
                    ) : (
                      plan.ctaText
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Comparison Toggle */}
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 text-sm font-medium text-tee-accent-primary hover:underline"
            >
              {showComparison ? '기능 비교 숨기기' : '전체 기능 비교하기'}
              <svg
                className={`h-4 w-4 transition-transform ${showComparison ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Feature Comparison Table */}
          {showComparison && (
            <Card className="mb-16 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-tee-stone bg-tee-background">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-tee-ink-strong">기능</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-tee-ink-strong">Free</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-tee-accent-primary">
                        Pro
                        <span className="ml-1 rounded bg-tee-accent-primary/10 px-1.5 py-0.5 text-xs">추천</span>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-tee-ink-strong">Premium</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-tee-ink-strong">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURE_COMPARISON.map((category, categoryIndex) => (
                      <>
                        <tr key={`category-${categoryIndex}`} className="bg-tee-stone/30">
                          <td colSpan={5} className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-tee-ink-muted">
                            {category.category}
                          </td>
                        </tr>
                        {category.features.map((feature, featureIndex) => (
                          <tr
                            key={`feature-${categoryIndex}-${featureIndex}`}
                            className="border-b border-tee-stone/50 last:border-0"
                          >
                            <td className="px-6 py-3 text-sm text-tee-ink-light">{feature.name}</td>
                            <td className="px-4 py-3 text-center">
                              <FeatureValue value={feature.free} />
                            </td>
                            <td className="px-4 py-3 text-center bg-tee-accent-primary/5">
                              <FeatureValue value={feature.pro} highlight />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <FeatureValue value={feature.premium} />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <FeatureValue value={feature.enterprise} />
                            </td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* FAQ Section */}
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-tee-ink-strong">
              자주 묻는 질문
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {FAQ_ITEMS.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="mb-2 font-semibold text-tee-ink-strong">{faq.question}</h3>
                  <p className="text-sm leading-relaxed text-tee-ink-light">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Card className="mx-auto max-w-2xl border-tee-accent-primary/20 bg-gradient-to-br from-tee-accent-primary/5 to-transparent p-8">
              <h3 className="mb-3 text-xl font-bold text-tee-ink-strong">
                아직 결정이 어려우신가요?
              </h3>
              <p className="mb-6 text-tee-ink-light">
                무료로 시작해보세요. 언제든지 업그레이드할 수 있습니다.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild variant="primary" size="lg">
                  <Link href="/auth/signup">무료로 시작하기</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="mailto:hello@teeup.golf">문의하기</a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for feature comparison values
function FeatureValue({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={`mx-auto h-5 w-5 ${highlight ? 'text-tee-accent-primary' : 'text-tee-success'}`} />
    ) : (
      <X className="mx-auto h-5 w-5 text-tee-ink-muted/50" />
    );
  }
  return (
    <span className={`text-sm ${highlight ? 'font-medium text-tee-accent-primary' : 'text-tee-ink-light'}`}>
      {value}
    </span>
  );
}
