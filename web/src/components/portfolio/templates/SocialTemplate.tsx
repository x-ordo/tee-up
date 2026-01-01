'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import {
  HeroSection,
  StatsSection,
  TestimonialsSection,
  ContactSection,
  AchievementsSection,
  SponsorshipsSection,
  MediaHighlightsSection,
  AvailabilitySection,
} from '../sections';
import { Card } from '@/components/ui/Card';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeConfig } from '@/actions/theme';
import { DEFAULT_SECTIONS } from '@/lib/portfolio-constants';

interface InstagramPost {
  id: string;
  image: string;
  url: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
}

interface SocialTemplateProps {
  profile: ProProfile & {
    highlights?: { label: string; value: string }[];
    testimonials?: { name: string; quote: string; avatar?: string; rating?: number }[];
    instagramPosts?: InstagramPost[];
    youtubeVideos?: YouTubeVideo[];
    achievements?: { title: string; tourOrEvent?: string; year?: string; placement?: string; note?: string }[];
    sponsorships?: { brand: string; role?: string; period?: string; link?: string; logoUrl?: string }[];
    mediaHighlights?: { outlet?: string; headline: string; date?: string; link?: string; mediaType?: string; thumbnailUrl?: string }[];
    availability?: { region?: string; cadence?: string; preferredDays?: string; timeWindow?: string; seasonality?: string }[];
  };
  themeConfig?: ThemeConfig;
  sections?: { sectionType: string; title?: string | null; subtitle?: string | null }[];
}

/**
 * Social Template - Social media integrated portfolio
 * Best for: Pros with active social presence, content creators
 * Sections: Hero, Stats, Instagram Feed, YouTube Embed, Testimonials, Contact
 */
export function SocialTemplate({ profile, sections, themeConfig: _themeConfig }: SocialTemplateProps) {
  const contactAnchor = '#contact';
  const heroCtaText = profile.booking_url
    ? '예약하기'
    : profile.open_chat_url
    ? '카카오톡 문의'
    : '레슨 문의하기';
  const stats = profile.highlights || [
    { label: '레슨 경력', value: '10년+' },
    { label: '팔로워', value: '10K+' },
    { label: '평점', value: `${profile.rating || 4.9}` },
    { label: '조회수', value: `${profile.profile_views || 0}` },
  ];
  const socialButtonClass =
    'flex h-12 w-12 items-center justify-center rounded-full border border-tee-stone bg-tee-surface text-tee-ink-strong transition-all duration-300 hover:border-tee-accent-primary hover:text-tee-accent-primary hover:shadow-lg motion-reduce:transition-none';

  const fallbackSections = DEFAULT_SECTIONS.social.map((section) => ({
    sectionType: section.section_type,
    title: section.title,
  }));
  const orderedSections = sections && sections.length > 0 ? sections : fallbackSections;
  const socialSectionIndexes = orderedSections
    .map((section, index) =>
      section.sectionType === 'instagram_feed' || section.sectionType === 'youtube_embed'
        ? index
        : -1
    )
    .filter((index) => index >= 0);
  const lastSocialIndex = socialSectionIndexes.length > 0
    ? Math.max(...socialSectionIndexes)
    : -1;
  const hasSocialContent = Boolean(profile.instagramPosts?.length || profile.youtubeVideos?.length);

  const bioSection = (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr,0.8fr] md:items-center">
          <div>
            {profile.bio && (
              <>
                <h2 className="mb-6 font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
                  소개
                </h2>
                <p className="text-lg leading-relaxed text-tee-ink-light">
                  {profile.bio}
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-tee-stone bg-tee-background p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-tee-ink-muted">
              Social
            </p>
            <div className="flex flex-wrap gap-4">
              {profile.instagram_username && (
                <a
                  href={`https://instagram.com/${profile.instagram_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialButtonClass}
                  aria-label="Instagram"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {profile.youtube_channel_id && (
                <a
                  href={`https://youtube.com/channel/${profile.youtube_channel_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialButtonClass}
                  aria-label="YouTube"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {profile.kakao_talk_id && (
                <a
                  href={profile.open_chat_url || `https://open.kakao.com/o/${profile.kakao_talk_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialButtonClass}
                  aria-label="KakaoTalk"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.61 1.72 4.89 4.29 6.17-.19.69-.69 2.52-.79 2.91-.12.5.18.5.38.36.16-.1 2.47-1.66 3.47-2.34.53.07 1.08.1 1.65.1 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSocialCta = () => (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-lg text-tee-ink-light">
          더 궁금한 점이 있으신가요?
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border-2 border-tee-accent-primary bg-transparent px-6 py-3 font-medium text-tee-accent-primary transition-all hover:bg-tee-accent-primary hover:text-white"
        >
          레슨 문의하기
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );

  const renderSection = (
    section: { sectionType: string; title?: string | null; subtitle?: string | null },
    index: number
  ) => {
    const sectionTitle = typeof section.title === 'string' ? section.title.trim() : '';
    const sectionSubtitle = typeof section.subtitle === 'string' ? section.subtitle.trim() : '';
    const showSocialCta = hasSocialContent && index === lastSocialIndex;

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
            <StatsSection stats={stats} variant="pills" />
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
      case 'instagram_feed':
        return profile.instagramPosts && profile.instagramPosts.length > 0 ? (
          <>
            <section className="bg-tee-background py-16">
              <div className="mx-auto max-w-7xl px-6">
                <div className="mb-12 text-center">
                  <h2 className="mb-2 font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
                    {sectionTitle || 'Instagram'}
                  </h2>
                  {sectionSubtitle && (
                    <p className="mb-3 text-sm font-medium tracking-[0.08em] text-tee-ink-light">
                      {sectionSubtitle}
                    </p>
                  )}
                  <a
                    href={`https://instagram.com/${profile.instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tee-accent-primary hover:underline"
                  >
                    @{profile.instagram_username}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                  {profile.instagramPosts.slice(0, 6).map((post) => (
                    <a
                      key={post.id}
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:scale-100"
                    >
                      <Image
                        src={post.image}
                        alt="Instagram Post"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--tee-overlay-medium)] opacity-0 transition-opacity group-hover:opacity-100">
                        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
            {showSocialCta ? renderSocialCta() : null}
          </>
        ) : null;
      case 'youtube_embed':
        return profile.youtubeVideos && profile.youtubeVideos.length > 0 ? (
          <>
            <section className="px-6 py-16">
              <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                  <h2 className="mb-2 font-pretendard text-3xl font-semibold tracking-[0.04em] text-tee-ink-strong">
                    {sectionTitle || 'YouTube'}
                  </h2>
                  <p className="font-medium tracking-[0.08em] text-tee-ink-light">
                    {sectionSubtitle || '레슨 영상과 골프 팁'}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {profile.youtubeVideos.slice(0, 4).map((video) => (
                    <Card key={video.id} className="overflow-hidden p-0">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-tee-ink-strong">{video.title}</h3>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            {showSocialCta ? renderSocialCta() : null}
          </>
        ) : null;
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
            useMarquee
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-tee-surface">
      {orderedSections.map((section, index) => {
        const rendered = renderSection(section, index);
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
