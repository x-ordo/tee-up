"use client"

import Link from 'next/link'
import { useState } from 'react'
import type { ProfileData } from './profile-data'
import BookingModal from '../components/BookingModal'
import { KakaoTalkButton } from '../components/KakaoTalkButton'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Floating Sticky CTAs */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 animate-fadeIn">
        {profile.kakaoTalkId && (
          <KakaoTalkButton kakaoTalkId={profile.kakaoTalkId} proName={profile.name} />
        )}
        <button
          onClick={() => setOpen(true)}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] px-8 py-4 text-lg font-bold text-[#1a1f3a] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            💬 레슨 상담하기
          </span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#f4e5c2] to-[#d4af37] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </div>

      {/* Hero Section - Immersive Full Screen */}
      <header className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src={profile.heroImage}
            alt={profile.name}
            className="h-full w-full object-cover"
            style={{ transform: 'scale(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/80 to-transparent" />
        </div>

        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)] opacity-40" />

        {/* Content */}
        <div className="relative flex h-full items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20">
            {/* Badges */}
            <div className="mb-6 flex flex-wrap items-center gap-3 animate-slideUp">
              <span className="rounded-full border border-[#d4af37] bg-[#d4af37]/20 px-6 py-2 text-sm font-semibold text-[#d4af37] backdrop-blur-md">
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
              <p className="mb-8 text-2xl font-medium text-[#d4af37]">
                {profile.title}
              </p>

              {/* Location & Languages */}
              <div className="flex flex-wrap gap-6 text-lg text-white/80">
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4af37]">📍</span>
                    <span>{profile.city}</span>
                  </div>
                )}
                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4af37]">💬</span>
                    <span>{profile.languages.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm">Scroll</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Stats Highlight - Glassmorphism Cards */}
        <section className="relative -mt-32 px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-4">
              {highlights.map((item, idx) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-[#d4af37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent blur-2xl transition-all duration-500 group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-3 font-display text-5xl font-bold text-[#d4af37]">
                      {item.value}
                    </div>
                    <p className="text-sm font-medium uppercase tracking-wider text-white/70">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video & Bio Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.3fr,0.7fr]">
              {/* Video Player */}
              {video && (
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl">
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
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl lg:p-10">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent blur-3xl" />
                <div className="relative">
                  <h2 className="mb-6 font-display text-3xl font-bold text-white">
                    프로 소개
                  </h2>
                  <p className="text-lg leading-relaxed text-white/80">
                    {profile.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Sections */}
        {storySections && storySections.length > 0 && (
          <section className="space-y-20 px-6 py-20">
            {storySections.map((section) => (
              <div
                key={section.title}
                className={`mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-24`}
              >
                <div className={`relative ${section.align === 'right' ? 'lg:col-start-2' : ''}`}>
                  <p className="mb-4 font-mono uppercase tracking-widest text-[#d4af37]">{section.title}</p>
                  <h3 className="mb-6 font-display text-4xl font-bold text-white">{section.heading}</h3>
                  <p className="text-lg leading-relaxed text-white/70">{section.body}</p>
                </div>
                <div className={`group relative aspect-square overflow-hidden rounded-3xl border border-white/10 ${section.align === 'right' ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <img src={section.image} alt={section.heading} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Instagram Embed */}
        {instagramPosts && instagramPosts.length > 0 && (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-white">
                  <a href={`https://instagram.com/${profile.instagramUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">
                    Instagram
                  </a>
                </h2>
                <p className="text-lg text-white/60">@{profile.instagramUsername}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {instagramPosts.map((post) => (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <img src={post.image} alt="Instagram Post" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* YouTube Videos */}
        {youtubeVideos && youtubeVideos.length > 0 && (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-white">
                  <a href={`https://www.youtube.com/channel/${profile.youtubeChannelId}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4af37] transition-colors">
                    YouTube
                  </a>
                </h2>
                <p className="text-lg text-white/60">레슨 영상과 골프 팁</p>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {youtubeVideos.map((ytVideo) => (
                  <div key={ytVideo.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl">
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
                      <h3 className="text-lg font-semibold text-white">{ytVideo.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Performance Metrics */}
        {metrics && (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-white">
                  레슨 전문 분야
                </h2>
                <p className="text-lg text-white/60">데이터로 검증된 실력</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {Object.entries(metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:border-[#d4af37]/50"
                  >
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#d4af37]/10 to-transparent blur-2xl transition-all duration-500 group-hover:scale-150" />

                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="text-2xl font-bold uppercase tracking-wider text-white">
                          {key === 'driver' ? '드라이버' : key === 'iron' ? '아이언' : key === 'short' ? '쇼트게임' : '퍼팅'}
                        </span>
                        <span className="font-mono text-4xl font-bold text-[#d4af37]">{value}%</span>
                      </div>

                      <div className="relative h-4 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-1000"
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
          <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-white">
                  커리큘럼 안내
                </h2>
                <p className="text-lg text-white/60">맞춤형 커리큘럼</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {themes.map((theme, idx) => (
                  <div
                    key={theme.title}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-[#d4af37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent blur-2xl transition-all duration-500 group-hover:scale-150" />

                    <div className="relative">
                      <h3 className="mb-4 text-2xl font-bold text-white">
                        {theme.title}
                      </h3>
                      <p className="leading-relaxed text-white/70">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {priceTiers && priceTiers.length > 0 && (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 font-display text-4xl font-bold text-white">
                  수강료 안내
                </h2>
                <p className="text-lg text-white/60">합리적인 가격, 최고의 가치</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {priceTiers.map((tier, idx) => (
                  <div
                    key={tier.name}
                    className={`group relative overflow-hidden rounded-3xl border p-10 backdrop-blur-xl transition-all duration-500 hover:scale-105 ${idx === 1
                        ? 'border-[#d4af37] bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 shadow-[0_0_40px_rgba(212,175,55,0.3)]'
                        : 'border-white/10 bg-gradient-to-br from-white/10 to-white/5 hover:border-[#d4af37]/50'
                      }`}
                  >
                    {idx === 1 && (
                      <div className="absolute right-8 top-8 rounded-full bg-[#d4af37] px-4 py-1 text-xs font-bold text-[#1a1f3a]">
                        POPULAR
                      </div>
                    )}

                    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-transparent blur-3xl" />

                    <div className="relative">
                      <h3 className="mb-3 text-3xl font-bold text-white">
                        {tier.name}
                      </h3>
                      <p className="mb-8 text-white/60">{tier.duration}</p>

                      <div className="mb-10 border-t border-white/10 pt-8">
                        <span className="font-display text-5xl font-bold text-[#d4af37]">
                          {tier.price}
                        </span>
                      </div>

                      <button
                        onClick={() => setOpen(true)}
                        className={`w-full rounded-xl py-4 font-semibold transition-all duration-300 ${idx === 1
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] text-[#1a1f3a] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
                            : 'border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a1f3a]'
                          }`}
                      >
                        선택하기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Location & Policies */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-10 backdrop-blur-xl">
                <h3 className="mb-8 text-2xl font-bold text-white">레슨 장소</h3>
                <ul className="space-y-4">
                  {(locations ?? ['청담 스튜디오']).map((loc) => (
                    <li key={loc} className="flex items-center gap-4 text-lg text-white/80">
                      <span className="text-2xl text-[#d4af37]">📍</span>
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-10 backdrop-blur-xl">
                <h3 className="mb-8 text-2xl font-bold text-white">예약 안내</h3>
                <ul className="space-y-4">
                  {(policies ?? ['예약 변경은 레슨 1일 전까지 가능합니다']).map((policy) => (
                    <li key={policy} className="leading-relaxed text-white/70">
                      • {policy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-display text-4xl font-bold text-white">
                생생한 수강 후기
              </h2>
              <p className="text-lg text-white/60">실제 수강생들의 생생한 후기</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((item, idx) => (
                <div
                  key={item.name}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-[#d4af37]/50"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#d4af37]/10 to-transparent blur-2xl" />

                  <div className="relative">
                    <div className="mb-6 text-3xl text-[#d4af37]">&ldquo;</div>
                    <p className="mb-8 text-xl leading-relaxed text-white/90">
                      {item.quote.replace(/(^"|"$)/g, '')}
                    </p>

                    <div className="flex items-center gap-4">
                      <img src={item.avatar} alt={item.name} className="h-16 w-16 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <div className="mt-1 flex gap-1 text-[#d4af37]">
                          {'★★★★★'.split('').map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
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
          <section className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12">
                <h2 className="mb-4 font-display text-4xl font-bold text-white">
                  추천 프로 더보기
                </h2>
                <p className="text-lg text-white/60">나에게 맞는 다른 프로 더 찾아보기</p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {similarPros.map((pro) => (
                  <Link href={`/profile/${pro.slug}`} key={pro.slug} className="group block overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:border-[#d4af37]/50">
                    <div className="flex items-center gap-6">
                      <img src={pro.image} alt={pro.name} className="h-20 w-20 rounded-full object-cover" />
                      <div>
                        <h3 className="text-xl font-bold text-white">{pro.name}</h3>
                        <p className="text-white/60">{pro.role}</p>
                        <p className="mt-1 text-sm text-[#d4af37]">{pro.city}</p>
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
            <div className="relative overflow-hidden rounded-3xl border border-[#d4af37] bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 p-16 text-center backdrop-blur-xl">
              <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-transparent blur-3xl" />
              <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-transparent blur-3xl" />

              <div className="relative">
                <h2 className="mb-6 font-display text-5xl font-bold text-white">
                  {profile.name}님과<br />레슨 시작하기
                </h2>
                <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80">
                  지금 문의하시면 빠른 시간 내에 답변 드리겠습니다
                </p>
                <button
                  onClick={() => setOpen(true)}
                  className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#f4e5c2] px-12 py-5 text-xl font-bold text-[#1a1f3a] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
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
