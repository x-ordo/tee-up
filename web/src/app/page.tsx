import Link from 'next/link';
import { getLandingRecommendations } from '@/actions/profiles';
import ConsumerConsultationCard from './components/ConsumerConsultationCard';
import RotatingTestimonials from './components/RotatingTestimonials';

type RecommendationCard = {
  name: string;
  region: string;
  focus: string;
  tags: string[];
  slug?: string;
  profileImageUrl?: string | null;
  rating?: number | null;
  review?: string | null;
  reviewer?: string | null;
  testimonials?: Array<{ quote: string; name?: string; rating?: number }>;
};

const fallbackRecommendations: RecommendationCard[] = [
  {
    name: '김서연 프로',
    region: '서울 · 경기',
    focus: '숏게임/웨지 정밀',
    tags: ['KPGA 인증', '커리큘럼 맞춤', '주말 레슨'],
    rating: 4.9,
    review: '“스윙 감각을 세밀하게 잡아줘서 가장 빠르게 실력이 올라갔어요.”',
    reviewer: '수강생',
    testimonials: [
      { quote: '스윙 감각을 세밀하게 잡아줘서 가장 빠르게 실력이 올라갔어요.', name: '수강생', rating: 5 },
      { quote: '짧은 시간에 핵심 포인트를 짚어줘서 만족합니다.', name: '수강생', rating: 4.8 },
    ],
  },
  {
    name: '박지훈 프로',
    region: '부산 · 경남',
    focus: '드라이버 비거리',
    tags: ['KLPGA 인증', '영상 분석', '스윙 교정'],
    rating: 4.8,
    review: '“짧은 시간에도 문제를 정확히 짚어줘서 만족했습니다.”',
    reviewer: '수강생',
    testimonials: [
      { quote: '짧은 시간에도 문제를 정확히 짚어줘서 만족했습니다.', name: '수강생', rating: 4.8 },
      { quote: '영상 분석이 구체적이라 재현이 쉬웠어요.', name: '수강생', rating: 4.7 },
    ],
  },
  {
    name: '이서아 프로',
    region: '인천 · 경기',
    focus: '멘탈/코스 매니지먼트',
    tags: ['투어 경험', '라운딩 코칭', '퍼팅'],
    rating: 4.9,
    review: '“라운딩 상황별 멘탈 루틴이 특히 도움이 됐어요.”',
    reviewer: '수강생',
    testimonials: [
      { quote: '라운딩 상황별 멘탈 루틴이 특히 도움이 됐어요.', name: '수강생', rating: 4.9 },
      { quote: '코스 매니지먼트 접근이 현실적이라 바로 적용됐습니다.', name: '수강생', rating: 4.8 },
    ],
  },
];

const faqs = [
  {
    question: '상담 비용이 있나요?',
    answer: '첫 상담은 무료입니다. 세부 비용은 프로별로 안내됩니다.',
  },
  {
    question: '추천 기준은 무엇인가요?',
    answer: '실력/경력, 활동 지역, 선호 스타일을 종합해 매칭합니다.',
  },
  {
    question: '원하지 않으면 취소할 수 있나요?',
    answer: '상담 단계에서는 언제든 중단 가능합니다.',
  },
  {
    question: '응답은 얼마나 걸리나요?',
    answer: '평균 24시간 이내 1차 응답을 목표로 합니다.',
  },
];

