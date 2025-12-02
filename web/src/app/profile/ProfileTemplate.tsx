"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { ProfileData } from './profile-data'
import BookingModal from '../components/BookingModal'
import { KakaoTalkButton } from '../components/KakaoTalkButton'
import { ThemeToggle } from '../components/ThemeToggle'
import { useScrollVisibility } from '@/hooks/useScrollVisibility'

export function ProfileTemplate({ data }: { data: ProfileData }) {
  const {
    profile,
    highlights,
    storySections,
    testimonials,
    services,
    locations,
    policies,
    metrics,
    video,
    themes,
    priceTiers,
    instagramPosts,
    youtubeVideos,
    similarPros,
  } = data

  const [open, setOpen] = useState(false)
  const { isVisible: ctaVisible, hide: hideCta } = useScrollVisibility({ delay: 1000 })
  const [ctaMinimized, setCtaMinimized] = useState(false)

  return (
    <div className="min-h-screen bg-calm-white">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle className="bg-white/80 backdrop-blur-md shadow-lg" />
      </div>

      {/* Floating Sticky CTAs */}
      <div
        data-testid="floating-cta"
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          ctaVisible && !ctaMinimized
            ? 'opacity-100 translate-y-0'
            : ctaMinimized
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Minimized State (mobile) */}
        {ctaMinimized && (
          <button
            onClick={() => setCtaMinimized(false)}
            className="btn-primary h-14 w-14 rounded-full p-0 shadow-lg md:hidden"
            aria-label="CTA 메뉴 열기"
          >
            <span className="text-xl">💬</span>
          </button>
        )}

        {/* Full CTA (visible when not minimized) */}
        {!ctaMinimized && (
          <div className="flex flex-col gap-3 animate-fadeIn">
            {/* Close/Minimize button - mobile only */}
            <button
              onClick={() => {
                setCtaMinimized(true)
                hideCta()
              }}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-calm-charcoal text-white text-xs flex items-center justify-center md:hidden"
              aria-label="CTA 최소화"
            >
              ×
            </button>

            {/* Desktop: Show both buttons */}
            <div className="hidden md:flex md:flex-col md:gap-3">
              {profile.kakaoTalkId && (
                <KakaoTalkButton kakaoTalkId={profile.kakaoTalkId} proName={profile.name} />
              )}
              <button
                onClick={() => setOpen(true)}
                className="btn-primary px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  💬 레슨 상담하기
                </span>
              </button>
            </div>

            {/* Mobile: Single button with action sheet behavior */}
            <button
              onClick={() => setOpen(true)}
              className="btn-primary px-6 py-3 text-base shadow-lg md:hidden"
            >
              <span className="flex items-center gap-2">
                💬 레슨 문의
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Section - Immersive Full Screen */}
      <header className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <Image
            src={profile.heroImage}
            alt={profile.name}
            fill
            priority
            className="object-cover scale-110"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-calm-obsidian via-calm-obsidian/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-16">
            {/* Badges */}
            <div className="mb-6 flex flex-wrap items-center gap-3 animate-slideUp">
              <span className="rounded-full border border-accent bg-accent/20 px-6 py-2 text-sm font-semibold text-white backdrop-blur-md">
                ✓ {profile.subtitle}
              </span>
              {profile.tier && (
                <span className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur-md">
                  {profile.tier}
                </span>
              )}
            </div>

            {/* Name & Title */}
            <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <h1 className="mb-4 font-display text-7xl font-bold leading-tight text-white lg:text-8xl">
                {profile.name}
              </h1>
              <p className="mb-8 text-2xl font-medium text-accent-light">
                {profile.title}
              </p>

              {/* Location & Languages */}
              <div className="flex flex-wrap gap-6 text-lg text-white/80">
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{profile.city}</span>
                  </div>
                )}
                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span>💬</span>
                    <span>{profile.languages.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm">Scroll</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      <main className="relative pb-24 md:pb-0">
        {/* Stats Highlight - Cards */}
        <section className="relative -mt-32 px-6 pb-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-4">
              {highlights.map((item, idx) => (
                <div
                  key={item.label}
                  className="card group p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative">
                    <div className="mb-3 font-display text-5xl font-bold text-accent">
                      {item.value}
                    </div>
                    <p className="text-sm font-medium uppercase tracking-wider text-calm-charcoal">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video & Bio Section */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.3fr,0.7fr]">
              {/* Video Player */}
              {video && (
                <div className="card group overflow-hidden p-0">
                  <div className="aspect-video overflow-hidden">
                    <video
                      controls
                      poster={video.poster}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      preload="metadata"
                    >
                      <source src={video.url} type="video/mp4" />
                    </video>
                  </div>
                </div>
              )}

              {/* Bio Card */}
              <div className="card p-8 lg:p-10">
                <h2 className="mb-6 font-display text-3xl font-bold text-calm-obsidian">
                  프로 소개
                </h2>
                <p className="text-lg leading-relaxed text-calm-charcoal">
                  {profile.summary}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Sections */}
        {storySections && storySections.length > 0 && (
          <section className="space-y-20 px-6 py-16 bg-calm-cloud">
            {storySections.map((section) => (
              <div
                key={section.title}
                className={`mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24`}
              >
                <div className={`relative ${section.align === 'right' ? 'lg:col-start-2' : ''}`}>
                  <p className="mb-4 font-mono uppercase tracking-widest text-accent">{section.title}</p>
                  <h3 className="mb-6 font-display text-4xl font-bold text-calm-obsidian">{section.heading}</h3>
                  <p className="text-lg leading-relaxed text-calm-charcoal">{section.body}</p>
                </div>
                <div className={`group relative aspect-square overflow-hidden rounded-3xl border border-calm-stone ${section.align === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <Image src={section.image} alt={section.heading} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Instagram Embed */}
        {instagramPosts && instagramPosts.length > 0 && (
          <section className="px-6 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                  <a href={`https://instagram.com/${profile.instagramUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    Instagram
                  </a>
                </h2>
                <p className="text-lg text-calm-charcoal">@{profile.instagramUsername}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {instagramPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-calm-stone transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Image src={post.image} alt="Instagram Post" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* YouTube Videos */}
        {youtubeVideos && youtubeVideos.length > 0 && (
          <section className="px-6 py-16 bg-calm-cloud">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                  <a href={`https://www.youtube.com/channel/${profile.youtubeChannelId}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    YouTube
                  </a>
                </h2>
                <p className="text-lg text-calm-charcoal">레슨 영상과 골프 팁</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {youtubeVideos.map((ytVideo) => (
                  <div key={ytVideo.id} className="card overflow-hidden p-0">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytVideo.id}`}
                        title={ytVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      ></iframe>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-calm-obsidian">{ytVideo.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Performance Metrics */}
        {metrics && (
          <section className="px-6 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                  레슨 전문 분야
                </h2>
                <p className="text-lg text-calm-charcoal">데이터로 검증된 실력</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {Object.entries(metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="card p-8 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-2xl font-bold uppercase tracking-wider text-calm-obsidian">
                          {key === 'driver' ? '드라이버' : key === 'iron' ? '아이언' : key === 'short' ? '쇼트게임' : '퍼팅'}
                        </span>
                        <span className="font-mono text-4xl font-bold text-accent">{value}%</span>
                      </div>

                      <div className="relative h-4 overflow-hidden rounded-full bg-calm-stone">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-1000"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Teaching Programs */}
        {themes && themes.length > 0 && (
          <section className="px-6 py-16 bg-calm-cloud">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                  커리큘럼 안내
                </h2>
                <p className="text-lg text-calm-charcoal">맞춤형 커리큘럼</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {themes.map((theme, idx) => (
                  <div
                    key={theme.title}
                    className="card p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <h3 className="mb-4 text-2xl font-bold text-calm-obsidian">
                      {theme.title}
                    </h3>
                    <p className="leading-relaxed text-calm-charcoal">
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {priceTiers && priceTiers.length > 0 && (
          <section className="px-6 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                  수강료 안내
                </h2>
                <p className="text-lg text-calm-charcoal">합리적인 가격, 최고의 가치</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {priceTiers.map((tier, idx) => (
                  <div
                    key={tier.name}
                    className={`card relative p-10 transition-all duration-300 hover:scale-105 ${idx === 1
                        ? 'border-2 border-accent'
                        : ''
                      }`}
                  >
                    {idx === 1 && (
                      <div className="absolute right-8 top-8 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
                        POPULAR
                      </div>
                    )}

                    <h3 className="mb-3 text-3xl font-bold text-calm-obsidian">
                      {tier.name}
                    </h3>
                    <p className="mb-8 text-calm-charcoal">{tier.duration}</p>

                    <div className="mb-10 border-t border-calm-stone pt-8">
                      <span className="font-display text-5xl font-bold text-accent">
                        {tier.price}
                      </span>
                    </div>

                    <button
                      onClick={() => setOpen(true)}
                      className={`w-full rounded-xl py-4 font-semibold transition-all duration-300 ${idx === 1
                          ? 'btn-primary'
                          : 'btn-secondary'
                        }`}
                    >
                      선택하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Location & Policies */}
        <section className="px-6 py-16 bg-calm-cloud">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="card p-10">
                <h3 className="mb-8 text-2xl font-bold text-calm-obsidian">레슨 장소</h3>
                <ul className="space-y-4">
                  {(locations ?? ['청담 스튜디오']).map((loc) => (
                    <li key={loc} className="flex items-center gap-4 text-lg text-calm-charcoal">
                      <span className="text-2xl">📍</span>
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-10">
                <h3 className="mb-8 text-2xl font-bold text-calm-obsidian">예약 안내</h3>
                <ul className="space-y-4">
                  {(policies ?? ['예약 변경은 레슨 1일 전까지 가능합니다']).map((policy) => (
                    <li key={policy} className="leading-relaxed text-calm-charcoal">
                      • {policy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                생생한 수강 후기
              </h2>
              <p className="text-lg text-calm-charcoal">실제 수강생들의 생생한 후기</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((item, idx) => (
                <div
                  key={item.name}
                  className="card p-10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="mb-6 text-3xl text-accent">&ldquo;</div>
                  <p className="mb-8 text-xl leading-relaxed text-calm-obsidian">
                    {item.quote.replace(/(^"|"$)/g, '')}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image src={item.avatar} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="font-semibold text-calm-obsidian">{item.name}</p>
                      <div className="mt-1 flex gap-1 text-accent">
                        {'★★★★★'.split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Similar Pros */}
        {similarPros && similarPros.length > 0 && (
          <section className="px-6 py-16 bg-calm-cloud">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12">
                <h2 className="mb-4 font-display text-4xl font-bold text-calm-obsidian">
                  추천 프로 더보기
                </h2>
                <p className="text-lg text-calm-charcoal">나에게 맞는 다른 프로 더 찾아보기</p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {similarPros.map((pro) => (
                  <Link href={`/profile/${pro.slug}`} key={pro.slug} className="card group p-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="flex items-center gap-6">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full">
                        <Image src={pro.image} alt={pro.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-calm-obsidian">{pro.name}</h3>
                        <p className="text-calm-charcoal">{pro.role}</p>
                        <p className="mt-1 text-sm text-accent">{pro.city}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="px-6 py-32">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border-2 border-accent bg-accent-light p-16 text-center">
              <div className="relative">
                <h2 className="mb-6 font-display text-5xl font-bold text-calm-obsidian">
                  {profile.name}님과<br />레슨 시작하기
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-xl text-calm-charcoal">
                  지금 문의하시면 빠른 시간 내에 답변 드리겠습니다
                </p>
                <button
                  onClick={() => setOpen(true)}
                  className="btn-primary px-12 py-5 text-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  레슨 문의하기
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        proName={profile.name}
        services={services}
        selectedDateTime={undefined}
        type="reservation"
      />
    </div>
  )
}
