'use client';

import Image from 'next/image';
import { HeroSection, StatsSection, TestimonialsSection, ContactSection } from '../sections';
import { Card } from '@/components/ui/Card';
import type { ProProfile } from '@/actions/profiles';
import type { ThemeConfig } from '@/actions/theme';

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
  };
  themeConfig?: ThemeConfig;
}

/**
 * Social Template - Social media integrated portfolio
 * Best for: Pros with active social presence, content creators
 * Sections: Hero, Stats, Instagram Feed, YouTube Embed, Testimonials, Contact
 */
export function SocialTemplate({ profile, themeConfig: _themeConfig }: SocialTemplateProps) {
  const stats = profile.highlights || [
    { label: '레슨 경력', value: '10년+' },
    { label: '팔로워', value: '10K+' },
    { label: '평점', value: `${profile.rating || 4.9}` },
    { label: '조회수', value: `${profile.profile_views || 0}` },
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

      {/* Bio with Social Links */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          {profile.bio && (
            <>
              <h2 className="mb-8 font-pretendard text-3xl font-bold text-tee-ink-strong">
                소개
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-tee-ink-light">
                {profile.bio}
              </p>
            </>
          )}

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {profile.instagram_username && (
              <a
                href={`https://instagram.com/${profile.instagram_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white transition-transform hover:scale-110"
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110"
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
                className="flex h-12 w-12 items-center justify-center rounded-full bg-tee-kakao text-tee-kakao-text transition-transform hover:scale-110"
                aria-label="KakaoTalk"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.61 1.72 4.89 4.29 6.17-.19.69-.69 2.52-.79 2.91-.12.5.18.5.38.36.16-.1 2.47-1.66 3.47-2.34.53.07 1.08.1 1.65.1 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      {profile.instagramPosts && profile.instagramPosts.length > 0 && (
        <section className="bg-tee-background py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-pretendard text-3xl font-bold text-tee-ink-strong">
                Instagram
              </h2>
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
                  className="group relative aspect-square overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Image
                    src={post.image}
                    alt="Instagram Post"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* YouTube Videos */}
      {profile.youtubeVideos && profile.youtubeVideos.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-2 font-pretendard text-3xl font-bold text-tee-ink-strong">
                YouTube
              </h2>
              <p className="text-tee-ink-light">레슨 영상과 골프 팁</p>
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
      )}

      {/* Mid-page CTA - Prevent exit to social platforms */}
      {(profile.instagramPosts?.length || profile.youtubeVideos?.length) && (
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
      )}

      {/* Testimonials */}
      {profile.testimonials && profile.testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={profile.testimonials}
          useMarquee
          className="bg-tee-background"
        />
      )}

      {/* Contact */}
      <div id="contact">
        <ContactSection
          proId={profile.id}
          proName={profile.title.split(' ')[0] || profile.title}
          openChatUrl={profile.open_chat_url || undefined}
          paymentLink={profile.payment_link || undefined}
          bookingUrl={profile.booking_url || undefined}
        />
      </div>

      {/* Minimal Footer */}
      <footer className="py-8 text-center text-xs text-tee-ink-light/50">
        <p>© {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
}
