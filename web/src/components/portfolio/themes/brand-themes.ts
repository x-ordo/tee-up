/**
 * TEE UP Luxury Brand Theme System
 * 
 * 4가지 명품 브랜드 스타일 테마
 * 프로골퍼의 과시욕을 충족시키는 프리미엄 디자인
 * 
 * - DIOR: 미니멀 엘레강스 - 정제된 우아함
 * - LOUIS VUITTON: 헤리티지 럭셔리 - 클래식 명품
 * - CHROME HEARTS: 고딕 럭셔리 - 엣지있는 다크
 * - NIKE: 애슬레틱 퍼포먼스 - 역동적 스포츠
 */

export type BrandThemeId = 'dior' | 'louisvuitton' | 'chromehearts' | 'nike'

export interface BrandTheme {
  id: BrandThemeId
  name: string
  nameKo: string
  description: string
  descriptionKo: string
  
  // 컬러 팔레트
  colors: {
    bgPrimary: string
    bgSecondary: string
    bgAccent: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    accent: string
    accentSecondary?: string
    border: string
    borderAccent?: string
  }
  
  // 타이포그래피
  typography: {
    fontDisplay: string
    fontBody: string
    fontMono?: string
    letterSpacingDisplay: string
    letterSpacingNav: string
    letterSpacingBody: string
    fontWeightDisplay: number
    fontWeightBody: number
  }
  
  // 레이아웃
  layout: {
    borderRadius: string
    borderRadiusLg: string
    sectionPadding: string
    sectionPaddingMobile: string
    containerMaxWidth: string
  }
  
  // 효과
  effects: {
    shadow: string
    shadowLg: string
    transition: string
    hoverScale?: string
    gradient?: string
    metallic?: string
  }
  
  // 특수 스타일
  special?: {
    nameEffect?: 'chrome' | 'gradient' | 'none'
    buttonStyle?: 'sharp' | 'pill' | 'outline'
    dividerStyle?: 'hairline' | 'gold' | 'metallic' | 'none'
  }
}

export const BRAND_THEMES: Record<BrandThemeId, BrandTheme> = {
  /**
   * DIOR - Refined Elegance
   * 극도의 절제와 정제된 타이포그래피
   * 여백으로 럭셔리를 표현
   */
  dior: {
    id: 'dior',
    name: 'DIOR',
    nameKo: '디올',
    description: 'Refined Elegance',
    descriptionKo: '정제된 우아함',
    
    colors: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F8F8F8',
      bgAccent: '#F5F5F5',
      textPrimary: '#000000',
      textSecondary: '#4A4A4A',
      textMuted: '#9E9E9E',
      accent: '#C9A962', // Dior Gold
      border: '#E5E5E5',
      borderAccent: '#C9A962',
    },
    
    typography: {
      fontDisplay: '"Century Gothic", "Futura", "Avenir", sans-serif',
      fontBody: '"Century Gothic", "Futura", sans-serif',
      letterSpacingDisplay: '0.2em',
      letterSpacingNav: '0.25em',
      letterSpacingBody: '0.02em',
      fontWeightDisplay: 300,
      fontWeightBody: 300,
    },
    
    layout: {
      borderRadius: '0',
      borderRadiusLg: '0',
      sectionPadding: '120px',
      sectionPaddingMobile: '64px',
      containerMaxWidth: '1200px',
    },
    
    effects: {
      shadow: 'none',
      shadowLg: '0 20px 60px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    
    special: {
      nameEffect: 'none',
      buttonStyle: 'sharp',
      dividerStyle: 'hairline',
    },
  },

  /**
   * LOUIS VUITTON - Heritage Luxury
   * Futura + Georgia 조합
   * 브라운/골드 헤리티지 컬러
   */
  louisvuitton: {
    id: 'louisvuitton',
    name: 'LOUIS VUITTON',
    nameKo: '루이비통',
    description: 'Heritage Luxury',
    descriptionKo: '헤리티지 럭셔리',
    
    colors: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#FAF9F7',
      bgAccent: '#F5F3EF',
      textPrimary: '#1A1A1A',
      textSecondary: '#453630', // LV Brown
      textMuted: '#7A7A7A',
      accent: '#9B7E4B', // LV Gold
      accentSecondary: '#453630', // LV Brown
      border: '#E8E6E2',
      borderAccent: '#9B7E4B',
    },
    
    typography: {
      fontDisplay: '"Futura", "Helvetica Neue", sans-serif',
      fontBody: '"Georgia", "Times New Roman", serif',
      letterSpacingDisplay: '0.12em',
      letterSpacingNav: '0.15em',
      letterSpacingBody: '0.01em',
      fontWeightDisplay: 500,
      fontWeightBody: 400,
    },
    
    layout: {
      borderRadius: '0',
      borderRadiusLg: '0',
      sectionPadding: '96px',
      sectionPaddingMobile: '56px',
      containerMaxWidth: '1280px',
    },
    
    effects: {
      shadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      shadowLg: '0 12px 40px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
    },
    
    special: {
      nameEffect: 'none',
      buttonStyle: 'sharp',
      dividerStyle: 'gold',
    },
  },

  /**
   * CHROME HEARTS - Gothic Luxury
   * 블랙레터 타이포그래피
   * 다크 모드 + 크롬 메탈릭 효과
   */
  chromehearts: {
    id: 'chromehearts',
    name: 'CHROME HEARTS',
    nameKo: '크롬하츠',
    description: 'Gothic Luxury',
    descriptionKo: '고딕 럭셔리',
    
    colors: {
      bgPrimary: '#0A0A0A',
      bgSecondary: '#000000',
      bgAccent: '#111111',
      textPrimary: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.85)',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      accent: '#C4C4C4', // Chrome Silver
      accentSecondary: '#737474', // Dark Silver
      border: '#2A2A2A',
      borderAccent: '#C4C4C4',
    },
    
    typography: {
      // 고딕 폰트는 display에만, body는 산세리프
      fontDisplay: '"UnifrakturCook", "Old English Text MT", serif',
      fontBody: '"Helvetica Neue", "Arial", sans-serif',
      letterSpacingDisplay: '0.05em',
      letterSpacingNav: '0.15em',
      letterSpacingBody: '0.02em',
      fontWeightDisplay: 700,
      fontWeightBody: 400,
    },
    
    layout: {
      borderRadius: '0',
      borderRadiusLg: '2px',
      sectionPadding: '80px',
      sectionPaddingMobile: '48px',
      containerMaxWidth: '1100px',
    },
    
    effects: {
      shadow: '0 0 40px rgba(0, 0, 0, 0.6)',
      shadowLg: '0 0 80px rgba(0, 0, 0, 0.8)',
      transition: 'all 0.3s ease',
      metallic: 'linear-gradient(to bottom, #999 5%, #FFF 10%, #CCC 30%, #DDD 50%, #CCC 70%, #FFF 80%, #999 95%)',
    },
    
    special: {
      nameEffect: 'chrome',
      buttonStyle: 'outline',
      dividerStyle: 'metallic',
    },
  },

  /**
   * NIKE - Athletic Performance
   * 볼드하고 역동적인 스포츠 에스테틱
   * 오렌지/볼트 액센트
   */
  nike: {
    id: 'nike',
    name: 'NIKE',
    nameKo: '나이키',
    description: 'Athletic Performance',
    descriptionKo: '애슬레틱 퍼포먼스',
    
    colors: {
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F6F6F6',
      bgAccent: '#111111',
      textPrimary: '#111111',
      textSecondary: '#555555',
      textMuted: '#757575',
      accent: '#FA5400', // Nike Orange
      accentSecondary: '#CEFF00', // Nike Volt
      border: '#E5E5E5',
      borderAccent: '#111111',
    },
    
    typography: {
      fontDisplay: '"Futura Bold Condensed", "Helvetica Neue Bold Condensed", sans-serif',
      fontBody: '"Helvetica Neue", "Arial", sans-serif',
      letterSpacingDisplay: '-0.02em',
      letterSpacingNav: '0.05em',
      letterSpacingBody: '0',
      fontWeightDisplay: 800,
      fontWeightBody: 400,
    },
    
    layout: {
      borderRadius: '24px',
      borderRadiusLg: '30px',
      sectionPadding: '84px',
      sectionPaddingMobile: '48px',
      containerMaxWidth: '1400px',
    },
    
    effects: {
      shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      shadowLg: '0 16px 48px rgba(0, 0, 0, 0.12)',
      transition: 'all 250ms cubic-bezier(0.77, 0, 0.175, 1)',
      hoverScale: '1.02',
    },
    
    special: {
      nameEffect: 'none',
      buttonStyle: 'pill',
      dividerStyle: 'none',
    },
  },
}

