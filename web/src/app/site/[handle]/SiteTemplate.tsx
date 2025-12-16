'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PublicSite, SiteTheme } from '@/actions/sites';
import { applyThemeToDocument, DEFAULT_TOKENS } from '@/lib/theme/apply';
import type { ThemeTokens } from '@/lib/theme/types';

interface SiteTemplateProps {
  site: PublicSite;
  theme: SiteTheme | null;
}

/**
 * Public site template - P0 (Minimal MVP)
 * 연락처는 절대 클라이언트에 전송되지 않음
 */
export function SiteTemplate({ site, theme }: SiteTemplateProps) {
  const [ctaExpanded, setCtaExpanded] = useState(false);

  // 테마 토큰 적용
  useEffect(() => {
    if (theme?.computed_tokens) {
      const tokens = { ...DEFAULT_TOKENS, ...theme.computed_tokens } as ThemeTokens;
      applyThemeToDocument(tokens);
    }
  }, [theme]);

  // CTA 버튼 결정 (우선순위: 연락처 > 카카오 > 예약)
  const hasCta = site.has_phone || site.has_email || site.has_kakao || site.has_booking;
  const primaryCtaLabel = site.has_phone || site.has_email
    ? '연락처 보기'
    : site.has_kakao
    ? '카카오톡 문의'
    : '예약하기';

  return (
    <div className="min-h-screen bg-calm-white">
      {/* Hero Section */}
      <header className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        {site.hero_image_url ? (
          <Image
            src={site.hero_image_url}
            alt={site.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-calm-stone to-calm-cloud" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-calm-obsidian via-calm-obsidian/50 to-transparent" />

        {/* Content */}
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-4xl px-6 pb-12">
            {/* Profile Image */}
            {site.profile_image_url && (
              <div className="mb-6">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <Image
                    src={site.profile_image_url}
                    alt={site.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
            )}

            {/* Title & Tagline */}
            <h1 className="mb-3 font-display text-4xl font-bold text-white md:text-5xl">
              {site.title}
            </h1>
            {site.tagline && (
              <p className="text-xl text-white/80">{site.tagline}</p>
            )}

            {/* Social Links */}
            {(site.instagram_username || site.youtube_channel_id) && (
              <div className="mt-6 flex gap-4">
                {site.instagram_username && (
                  <a
                    href={`https://instagram.com/${site.instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/30"
                  >
                    <span>📸</span>
                    <span>@{site.instagram_username}</span>
                  </a>
                )}
                {site.youtube_channel_id && (
                  <a
                    href={`https://youtube.com/channel/${site.youtube_channel_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/30"
                  >
                    <span>🎬</span>
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      {site.gallery_images && site.gallery_images.length > 0 && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">갤러리</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {site.gallery_images.slice(0, 6).map((image, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-xl border border-calm-stone"
                >
                  <Image
                    src={image}
                    alt={`${site.title} 갤러리 ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {site.video_url && (
        <section className="bg-calm-cloud px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-semibold text-calm-obsidian">영상</h2>
            <div className="overflow-hidden rounded-xl border border-calm-stone">
              <video
                controls
                preload="metadata"
                className="aspect-video w-full"
              >
                <source src={site.video_url} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      )}

      {/* Floating CTA */}
      {hasCta && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            {/* Expanded options */}
            {ctaExpanded && (
              <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                {(site.has_phone || site.has_email) && (
                  <Link
                    href={`/site/${site.handle}/contact`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-calm-cloud"
                  >
                    <span className="text-xl">📞</span>
                    <span className="font-medium text-calm-obsidian">연락처 보기</span>
                  </Link>
                )}
                {site.has_kakao && (
                  <Link
                    href={`/site/${site.handle}/contact?action=kakao`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-calm-cloud"
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-medium text-calm-obsidian">카카오톡 문의</span>
                  </Link>
                )}
                {site.has_booking && (
                  <Link
                    href={`/site/${site.handle}/contact?action=booking`}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-calm-cloud"
                  >
                    <span className="text-xl">📅</span>
                    <span className="font-medium text-calm-obsidian">예약하기</span>
                  </Link>
                )}
              </div>
            )}

            {/* Main CTA Button */}
            <button
              onClick={() => setCtaExpanded(!ctaExpanded)}
              className="btn-primary flex items-center gap-2 px-8 py-4 text-lg shadow-lg transition-transform hover:scale-105"
            >
              {ctaExpanded ? (
                <>
                  <span>✕</span>
                  <span>닫기</span>
                </>
              ) : (
                <>
                  <span>💬</span>
                  <span>{primaryCtaLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer Padding for CTA */}
      <div className="h-32" />

      {/* Minimal Footer */}
      <footer className="border-t border-calm-stone py-6">
        <p className="text-center text-sm text-calm-charcoal">
          Powered by{' '}
          <a
            href="https://teeup.kr"
            className="font-medium text-accent hover:underline"
          >
            TEE:UP
          </a>
        </p>
      </footer>
    </div>
  );
}
