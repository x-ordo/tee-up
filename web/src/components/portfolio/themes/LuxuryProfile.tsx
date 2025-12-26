'use client'

import { useMemo } from 'react'
import { BRAND_THEMES, getThemeCSSVariables, type BrandThemeId } from './brand-themes'
import type { ProProfile } from '@/actions/profiles'

interface LuxuryProfileProps {
  profile: ProProfile & {
    highlights?: { label: string; value: string }[]
    lessonTypes?: { name: string; duration?: number; price: number; description?: string }[]
  }
  themeId: BrandThemeId
}

/**
 * 럭셔리 브랜드 테마 프로필 페이지
 * Dior / Louis Vuitton / Chrome Hearts / Nike 스타일
 */
export function LuxuryProfile({ profile, themeId }: LuxuryProfileProps) {
  const theme = BRAND_THEMES[themeId]
  const cssVars = useMemo(() => getThemeCSSVariables(theme), [theme])

  // 기본 하이라이트
  const highlights = profile.highlights || [
    { label: '경력', value: '10년+' },
    { label: '수강생', value: '500+' },
    { label: '평점', value: `${profile.rating || 4.9}` },
  ]

  // 기본 레슨 타입
  const lessonTypes = profile.lessonTypes || [
    { name: '1:1 개인 레슨', duration: 60, price: 80000 },
    { name: '그룹 레슨 (2-4인)', duration: 90, price: 50000 },
    { name: '필드 라운딩', duration: 240, price: 400000 },
  ]

  return (
    <div 
      className="min-h-screen"
      style={{
        ...cssVars as React.CSSProperties,
        backgroundColor: theme.colors.bgPrimary,
        color: theme.colors.textPrimary,
        fontFamily: theme.typography.fontBody,
      }}
    >
      {/* 테마별 렌더링 */}
      {themeId === 'dior' && (
        <DiorProfile 
          profile={profile} 
          theme={theme} 
          highlights={highlights}
          lessonTypes={lessonTypes}
        />
      )}
      {themeId === 'louisvuitton' && (
        <LouisVuittonProfile 
          profile={profile} 
          theme={theme} 
          highlights={highlights}
          lessonTypes={lessonTypes}
        />
      )}
      {themeId === 'chromehearts' && (
        <ChromeHeartsProfile 
          profile={profile} 
          theme={theme} 
          highlights={highlights}
          lessonTypes={lessonTypes}
        />
      )}
      {themeId === 'nike' && (
        <NikeProfile 
          profile={profile} 
          theme={theme} 
          highlights={highlights}
          lessonTypes={lessonTypes}
        />
      )}
    </div>
  )
}