export default async function ConsumerLandingPage() {
  const recommendationResult = await getLandingRecommendations(3);
  const recommendations: RecommendationCard[] = recommendationResult.success && recommendationResult.data.length > 0
    ? recommendationResult.data
    : fallbackRecommendations;
  const ratingDateLabel = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  return (
    <div className="bg-tee-background text-tee-ink-strong">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tee-background via-white to-tee-background" aria-hidden="true" />
        <div className="absolute -top-28 left-0 h-72 w-72 rounded-full bg-tee-accent-secondary/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-tee-accent-primary/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-start">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-tee-stone bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-light">
              Verified Pro Matching
            </span>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              검증된 프로에게,
              <br />
              가장 빠른 매칭
            </h1>
            <p className="text-lg text-tee-ink-light">
              AI 추천 + 운영팀 검수로 신뢰도를 높였습니다. 불필요한 절차 없이 상담만 시작하세요.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#chat"
                className="inline-flex h-12 items-center justify-center rounded-full bg-tee-accent-primary px-6 text-sm font-semibold text-white shadow-lg"
              >
                프로 추천 받기
              </a>
              <Link
                href="/pro"
                className="inline-flex h-12 items-center justify-center rounded-full border border-tee-stone px-6 text-sm font-semibold text-tee-ink-strong"
              >
                프로 전용 서비스 보기
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-tee-ink-muted">
              <span className="rounded-full border border-tee-stone/60 bg-white/70 px-3 py-1">프로 인증 서류 확인</span>
              <span className="rounded-full border border-tee-stone/60 bg-white/70 px-3 py-1">운영팀 1차 리뷰</span>
              <span className="rounded-full border border-tee-stone/60 bg-white/70 px-3 py-1">매칭 후 직접 소통</span>
            </div>
          </div>

          <div id="chat">
            <ConsumerConsultationCard />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-tee-stone/60 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Trust Proof</p>
            <h3 className="mt-2 text-xl font-semibold">검증된 프로만 추천합니다</h3>
            <p className="mt-3 text-sm text-tee-ink-light">
              프로 인증 서류 확인 · 활동 지역/경력 검증 · 운영팀 1차 리뷰를 통과한 프로만 노출됩니다.
            </p>
          </div>
          <div className="rounded-3xl border border-tee-stone/60 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">Responder</p>
            <h3 className="mt-2 text-xl font-semibold">누가 답변하나요?</h3>
            <p className="mt-3 text-sm text-tee-ink-light">
              초기 응답은 운영팀(컨시어지)이 진행합니다. 매칭 확정 후에는 해당 프로가 직접 소통합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">AI Recommendation</p>
            <h2 className="mt-2 text-2xl font-semibold">추천 프로 미리보기</h2>
            <p className="mt-2 text-sm text-tee-ink-light">
              온톨로지 기반 추천으로 적합한 프로를 선별합니다.
            </p>
          </div>
          <span className="text-xs text-tee-ink-muted">맞춤 추천은 상담 후 제공</span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {recommendations.map((pro) => {
            const testimonials = pro.testimonials ?? [];
            const ratingValues = testimonials
              .map((item) => item.rating)
              .filter((rating): rating is number => typeof rating === 'number');
            const averageRating = typeof pro.rating === 'number'
              ? pro.rating
              : ratingValues.length > 0
                ? ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length
                : null;
            const reviewCount = testimonials.length;

            return (
              <div key={pro.name} className="rounded-2xl border border-tee-stone/60 bg-white p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-tee-stone/40">
                  {pro.profileImageUrl ? (
                    <img
                      src={pro.profileImageUrl}
                      alt={pro.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-tee-ink-muted">
                      PROFILE
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-tee-ink-strong">{pro.name}</p>
                    <span className="rounded-full border border-tee-stone/70 bg-tee-background px-3 py-1 text-xs text-tee-ink-muted">
                      검증 완료
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-tee-ink-muted">{pro.region}</p>
                  <p className="mt-2 text-sm font-medium text-tee-ink-strong">{pro.focus}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-tee-ink-muted">
                <span className="rounded-full bg-tee-accent-primary/10 px-3 py-1 text-tee-accent-primary">
                  평균 {averageRating ? averageRating.toFixed(1) : '집계 중'}
                </span>
                <span className="rounded-full bg-tee-stone/40 px-3 py-1">
                  후기 {reviewCount > 0 ? reviewCount : '집계 중'}
                </span>
                {averageRating && (
                  <span aria-hidden="true" className="text-tee-accent-secondary">
                    {'★'.repeat(Math.min(5, Math.max(1, Math.round(averageRating))))}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-tee-ink-muted">
                후기 수 {reviewCount > 0 ? `${reviewCount}건` : '집계 중'} · 평점 집계일 {ratingDateLabel}
              </p>

              {pro.testimonials && pro.testimonials.length > 0 ? (
                <RotatingTestimonials testimonials={pro.testimonials} />
              ) : (
                <p className="mt-3 text-sm text-tee-ink-light">후기 수집 중입니다.</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {pro.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-tee-stone/40 px-3 py-1 text-xs text-tee-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>

              {pro.slug && (
                <div className="mt-5">
                  <Link
                    href={`/profile/${pro.slug}`}
                    className="text-xs font-semibold text-tee-accent-primary hover:underline"
                  >
                    프로필 보기
                  </Link>
                </div>
              )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl border border-tee-stone/60 bg-white p-8 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tee-ink-muted">FAQ</p>
          <h2 className="mt-2 text-2xl font-semibold">자주 묻는 질문</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-tee-stone/60 bg-tee-background px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-tee-ink-strong">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-tee-ink-light">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-tee-stone/60 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-xs text-tee-ink-muted md:flex-row md:items-center md:justify-between">
          <p>신뢰 기반 상담을 약속합니다. 개인정보는 안전하게 보호됩니다.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms" className="hover:text-tee-ink-strong">이용약관</Link>
            <Link href="/legal/privacy" className="hover:text-tee-ink-strong">개인정보 처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
