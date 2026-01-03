'use client';

import { Fragment, useState } from 'react';
import {
  HeroSection,
  StatsSection,
  ContactSection,
  AchievementsSection,
  SponsorshipsSection,
  MediaHighlightsSection,
  AvailabilitySection,
  BookingCalendarSection,
} from '../sections';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeConfig } from '@/actions/theme';
import { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

interface CurriculumItem {
  title: string;
  description: string;
  duration?: string;
}

interface PriceTier {
  name: string;
  price: string;
  duration: string;
  features?: string[];
  popular?: boolean;
}

interface CurriculumTemplateProps {
  profile: ProProfile & {
    highlights?: { label: string; value: string }[];
    curriculum?: CurriculumItem[];
    priceTiers?: PriceTier[];
    faq?: { question: string; answer: string }[];
    achievements?: { title: string; tourOrEvent?: string; year?: string; placement?: string; note?: string }[];
    sponsorships?: { brand: string; role?: string; period?: string; link?: string; logoUrl?: string }[];
    mediaHighlights?: { outlet?: string; headline: string; date?: string; link?: string; mediaType?: string; thumbnailUrl?: string }[];
    availability?: { region?: string; cadence?: string; preferredDays?: string; timeWindow?: string; seasonality?: string }[];
  };
  themeConfig?: ThemeConfig;
  sections?: { sectionType: string; title?: string | null; subtitle?: string | null }[];
}

/**
 * Curriculum Template - Teaching-focused portfolio
 * Best for: Pros with structured programs, methodology-driven
 * Sections: Hero, Stats, Curriculum, Pricing, FAQ, Contact
 */
export function CurriculumTemplate({ profile, sections, themeConfig: _themeConfig }: CurriculumTemplateProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const contactAnchor = '#contact';
  const heroCtaText = profile.booking_url
    ? '예약하기'
    : profile.open_chat_url
    ? '카카오톡 문의'
    : '레슨 문의하기';
  const primaryCtaLink =
    profile.payment_link || profile.booking_url || profile.open_chat_url;
  const pricingCtaHref = primaryCtaLink || contactAnchor;
  const pricingCtaLabel = primaryCtaLink ? '선택하기' : '문의하기';
  const pricingCtaExternal = Boolean(primaryCtaLink);

  const stats = profile.highlights || [
    { label: '레슨 경력', value: '10년+' },
    { label: '수강생', value: '500+' },
    { label: '평점', value: `${profile.rating || 4.9}` },
    { label: '조회수', value: `${profile.profile_views || 0}` },
  ];

  // Default curriculum if not provided
  const curriculum = profile.curriculum || [
    { title: '기초반', description: '골프 입문자를 위한 기초 과정', duration: '8주' },
    { title: '중급반', description: '스윙 교정 및 안정화 과정', duration: '12주' },
    { title: '상급반', description: '코스 전략 및 멘탈 관리', duration: '지속' },
  ];

  // Default pricing if not provided
  const priceTiers = profile.priceTiers || [
    { name: '1회 체험', price: '₩80,000', duration: '50분', features: ['스윙 분석', '맞춤 피드백'] },
    { name: '10회권', price: '₩700,000', duration: '50분 x 10', features: ['스윙 분석', '맞춤 커리큘럼', '영상 분석'], popular: true },
    { name: '20회권', price: '₩1,200,000', duration: '50분 x 20', features: ['전 과정 포함', 'VIP 케어', '라운드 동행'] },
  ];

  const fallbackSections = DEFAULT_SECTIONS.curriculum.map((section) => ({
    sectionType: section.section_type,
    title: section.title,
  }));
  const orderedSections = sections && sections.length > 0 ? sections : fallbackSections;

  const bioSection = profile.bio ? (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-tee-stone bg-tee-surface p-8 md:p-10">
          <h2 className="mb-4 font-pretendard text-2xl font-semibold tracking-[0.04em] text-tee-ink-strong">
            레슨 철학
          </h2>
          <p className="text-lg leading-relaxed text-tee-ink-light">
            {profile.bio}
          </p>
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {profile.certifications.slice(0, 4).map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-tee-accent-primary/20 bg-tee-accent-primary/5 px-3 py-1 text-xs font-medium text-tee-accent-primary"
                >
                  {cert}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  ) : null;

  const renderCurriculumSection = (title?: string, subtitle?: string) => (
    <section className="bg-tee-background px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
          {title || '커리큘럼 안내'}
        </h2>
        {subtitle && (
          <p className="-mt-8 mb-12 text-center text-sm font-medium tracking-[0.08em] text-tee-ink-light">
            {subtitle}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {curriculum.map((item, idx) => (
            <Card key={item.title} className="relative overflow-hidden">
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-tee-accent-primary/10 font-bold text-tee-accent-primary">
                {idx + 1}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                {item.duration && (
                  <p className="text-sm text-tee-accent-primary">{item.duration}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-tee-ink-light">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  const renderPricingSection = (title?: string, subtitle?: string) => (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-center font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
          {title || '수강료 안내'}
        </h2>
        <p className="mb-12 text-center text-lg font-medium tracking-[0.08em] text-tee-ink-light">
          {subtitle || '합리적인 가격, 최고의 가치'}
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {priceTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative p-8 transition-all duration-300 hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:scale-100 ${
                tier.popular ? 'border-2 border-tee-accent-primary' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tee-accent-primary px-4 py-1 text-xs font-bold text-white">
                  POPULAR
                </div>
              )}

              <h3 className="mb-2 text-2xl font-bold text-tee-ink-strong">
                {tier.name}
              </h3>
              <p className="mb-6 text-sm text-tee-ink-light">{tier.duration}</p>

              <div className="mb-8 border-t border-tee-ink-light/10 pt-6">
                <span className="text-4xl font-bold text-tee-accent-primary">
                  {tier.price}
                </span>
              </div>

              {tier.features && (
                <ul className="mb-8 space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-tee-ink-light">
                      <svg className="h-4 w-4 text-tee-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Button
                variant={tier.popular ? 'default' : 'outline'}
                className="w-full"
                asChild
              >
                <a
                  href={pricingCtaHref}
                  target={pricingCtaExternal ? '_blank' : undefined}
                  rel={pricingCtaExternal ? 'noopener noreferrer' : undefined}
                >
                  {pricingCtaLabel}
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );

  const renderFaqSection = (title?: string, subtitle?: string) => {
    if (!profile.faq || profile.faq.length === 0) return null;
    return (
      <section className="bg-tee-background px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
            {title || '자주 묻는 질문'}
          </h2>
          {subtitle && (
            <p className="-mt-8 mb-12 text-center text-sm font-medium tracking-[0.08em] text-tee-ink-light">
              {subtitle}
            </p>
          )}

          <div className="space-y-4">
            {profile.faq.map((item, idx) => (
              <Card key={idx} className="overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-tee-background/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-tee-accent-primary focus-visible:ring-inset"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  aria-expanded={expandedFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="pr-4 text-base font-medium text-tee-ink-strong">
                    {item.question}
                  </span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-tee-ink-light transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedFaq === idx ? 'max-h-96' : 'max-h-0'
                  }`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                >
                  <div className="border-t border-tee-stone px-6 pb-6 pt-4">
                    <p className="text-tee-ink-light">{item.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderSection = (section: { sectionType: string; title?: string | null; subtitle?: string | null }) => {
    const sectionTitle = typeof section.title === 'string' ? section.title.trim() : '';
    const sectionSubtitle = typeof section.subtitle === 'string' ? section.subtitle.trim() : '';

    switch (section.sectionType) {
      case 'hero':
        return (
          <HeroSection
            name={profile.title.split(' ')[0] || profile.title}
            title={profile.title}
            subtitle={profile.certifications?.[0]}
            heroImage={profile.hero_image_url || '/images/default-hero.jpg'}
            location={profile.location || undefined}
            contactUrl={contactAnchor}
            ctaText={heroCtaText}
          />
        );
      case 'stats':
        return (
          <>
            <StatsSection stats={stats} variant="minimal" />
            {bioSection}
          </>
        );
      case 'achievements':
        return (
          <AchievementsSection
            achievements={profile.achievements || []}
            title={sectionTitle || undefined}
            subtitle={sectionSubtitle || undefined}
          />
        );
      case 'sponsorships':
        return (
          <SponsorshipsSection
            sponsorships={profile.sponsorships || []}
            title={sectionTitle || undefined}
            subtitle={sectionSubtitle || undefined}
          />
        );
      case 'media':
        return (
          <MediaHighlightsSection
            highlights={profile.mediaHighlights || []}
            title={sectionTitle || undefined}
            subtitle={sectionSubtitle || undefined}
          />
        );
      case 'availability':
        return (
          <AvailabilitySection
            availability={profile.availability || []}
            title={sectionTitle || undefined}
            subtitle={sectionSubtitle || undefined}
          />
        );
      case 'booking':
        return (
          <BookingCalendarSection
            proId={profile.id}
            proName={profile.title.split(' ')[0] || profile.title}
          />
        );
      case 'curriculum':
        return renderCurriculumSection(sectionTitle || undefined, sectionSubtitle || undefined);
      case 'pricing':
        return renderPricingSection(sectionTitle || undefined, sectionSubtitle || undefined);
      case 'faq':
        return renderFaqSection(sectionTitle || undefined, sectionSubtitle || undefined);
      case 'contact':
        return (
          <ContactSection
            id="contact"
            proId={profile.id}
            proName={profile.title.split(' ')[0] || profile.title}
            openChatUrl={profile.open_chat_url || undefined}
            paymentLink={profile.payment_link || undefined}
            bookingUrl={profile.booking_url || undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-tee-surface">
      {orderedSections.map((section, index) => {
        const rendered = renderSection(section);
        if (!rendered) return null;
        return (
          <Fragment key={`${section.sectionType}-${index}`}>
            {rendered}
          </Fragment>
        );
      })}

      <footer className="py-8 text-center text-xs text-tee-ink-light/50">
        <p>© {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}
