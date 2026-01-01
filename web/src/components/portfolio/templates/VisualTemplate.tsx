'use client';

import { Fragment, useState } from 'react';
import {
  HeroSection,
  StatsSection,
  GallerySection,
  TestimonialsSection,
  ContactSection,
  AchievementsSection,
  SponsorshipsSection,
  MediaHighlightsSection,
  AvailabilitySection,
} from '../sections';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeConfig } from '@/actions/theme';
import { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

interface VisualTemplateProps {
  profile: ProProfile & {
    // Extended profile data
    highlights?: { label: string; value: string; detail?: string }[];
    testimonials?: { name: string; quote: string; avatar?: string; rating?: number }[];
    achievements?: { title: string; tourOrEvent?: string; year?: string; placement?: string; note?: string }[];
    sponsorships?: { brand: string; role?: string; period?: string; link?: string; logoUrl?: string }[];
    mediaHighlights?: { outlet?: string; headline: string; date?: string; link?: string; mediaType?: string; thumbnailUrl?: string }[];
    availability?: { region?: string; cadence?: string; preferredDays?: string; timeWindow?: string; seasonality?: string }[];
  };
  themeConfig?: ThemeConfig;
  sections?: { sectionType: string; title?: string | null; subtitle?: string | null }[];
}

/**
 * Visual Template - Image-focused portfolio
 * Best for: Pros with great photography, visual storytellers
 * Sections: Hero, Stats, Gallery, Testimonials, Contact
 */
export function VisualTemplate({ profile, sections, themeConfig: _themeConfig }: VisualTemplateProps) {
  const [_isContactOpen, setIsContactOpen] = useState(false);
  const contactAnchor = '#contact';
  const heroCtaText = profile.booking_url
    ? '예약하기'
    : profile.open_chat_url
    ? '카카오톡 문의'
    : '레슨 문의하기';

  // Default stats if not provided
  const stats = profile.highlights || [
    { label: '레슨 경력', value: '10년+' },
    { label: '수강생', value: '500+' },
    { label: '평점', value: `${profile.rating || 4.9}` },
    { label: '조회수', value: `${profile.profile_views || 0}` },
  ];

  const fallbackSections = DEFAULT_SECTIONS.visual.map((section) => ({
    sectionType: section.section_type,
    title: section.title,
  }));
  const orderedSections = sections && sections.length > 0 ? sections : fallbackSections;

  const bioSection = profile.bio ? (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-8 font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
          프로 소개
        </h2>
        <p className="text-lg leading-relaxed text-tee-ink-light">
          {profile.bio}
        </p>
      </div>
    </section>
  ) : null;

  const specialtiesSection = profile.specialties && profile.specialties.length > 0 ? (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
          전문 분야
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {profile.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-tee-accent-primary/30 bg-tee-accent-primary/5 px-6 py-2 text-sm font-medium text-tee-accent-primary"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </section>
  ) : null;

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
            <StatsSection stats={stats} />
            {bioSection}
            {specialtiesSection}
          </>
        );
      case 'gallery':
        return (
          <GallerySection
            images={profile.gallery_images || []}
            title={sectionTitle || undefined}
            subtitle={sectionSubtitle || undefined}
          />
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
      case 'testimonials':
        return profile.testimonials && profile.testimonials.length > 0 ? (
          <TestimonialsSection
            testimonials={profile.testimonials}
            title={sectionTitle || undefined}
            subtitle={sectionSubtitle || undefined}
            useMarquee={profile.testimonials.length > 2}
            className="bg-tee-background"
          />
        ) : null;
      case 'contact':
        return (
          <ContactSection
            id="contact"
            proId={profile.id}
            proName={profile.title.split(' ')[0] || profile.title}
            openChatUrl={profile.open_chat_url || undefined}
            paymentLink={profile.payment_link || undefined}
            bookingUrl={profile.booking_url || undefined}
            onContactClick={() => setIsContactOpen(true)}
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

      {/* Minimal Footer - White label approach */}
      <footer className="py-8 text-center text-xs text-tee-ink-light/50">
        <p>© {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}
