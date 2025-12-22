'use client';

import { useState } from 'react';
import { HeroSection, StatsSection, ContactSection } from '../sections';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeConfig } from '@/actions/theme';

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
  };
  themeConfig?: ThemeConfig;
}

/**
 * Curriculum Template - Teaching-focused portfolio
 * Best for: Pros with structured programs, methodology-driven
 * Sections: Hero, Stats, Curriculum, Pricing, FAQ, Contact
 */
export function CurriculumTemplate({ profile, themeConfig }: CurriculumTemplateProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-tee-surface">
      {/* Hero */}
      <HeroSection
        name={profile.title.split(' ')[0] || profile.title}
        title={profile.title}
        subtitle={profile.certifications?.[0]}
        heroImage={profile.hero_image_url || '/images/default-hero.jpg'}
        location={profile.location || undefined}
      />

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Bio */}
      {profile.bio && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 font-pretendard text-3xl font-bold text-tee-ink-strong">
              레슨 철학
            </h2>
            <p className="text-lg leading-relaxed text-tee-ink-light">
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* Curriculum Section */}
      <section className="bg-tee-background px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center font-pretendard text-3xl font-bold text-tee-ink-strong">
            커리큘럼 안내
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {curriculum.map((item, idx) => (
              <Card key={item.title} className="relative overflow-hidden">
                {/* Step number */}
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

      {/* Pricing Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center font-pretendard text-3xl font-bold text-tee-ink-strong">
            수강료 안내
          </h2>
          <p className="mb-12 text-center text-lg text-tee-ink-light">
            합리적인 가격, 최고의 가치
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {priceTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative p-8 transition-all duration-300 hover:scale-105 ${
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
                  <a href={profile.open_chat_url || profile.payment_link || '#'}>
                    선택하기
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {profile.faq && profile.faq.length > 0 && (
        <section className="bg-tee-background px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-center font-pretendard text-3xl font-bold text-tee-ink-strong">
              자주 묻는 질문
            </h2>

            <div className="space-y-4">
              {profile.faq.map((item, idx) => (
                <Card
                  key={idx}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {item.question}
                    </CardTitle>
                    <svg
                      className={`h-5 w-5 text-tee-ink-light transition-transform ${
                        expandedFaq === idx ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </CardHeader>
                  {expandedFaq === idx && (
                    <CardContent>
                      <p className="text-tee-ink-light">{item.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <ContactSection
        proName={profile.title.split(' ')[0] || profile.title}
        openChatUrl={profile.open_chat_url || undefined}
        paymentLink={profile.payment_link || undefined}
        bookingUrl={profile.booking_url || undefined}
      />

      {/* Minimal Footer */}
      <footer className="py-8 text-center text-xs text-tee-ink-light/50">
        <p>© {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}