// ============================================================
// DIOR - Refined Elegance
// ============================================================
function DiorProfile({ 
  profile, 
  theme, 
  highlights,
  lessonTypes 
}: { 
  profile: LuxuryProfileProps['profile']
  theme: typeof BRAND_THEMES['dior']
  highlights: { label: string; value: string }[]
  lessonTypes: { name: string; duration?: number; price: number; description?: string }[]
}) {
  const proName = profile.title?.split(' ')[0] || profile.title || '프로'

  return (
    <>
      {/* Hero - 극도의 미니멀 */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center"
        style={{ padding: theme.layout.sectionPadding }}
      >
        {/* 프로필 이미지 */}
        {profile.hero_image_url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={profile.hero_image_url} 
              alt={proName}
              className="w-full h-full object-cover opacity-20 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
          </div>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* 카테고리 */}
          <p 
            className="uppercase mb-6"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              letterSpacing: theme.typography.letterSpacingNav,
              color: theme.colors.textMuted,
              fontSize: '11px',
            }}
          >
            Golf Professional
          </p>

          {/* 이름 */}
          <h1 
            className="uppercase mb-8"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              letterSpacing: theme.typography.letterSpacingDisplay,
              fontSize: 'clamp(32px, 8vw, 64px)',
              lineHeight: 1.1,
            }}
          >
            {proName}
          </h1>

          {/* 골드 디바이더 */}
          <div 
            className="w-16 h-px mx-auto mb-8"
            style={{ backgroundColor: theme.colors.accent }}
          />

          {/* 자격/위치 */}
          <p 
            className="uppercase"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              letterSpacing: theme.typography.letterSpacingNav,
              color: theme.colors.textSecondary,
              fontSize: '12px',
            }}
          >
            {profile.certifications?.[0] || 'KPGA Professional'}
            {profile.location && ` · ${profile.location}`}
          </p>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-black/20" />
        </div>
      </section>

      {/* 소개 */}
      {profile.bio && (
        <section 
          className="text-center"
          style={{ 
            padding: `${theme.layout.sectionPadding} 24px`,
            backgroundColor: theme.colors.bgSecondary,
          }}
        >
          <div className="max-w-2xl mx-auto">
            <p 
              className="leading-relaxed"
              style={{ 
                fontFamily: theme.typography.fontBody,
                fontWeight: theme.typography.fontWeightBody,
                letterSpacing: theme.typography.letterSpacingBody,
                fontSize: '15px',
                lineHeight: 2,
                color: theme.colors.textSecondary,
              }}
            >
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* 하이라이트 */}
      <section 
        style={{ padding: `${theme.layout.sectionPadding} 24px` }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            {highlights.map((item, idx) => (
              <div key={idx} className="text-center">
                <p 
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    fontWeight: theme.typography.fontWeightDisplay,
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    letterSpacing: '-0.02em',
                    color: theme.colors.textPrimary,
                  }}
                >
                  {item.value}
                </p>
                <p 
                  className="uppercase mt-2"
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    letterSpacing: theme.typography.letterSpacingNav,
                    fontSize: '10px',
                    color: theme.colors.textMuted,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 레슨 */}
      <section 
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgSecondary,
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-center uppercase mb-16"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              letterSpacing: theme.typography.letterSpacingDisplay,
              fontSize: '14px',
            }}
          >
            Lesson Programs
          </h2>

          <div className="space-y-0">
            {lessonTypes.map((lesson, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center py-6"
                style={{ borderBottom: `1px solid ${theme.colors.border}` }}
              >
                <div>
                  <p 
                    className="uppercase"
                    style={{ 
                      fontFamily: theme.typography.fontDisplay,
                      letterSpacing: '0.1em',
                      fontSize: '13px',
                    }}
                  >
                    {lesson.name}
                  </p>
                  {lesson.duration && (
                    <p 
                      className="mt-1"
                      style={{ 
                        fontSize: '12px',
                        color: theme.colors.textMuted,
                      }}
                    >
                      {lesson.duration}분
                    </p>
                  )}
                </div>
                <p 
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    letterSpacing: '0.05em',
                    fontSize: '14px',
                    color: theme.colors.accent,
                  }}
                >
                  ₩{lesson.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="text-center"
        style={{ padding: `${theme.layout.sectionPadding} 24px` }}
      >
        <a
          href={profile.open_chat_url || '#contact'}
          className="inline-block uppercase transition-all duration-300 hover:opacity-60"
          style={{ 
            fontFamily: theme.typography.fontDisplay,
            fontWeight: 400,
            letterSpacing: theme.typography.letterSpacingDisplay,
            fontSize: '11px',
            padding: '16px 48px',
            backgroundColor: theme.colors.textPrimary,
            color: theme.colors.bgPrimary,
            border: `1px solid ${theme.colors.textPrimary}`,
          }}
        >
          Book Consultation
        </a>
      </section>

      {/* Footer */}
      <footer 
        className="text-center py-12"
        style={{ 
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: theme.colors.textMuted,
        }}
      >
        © {new Date().getFullYear()} {proName.toUpperCase()}
      </footer>
    </>
  )
}

