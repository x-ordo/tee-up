'use client'

import { useState } from 'react'
import { BRAND_THEMES, THEME_PREVIEWS, type BrandThemeId } from './brand-themes'

interface BrandThemeSelectorProps {
  selectedTheme: BrandThemeId
  onSelectTheme: (themeId: BrandThemeId) => void
  disabled?: boolean
}

/**
 * 명품 브랜드 테마 선택 컴포넌트
 * 4가지 테마: Dior, Louis Vuitton, Chrome Hearts, Nike
 */
export function BrandThemeSelector({
  selectedTheme,
  onSelectTheme,
  disabled = false,
}: BrandThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<BrandThemeId | null>(null)

  const themeOrder: BrandThemeId[] = ['dior', 'louisvuitton', 'chromehearts', 'nike']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-tee-ink-strong mb-2">
          프로필 스타일
        </h3>
        <p className="text-sm text-tee-ink-muted">
          나를 표현하는 스타일을 선택하세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {themeOrder.map((themeId) => {
          const theme = BRAND_THEMES[themeId]
          const preview = THEME_PREVIEWS[themeId]
          const isSelected = selectedTheme === themeId
          const isHovered = hoveredTheme === themeId

          return (
            <button
              key={themeId}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTheme(themeId)}
              onMouseEnter={() => setHoveredTheme(themeId)}
              onMouseLeave={() => setHoveredTheme(null)}
              className={`
                relative group overflow-hidden rounded-xl transition-all duration-300
                ${isSelected 
                  ? 'ring-2 ring-tee-accent-primary ring-offset-2' 
                  : 'hover:ring-2 hover:ring-tee-ink-muted/30 hover:ring-offset-1'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* 프리뷰 배경 */}
              <div
                className="aspect-[4/3] relative"
                style={{ backgroundColor: preview.primary }}
              >
                {/* 테마별 미니 프리뷰 */}
                <ThemePreviewContent themeId={themeId} theme={theme} isHovered={isHovered} />
                
                {/* 선택됨 표시 */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-tee-accent-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 테마 정보 */}
              <div className="p-4 bg-white border-t border-tee-stone">
                <p 
                  className="font-semibold text-sm tracking-wide"
                  style={{ 
                    letterSpacing: theme.typography.letterSpacingNav,
                    color: preview.isDark ? theme.colors.accent : theme.colors.textPrimary 
                  }}
                >
                  {theme.name}
                </p>
                <p className="text-xs text-tee-ink-muted mt-1">
                  {theme.descriptionKo}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* 선택된 테마 설명 */}
      <div className="p-4 bg-tee-surface rounded-lg border border-tee-stone">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: BRAND_THEMES[selectedTheme].colors.accent }}
          />
          <span className="font-medium text-tee-ink-strong">
            {BRAND_THEMES[selectedTheme].name} 스타일
          </span>
        </div>
        <p className="text-sm text-tee-ink-muted">
          {getThemeDescription(selectedTheme)}
        </p>
      </div>
    </div>
  )
}

/**
 * 테마별 미니 프리뷰 컨텐츠
 */
function ThemePreviewContent({ 
  themeId, 
  theme,
  isHovered 
}: { 
  themeId: BrandThemeId
  theme: typeof BRAND_THEMES[BrandThemeId]
  isHovered: boolean
}) {
  switch (themeId) {
    case 'dior':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {/* 미니멀 네임 */}
          <div 
            className={`text-center transition-all duration-500 ${isHovered ? 'scale-105' : ''}`}
            style={{ 
              fontFamily: theme.typography.fontDisplay,
              fontWeight: theme.typography.fontWeightDisplay,
              letterSpacing: theme.typography.letterSpacingDisplay,
            }}
          >
            <div className="text-xs text-gray-400 uppercase mb-1">Golf Professional</div>
            <div className="text-lg text-black uppercase">KIM DONGHYUN</div>
          </div>
          {/* 골드 라인 */}
          <div 
            className="w-12 h-px mt-4"
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>
      )

    case 'louisvuitton':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {/* LV 스타일 네임 */}
          <div className={`text-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
            <div 
              className="text-lg font-medium uppercase"
              style={{ 
                fontFamily: theme.typography.fontDisplay,
                letterSpacing: '0.15em',
                color: theme.colors.textSecondary,
              }}
            >
              김동현
            </div>
            <div 
              className="text-xs mt-2"
              style={{ 
                fontFamily: theme.typography.fontBody,
                color: theme.colors.accent,
              }}
            >
              KPGA Professional
            </div>
          </div>
          {/* 골드 보더 */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: theme.colors.accent }} />
        </div>
      )

    case 'chromehearts':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {/* 크롬 이펙트 네임 */}
          <div className={`text-center transition-all duration-300 ${isHovered ? 'scale-105' : ''}`}>
            <div 
              className="text-2xl font-bold"
              style={{ 
                fontFamily: theme.typography.fontDisplay,
                background: theme.effects.metallic,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              KIM
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-widest mt-2">
              Pro Golfer
            </div>
          </div>
          {/* 메탈릭 보더 */}
          <div className="absolute inset-4 border border-gray-600 rounded" />
        </div>
      )

    case 'nike':
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          {/* 볼드 스포티 네임 */}
          <div className={`text-center transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
            <div 
              className="text-3xl font-black uppercase leading-none"
              style={{ 
                fontFamily: theme.typography.fontDisplay,
                letterSpacing: '-0.02em',
                color: theme.colors.textPrimary,
              }}
            >
              김동현
            </div>
            <div 
              className="text-xs font-bold uppercase tracking-wider mt-2"
              style={{ color: theme.colors.accent }}
            >
              Just Play
            </div>
          </div>
          {/* 다이나믹 액센트 */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: theme.colors.accent }}
          >
            BOOK NOW
          </div>
        </div>
      )
  }
}

/**
 * 테마 설명
 */
function getThemeDescription(themeId: BrandThemeId): string {
  switch (themeId) {
    case 'dior':
      return '극도의 미니멀리즘. 넓은 여백과 얇은 타이포그래피로 정제된 우아함을 표현합니다. 클래식하고 세련된 프로에게 추천.'
    case 'louisvuitton':
      return '클래식 럭셔리. 골드 액센트와 세리프 서체로 헤리티지와 신뢰를 전달합니다. 경력 있는 베테랑 프로에게 추천.'
    case 'chromehearts':
      return '다크 럭셔리. 고딕 타이포그래피와 크롬 메탈릭 효과로 강렬한 개성을 표현합니다. 독특한 스타일의 프로에게 추천.'
    case 'nike':
      return '애슬레틱 에너지. 볼드한 타이포그래피와 역동적인 레이아웃으로 스포츠맨십을 강조합니다. 활동적인 투어 프로에게 추천.'
  }
}

export default BrandThemeSelector