/**
 * 테마별 CSS 변수 생성
 */
export function getThemeCSSVariables(theme: BrandTheme): Record<string, string> {
  return {
    // Colors
    '--theme-bg-primary': theme.colors.bgPrimary,
    '--theme-bg-secondary': theme.colors.bgSecondary,
    '--theme-bg-accent': theme.colors.bgAccent,
    '--theme-text-primary': theme.colors.textPrimary,
    '--theme-text-secondary': theme.colors.textSecondary,
    '--theme-text-muted': theme.colors.textMuted,
    '--theme-accent': theme.colors.accent,
    '--theme-accent-secondary': theme.colors.accentSecondary || theme.colors.accent,
    '--theme-border': theme.colors.border,
    '--theme-border-accent': theme.colors.borderAccent || theme.colors.accent,
    
    // Typography
    '--theme-font-display': theme.typography.fontDisplay,
    '--theme-font-body': theme.typography.fontBody,
    '--theme-letter-spacing-display': theme.typography.letterSpacingDisplay,
    '--theme-letter-spacing-nav': theme.typography.letterSpacingNav,
    '--theme-letter-spacing-body': theme.typography.letterSpacingBody,
    '--theme-font-weight-display': String(theme.typography.fontWeightDisplay),
    '--theme-font-weight-body': String(theme.typography.fontWeightBody),
    
    // Layout
    '--theme-border-radius': theme.layout.borderRadius,
    '--theme-border-radius-lg': theme.layout.borderRadiusLg,
    '--theme-section-padding': theme.layout.sectionPadding,
    '--theme-section-padding-mobile': theme.layout.sectionPaddingMobile,
    '--theme-container-max-width': theme.layout.containerMaxWidth,
    
    // Effects
    '--theme-shadow': theme.effects.shadow,
    '--theme-shadow-lg': theme.effects.shadowLg,
    '--theme-transition': theme.effects.transition,
    '--theme-hover-scale': theme.effects.hoverScale || '1',
  }
}

/**
 * 테마 프리뷰 컬러 (선택 UI용)
 */
export const THEME_PREVIEWS: Record<BrandThemeId, { primary: string; accent: string; isDark: boolean }> = {
  dior: { primary: '#FFFFFF', accent: '#C9A962', isDark: false },
  louisvuitton: { primary: '#FAF9F7', accent: '#9B7E4B', isDark: false },
  chromehearts: { primary: '#0A0A0A', accent: '#C4C4C4', isDark: true },
  nike: { primary: '#FFFFFF', accent: '#FA5400', isDark: false },
}

export default BRAND_THEMES