// ============================================================
// LOUIS VUITTON - Heritage Luxury
// ============================================================
function LouisVuittonProfile({ 
  profile, 
  theme, 
  highlights,
  lessonTypes 
}: { 
  profile: LuxuryProfileProps['profile']
  theme: typeof BRAND_THEMES['louisvuitton']
  highlights: { label: string; value: string }[]
  lessonTypes: { name: string; duration?: number; price: number; description?: string }[]
}) {
  const proName = profile.title?.split(' ')[0] || profile.title || '프로'

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          {profile.hero_image_url ? (
            <img 
              src={profile.hero_image_url} 
              alt={proName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div style={{ backgroundColor: theme.colors.bgSecondary }} className="w-full h-full" />
          )}
          <div 
            className="absolute inset-0"
            style={{ 
              background: `linear-gradient(to bottom, 
                rgba(250,249,247,0.3) 0%, 
                rgba(250,249,247,0.6) 50%,
                ${theme.colors.bgPrimary} 100%
              )` 
            }}
          />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 min-h-screen flex flex-col justify-end pb-24 px-6">
          <div className="max-w-5xl mx-auto w-full">
            {/* 골드 라인 */}
            <div 
              className="w-24 h-1 mb-8"
              style={{ backgroundColor: theme.colors.accent }}
            />

            {/* 이름 */}
            <h1 
              className="uppercase mb-4"
              style={{ 
                fontFamily: theme.typography.fontDisplay,
                fontWeight: theme.typography.fontWeightDisplay,
                letterSpacing: theme.typography.letterSpacingDisplay,
                fontSize: 'clamp(40px, 10vw, 80px)',
                lineHeight: 1,
                color: theme.colors.textSecondary,
              }}
            >
              {proName}
            </h1>

            {/* 자격 */}
            <p 
              style={{ 
                fontFamily: theme.typography.fontBody,
                fontSize: '18px',
                fontStyle: 'italic',
                color: theme.colors.accent,
              }}
            >
              {profile.certifications?.[0] || 'KPGA Professional'}
            </p>
          </div>
        </div>
      </section>

      {/* 소개 */}
      {profile.bio && (
        <section 
          style={{ 
            padding: `${theme.layout.sectionPadding} 24px`,
            backgroundColor: theme.colors.bgPrimary,
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div 
              className="pl-8"
              style={{ borderLeft: `3px solid ${theme.colors.accent}` }}
            >
              <p 
                style={{ 
                  fontFamily: theme.typography.fontBody,
                  fontSize: '18px',
                  lineHeight: 1.8,
                  color: theme.colors.textSecondary,
                }}
              >
                {profile.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 하이라이트 */}
      <section 
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgSecondary,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="text-center p-8"
                style={{ 
                  backgroundColor: theme.colors.bgPrimary,
                  boxShadow: theme.effects.shadow,
                }}
              >
                <p 
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    fontWeight: theme.typography.fontWeightDisplay,
                    fontSize: '48px',
                    color: theme.colors.accent,
                  }}
                >
                  {item.value}
                </p>
                <p 
                  className="uppercase mt-4"
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    letterSpacing: theme.typography.letterSpacingNav,
                    fontSize: '11px',
                    color: theme.colors.textMuted,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 레슨 */}
      <section 
        style={{ padding: `${theme.layout.sectionPadding} 24px` }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 
            className="uppercase text-center mb-16"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              letterSpacing: theme.typography.letterSpacingNav,
              fontSize: '13px',
              color: theme.colors.textSecondary,
            }}
          >
            Lesson Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessonTypes.map((lesson, idx) => (
              <div 
                key={idx}
                className="p-8"
                style={{ 
                  backgroundColor: theme.colors.bgSecondary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <p 
                  className="uppercase"
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    letterSpacing: '0.1em',
                    fontSize: '14px',
                    color: theme.colors.textSecondary,
                  }}
                >
                  {lesson.name}
                </p>
                <p 
                  className="mt-4"
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    fontSize: '28px',
                    color: theme.colors.accent,
                  }}
                >
                  ₩{lesson.price.toLocaleString()}
                </p>
                {lesson.duration && (
                  <p 
                    className="mt-2"
                    style={{ 
                      fontFamily: theme.typography.fontBody,
                      fontStyle: 'italic',
                      fontSize: '14px',
                      color: theme.colors.textMuted,
                    }}
                  >
                    {lesson.duration}분 세션
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="text-center"
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.textSecondary,
        }}
      >
        <h3 
          className="uppercase mb-8"
          style={{ 
            fontFamily: theme.typography.fontDisplay,
            letterSpacing: theme.typography.letterSpacingNav,
            fontSize: '12px',
            color: theme.colors.bgSecondary,
          }}
        >
          Begin Your Journey
        </h3>
        <a
          href={profile.open_chat_url || '#contact'}
          className="inline-block uppercase transition-all duration-300 hover:bg-opacity-90"
          style={{ 
            fontFamily: theme.typography.fontDisplay,
            letterSpacing: theme.typography.letterSpacingNav,
            fontSize: '12px',
            padding: '18px 56px',
            backgroundColor: theme.colors.accent,
            color: theme.colors.bgPrimary,
          }}
        >
          Make a Reservation
        </a>
      </section>

      {/* Footer */}
      <footer 
        className="text-center py-12"
        style={{ 
          backgroundColor: theme.colors.bgSecondary,
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: theme.colors.textMuted,
        }}
      >
        <div 
          className="w-8 h-8 mx-auto mb-4 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ 
            backgroundColor: theme.colors.accent,
            color: theme.colors.bgPrimary,
          }}
        >
          {proName.charAt(0)}
        </div>
        © {new Date().getFullYear()}
      </footer>
    </>
  )
}

