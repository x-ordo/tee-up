'use client';

import { useState } from 'react';
import {
  HeroSection,
  StatsSection,
  GallerySection,
  TestimonialsSection,
  ContactSection,
} from '../sections';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeConfig } from '@/actions/theme';

interface VisualTemplateProps {
  profile: ProProfile & {
    // Extended profile data
    highlights?: { label: string; value: string; detail?: string }[];
    testimonials?: { name: string; quote: string; avatar?: string; rating?: number }[];
  };
  themeConfig?: ThemeConfig;
}

/**
 * Visual Template - Image-focused portfolio
 * Best for: Pros with great photography, visual storytellers
 * Sections: Hero, Stats, Gallery, Testimonials, Contact
 */
export function VisualTemplate({ profile, themeConfig: _themeConfig }: VisualTemplateProps) {
  const [_isContactOpen, setIsContactOpen] = useState(false);

  // Default stats if not provided
  const stats = profile.highlights || [
    { label: '레슨 경력', value: '10년+' },
    { label: '수강생', value: '500+' },
    { label: '평점', value: `${profile.rating || 4.9}` },
    { label: '조회수', value: `${profile.profile_views || 0}` },
  ];

  return (
    <div className="min-h-screen bg-tee-surface">
      {/* Hero - Full screen immersive */}
      <HeroSection
        name={profile.title.split(' ')[0] || profile.title}
        title={profile.title}
        subtitle={profile.certifications?.[0]}
        heroImage={profile.hero_image_url || '/images/default-hero.jpg'}
        location={profile.location || undefined}
      />

      {/* Stats - Overlapping cards */}
      <StatsSection stats={stats} />

      {/* Bio Section */}
      {profile.bio && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-8 font-pretendard text-3xl font-bold text-tee-ink-strong">
              프로 소개
            </h2>
            <p className="text-lg leading-relaxed text-tee-ink-light">
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* Gallery - Bento grid style */}
      {profile.gallery_images && profile.gallery_images.length > 0 && (
        <GallerySection images={profile.gallery_images} />
      )}

      {/* Specialties */}
      {profile.specialties && profile.specialties.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center font-pretendard text-3xl font-bold text-tee-ink-strong">
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
      )}

      {/* Testimonials - Marquee style for visual impact */}
      {profile.testimonials && profile.testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={profile.testimonials}
          useMarquee={profile.testimonials.length > 2}
          className="bg-tee-background"
        />
      )}

      {/* Contact CTA */}
      <ContactSection
        proId={profile.id}
        proName={profile.title.split(' ')[0] || profile.title}
        openChatUrl={profile.open_chat_url || undefined}
        paymentLink={profile.payment_link || undefined}
        bookingUrl={profile.booking_url || undefined}
        onContactClick={() => setIsContactOpen(true)}
      />

      {/* Minimal Footer - White label approach */}
      <footer className="py-8 text-center text-xs text-tee-ink-light/50">
        <p>© {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}