// ============================================================
// CHROME HEARTS - Gothic Luxury
// ============================================================
function ChromeHeartsProfile({ 
  profile, 
  theme, 
  highlights,
  lessonTypes 
}: { 
  profile: LuxuryProfileProps['profile']
  theme: typeof BRAND_THEMES['chromehearts']
  highlights: { label: string; value: string }[]
  lessonTypes: { name: string; duration?: number; price: number; description?: string }[]
}) {
  const proName = profile.title?.split(' ')[0] || profile.title || '프로'

  return (
    <>
      {/* Hero */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{ 
          backgroundColor: theme.colors.bgPrimary,
          padding: '24px',
        }}
      >
        {/* 배경 이미지 (어둡게) */}
        {profile.hero_image_url && (
          <div className="absolute inset-0">
            <img 
              src={profile.hero_image_url} 
              alt={proName}
              className="w-full h-full object-cover opacity-30"
              style={{ filter: 'grayscale(100%) contrast(1.2)' }}
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: 'radial-gradient(circle at center, transparent 0%, #0A0A0A 70%)' 
              }}
            />
          </div>
        )}

        {/* 메탈릭 프레임 */}
        <div 
          className="absolute inset-8 md:inset-16"
          style={{ 
            border: '1px solid',
            borderImage: `linear-gradient(45deg, ${theme.colors.accentSecondary}, ${theme.colors.accent}, ${theme.colors.accentSecondary}) 1`,
          }}
        />

        {/* 콘텐츠 */}
        <div className="relative z-10 text-center">
          {/* 크롬 이펙트 네임 */}
          <h1 
            className="mb-4"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              fontSize: 'clamp(48px, 15vw, 120px)',
              lineHeight: 1,
              background: theme.effects.metallic,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '4px 4px 8px rgba(0,0,0,0.8)',
              filter: 'drop-shadow(0 0 20px rgba(196,196,196,0.3))',
            }}
          >
            {proName.toUpperCase()}
          </h1>

          {/* 서브타이틀 */}
          <p 
            className="uppercase"
            style={{ 
              fontFamily: theme.typography.fontBody,
              letterSpacing: theme.typography.letterSpacingNav,
              fontSize: '12px',
              color: theme.colors.textMuted,
            }}
          >
            {profile.certifications?.[0] || 'Professional Golfer'}
          </p>

          {/* 위치 */}
          {profile.location && (
            <p 
              className="mt-4 uppercase"
              style={{ 
                fontFamily: theme.typography.fontBody,
                letterSpacing: '0.2em',
                fontSize: '10px',
                color: theme.colors.accent,
              }}
            >
              ✦ {profile.location} ✦
            </p>
          )}
        </div>

        {/* 스크롤 */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          style={{ color: theme.colors.textMuted }}
        >
          <p className="text-xs uppercase tracking-widest mb-2">Scroll</p>
          <div className="w-px h-8 mx-auto bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* 소개 */}
      {profile.bio && (
        <section 
          style={{ 
            padding: `${theme.layout.sectionPadding} 24px`,
            backgroundColor: theme.colors.bgSecondary,
          }}
        >
          <div className="max-w-2xl mx-auto text-center">
            {/* 데코 */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px" style={{ backgroundColor: theme.colors.accent }} />
              <span style={{ color: theme.colors.accent }}>✦</span>
              <div className="w-16 h-px" style={{ backgroundColor: theme.colors.accent }} />
            </div>

            <p 
              style={{ 
                fontFamily: theme.typography.fontBody,
                fontSize: '16px',
                lineHeight: 2,
                color: theme.colors.textSecondary,
              }}
            >
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* 하이라이트 */}
      <section 
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgPrimary,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="text-center p-6"
                style={{ 
                  border: `1px solid ${theme.colors.border}`,
                  background: 'linear-gradient(180deg, rgba(30,30,30,0.5) 0%, rgba(10,10,10,1) 100%)',
                }}
              >
                <p 
                  style={{ 
                    fontFamily: theme.typography.fontBody,
                    fontWeight: 700,
                    fontSize: 'clamp(28px, 5vw, 40px)',
                    background: theme.effects.metallic,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {item.value}
                </p>
                <p 
                  className="uppercase mt-2"
                  style={{ 
                    fontFamily: theme.typography.fontBody,
                    letterSpacing: '0.15em',
                    fontSize: '9px',
                    color: theme.colors.textMuted,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 레슨 */}
      <section 
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgSecondary,
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 
            className="text-center uppercase mb-12"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontSize: '24px',
              color: theme.colors.textPrimary,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Services
          </h2>

          <div className="space-y-4">
            {lessonTypes.map((lesson, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center p-6"
                style={{ 
                  border: `1px solid ${theme.colors.border}`,
                  background: 'rgba(0,0,0,0.3)',
                }}
              >
                <div>
                  <p 
                    className="uppercase"
                    style={{ 
                      fontFamily: theme.typography.fontBody,
                      letterSpacing: '0.1em',
                      fontSize: '14px',
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {lesson.name}
                  </p>
                  {lesson.duration && (
                    <p 
                      className="mt-1"
                      style={{ fontSize: '12px', color: theme.colors.textMuted }}
                    >
                      {lesson.duration} MIN
                    </p>
                  )}
                </div>
                <p 
                  style={{ 
                    fontFamily: theme.typography.fontBody,
                    fontWeight: 700,
                    fontSize: '18px',
                    color: theme.colors.accent,
                  }}
                >
                  ₩{lesson.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="text-center"
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgPrimary,
        }}
      >
        <a
          href={profile.open_chat_url || '#contact'}
          className="inline-block uppercase transition-all duration-300 hover:scale-105"
          style={{ 
            fontFamily: theme.typography.fontBody,
            letterSpacing: '0.15em',
            fontSize: '12px',
            padding: '18px 48px',
            border: `2px solid ${theme.colors.accent}`,
            color: theme.colors.textPrimary,
            background: 'transparent',
          }}
        >
          Book Now
        </a>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 text-center"
        style={{ 
          backgroundColor: theme.colors.bgSecondary,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span style={{ color: theme.colors.accent }}>✦</span>
          <span 
            className="uppercase"
            style={{ 
              fontFamily: theme.typography.fontBody,
              letterSpacing: '0.2em',
              fontSize: '10px',
              color: theme.colors.textMuted,
            }}
          >
            {proName}
          </span>
          <span style={{ color: theme.colors.accent }}>✦</span>
        </div>
        <p style={{ fontSize: '10px', color: theme.colors.textMuted }}>
          © {new Date().getFullYear()}
        </p>
      </footer>
    </>
  )
}

// ============================================================
// NIKE - Athletic Performance
// ============================================================
function NikeProfile({ 
  profile, 
  theme, 
  highlights,
  lessonTypes 
}: { 
  profile: LuxuryProfileProps['profile']
  theme: typeof BRAND_THEMES['nike']
  highlights: { label: string; value: string }[]
  lessonTypes: { name: string; duration?: number; price: number; description?: string }[]
}) {
  const proName = profile.title?.split(' ')[0] || profile.title || '프로'

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen">
        {/* 배경 */}
        <div className="absolute inset-0">
          {profile.hero_image_url ? (
            <img 
              src={profile.hero_image_url} 
              alt={proName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div style={{ backgroundColor: theme.colors.bgSecondary }} className="w-full h-full" />
          )}
          <div 
            className="absolute inset-0"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, transparent 100%)' 
            }}
          />
        </div>

        {/* 콘텐츠 */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16">
          <div className="max-w-5xl">
            {/* 작은 텍스트 */}
            <p 
              className="uppercase mb-4"
              style={{ 
                fontFamily: theme.typography.fontBody,
                letterSpacing: '0.1em',
                fontSize: '12px',
                color: theme.colors.accent,
                fontWeight: 600,
              }}
            >
              Golf Professional
            </p>

            {/* 이름 - 매우 크게 */}
            <h1 
              className="uppercase"
              style={{ 
                fontFamily: theme.typography.fontDisplay,
                fontWeight: theme.typography.fontWeightDisplay,
                letterSpacing: theme.typography.letterSpacingDisplay,
                fontSize: 'clamp(60px, 18vw, 180px)',
                lineHeight: 0.9,
                color: theme.colors.textPrimary,
              }}
            >
              {proName}
            </h1>

            {/* 자격 */}
            <div className="mt-8 flex items-center gap-4">
              <span 
                className="px-4 py-2 uppercase text-xs font-bold"
                style={{ 
                  backgroundColor: theme.colors.bgAccent,
                  color: theme.colors.bgPrimary,
                  borderRadius: theme.layout.borderRadius,
                }}
              >
                {profile.certifications?.[0] || 'KPGA'}
              </span>
              {profile.location && (
                <span 
                  style={{ 
                    fontSize: '14px',
                    color: theme.colors.textSecondary,
                  }}
                >
                  {profile.location}
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="mt-12">
              <a
                href={profile.open_chat_url || '#contact'}
                className="inline-block uppercase transition-all duration-200 hover:scale-105"
                style={{ 
                  fontFamily: theme.typography.fontBody,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  fontSize: '14px',
                  padding: '16px 40px',
                  backgroundColor: theme.colors.textPrimary,
                  color: theme.colors.bgPrimary,
                  borderRadius: theme.layout.borderRadiusLg,
                  transition: theme.effects.transition,
                }}
              >
                Start Training
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 하이라이트 - 큰 숫자 */}
      <section 
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgAccent,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <div key={idx} className="text-center">
                <p 
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    fontWeight: theme.typography.fontWeightDisplay,
                    fontSize: 'clamp(48px, 10vw, 100px)',
                    lineHeight: 1,
                    color: theme.colors.bgPrimary,
                  }}
                >
                  {item.value}
                </p>
                <p 
                  className="uppercase mt-4"
                  style={{ 
                    fontFamily: theme.typography.fontBody,
                    letterSpacing: '0.1em',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소개 */}
      {profile.bio && (
        <section 
          style={{ padding: `${theme.layout.sectionPadding} 24px` }}
        >
          <div className="max-w-3xl mx-auto">
            <p 
              style={{ 
                fontFamily: theme.typography.fontBody,
                fontSize: '20px',
                lineHeight: 1.8,
                color: theme.colors.textSecondary,
              }}
            >
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* 레슨 - 카드 그리드 */}
      <section 
        style={{ 
          padding: `${theme.layout.sectionPadding} 24px`,
          backgroundColor: theme.colors.bgSecondary,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 
            className="uppercase mb-12"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              fontSize: '48px',
              color: theme.colors.textPrimary,
            }}
          >
            Programs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessonTypes.map((lesson, idx) => (
              <div 
                key={idx}
                className="p-8 transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  backgroundColor: theme.colors.bgPrimary,
                  borderRadius: theme.layout.borderRadius,
                  boxShadow: theme.effects.shadow,
                }}
              >
                <p 
                  className="uppercase font-bold"
                  style={{ 
                    fontFamily: theme.typography.fontBody,
                    fontSize: '16px',
                    color: theme.colors.textPrimary,
                  }}
                >
                  {lesson.name}
                </p>
                {lesson.duration && (
                  <p 
                    className="mt-2"
                    style={{ 
                      fontSize: '14px',
                      color: theme.colors.textMuted,
                    }}
                  >
                    {lesson.duration}분
                  </p>
                )}
                <p 
                  className="mt-6"
                  style={{ 
                    fontFamily: theme.typography.fontDisplay,
                    fontWeight: theme.typography.fontWeightDisplay,
                    fontSize: '32px',
                    color: theme.colors.accent,
                  }}
                >
                  ₩{lesson.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 밴드 */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          padding: '48px 24px',
          backgroundColor: theme.colors.accent,
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 
            className="uppercase"
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              fontSize: 'clamp(24px, 5vw, 40px)',
              color: theme.colors.bgPrimary,
            }}
          >
            Ready to Improve?
          </h3>
          <a
            href={profile.open_chat_url || '#contact'}
            className="inline-block uppercase transition-all duration-200 hover:scale-105"
            style={{ 
              fontFamily: theme.typography.fontBody,
              fontWeight: 600,
              fontSize: '14px',
              padding: '16px 40px',
              backgroundColor: theme.colors.bgPrimary,
              color: theme.colors.textPrimary,
              borderRadius: theme.layout.borderRadiusLg,
            }}
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 text-center"
        style={{ 
          backgroundColor: theme.colors.bgAccent,
        }}
      >
        <p 
          style={{ 
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          © {new Date().getFullYear()} {proName.toUpperCase()}. All Rights Reserved.
        </p>
      </footer>
    </>
  )
}

export default LuxuryProfile
