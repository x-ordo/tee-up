/**
 * TEE UP Design Tokens
 * 
 * 연구 기반 프리미엄 프로필 디자인 시스템
 * 
 * References:
 * - 2024-2025 Premium Personal Branding Trends
 * - Luxury Brand Typography (Playfair Display + Lato)
 * - 60-30-10 Color Rule
 * - 8-Point Grid Spacing System
 * - Mobile-First Conversion Optimization
 */

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

/**
 * 프리미엄 폰트 페어링
 * 
 * Primary: Playfair Display (Serif) - 헤드라인, 브랜드
 * Secondary: Lato/Montserrat (Sans-serif) - 본문, UI
 * Accent: Noto Sans KR - 한글 지원
 */
export const TYPOGRAPHY = {
  fontFamilies: {
    // 프리미엄 조합 (연구 권장)
    display: '"Playfair Display", Georgia, "Noto Serif KR", serif',
    body: '"Lato", "Noto Sans KR", sans-serif',
    accent: '"Montserrat", "Noto Sans KR", sans-serif',
    
    // 대체 조합
    displayAlt: '"Cormorant Garamond", Georgia, serif',
    bodyAlt: '"Inter", "Pretendard", sans-serif',
    
    // 브랜드별 특수 폰트
    futura: '"Futura", "Avenir", "Montserrat", sans-serif',
    centuryGothic: '"Century Gothic", "Futura", sans-serif',
    gothic: '"UnifrakturCook", "Old English Text MT", serif',
    condensed: '"Oswald", "Bebas Neue", sans-serif',
  },
  
  // 폰트 사이즈 (Desktop / Mobile)
  sizes: {
    // Marketing Headlines (Hero)
    heroXl: { desktop: '72px', mobile: '48px' },
    heroLg: { desktop: '56px', mobile: '40px' },
    heroMd: { desktop: '48px', mobile: '36px' },
    
    // Content Headlines
    h1: { desktop: '40px', mobile: '32px' },
    h2: { desktop: '32px', mobile: '28px' },
    h3: { desktop: '24px', mobile: '22px' },
    h4: { desktop: '20px', mobile: '18px' },
    
    // Body Text
    bodyLg: { desktop: '18px', mobile: '17px' },
    body: { desktop: '16px', mobile: '16px' },
    bodySm: { desktop: '14px', mobile: '14px' },
    
    // UI Elements
    nav: { desktop: '14px', mobile: '14px' },
    button: { desktop: '15px', mobile: '15px' },
    caption: { desktop: '13px', mobile: '13px' },
    badge: { desktop: '12px', mobile: '12px' },
    
    // Stats/Numbers
    statXl: { desktop: '80px', mobile: '56px' },
    statLg: { desktop: '56px', mobile: '40px' },
    statMd: { desktop: '40px', mobile: '32px' },
  },
  
  // Letter Spacing
  letterSpacing: {
    tightHero: '-0.03em',   // 큰 헤드라인
    tight: '-0.01em',       // 일반 헤드라인
    normal: '0',            // 본문
    wide: '0.05em',         // 버튼, 네비게이션
    wider: '0.1em',         // 럭셔리 네비게이션
    widest: '0.2em',        // 미니멀 디올 스타일
  },
  
  // Line Height
  lineHeight: {
    none: '1',
    tight: '1.15',
    snug: '1.3',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  // Font Weight
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const

// =============================================================================
// COLOR SYSTEM
// =============================================================================

/**
 * 프리미엄 컬러 팔레트
 * 60-30-10 Rule: 60% Primary, 30% Secondary, 10% Accent
 */
export const COLORS = {
  // Primary Neutrals (60%)
  neutral: {
    white: '#FFFFFF',
    offWhite: '#FFFCFC',      // 럭셔리 오프화이트
    cream: '#FAF9F7',         // 따뜻한 크림
    lightGray: '#F5F5F5',
    gray100: '#F2F2F2',
    gray200: '#E8E6E2',
    gray300: '#D9D9D9',
    gray400: '#BFBFBF',
    gray500: '#8C8C8C',
    gray600: '#666666',
    gray700: '#4A4A4A',
    gray800: '#2D2D2D',
    gray900: '#1A1A1A',
    nearBlack: '#111111',
    richBlack: '#0A0A0A',
    pureBlack: '#000000',
  },
  
  // Premium Accents (10%)
  accent: {
    // Golds
    goldRich: '#B88746',      // 연구 권장 골드
    goldChampagne: '#C4B454',
    goldDior: '#C9A962',
    goldLV: '#9B7E4B',
    goldTan: '#BDA476',
    
    // Navy/Blues
    navyDeep: '#192231',      // 신뢰, 권위
    navySteel: '#447793',
    navyIce: '#DDE8ED',
    
    // Warm Tones
    burgundy: '#5D3543',
    brownLV: '#453630',
    terracotta: '#A67564',
    camel: '#D9B18E',
    warmCream: '#EDDBCD',
    
    // Athletic
    orangeNike: '#FA5400',
    voltNike: '#CEFF00',
    
    // Metallic
    chromeSilver: '#C4C4C4',
    darkSilver: '#737474',
    sterling: '#E8E8E8',
  },
  
  // Semantic Colors
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Social Proof
  rating: {
    star: '#FFC107',
    starEmpty: '#E5E5E5',
  },
} as const

// =============================================================================
// SPACING SYSTEM (8-Point Grid)
// =============================================================================

/**
 * 8px 기반 스페이싱 시스템
 * 럭셔리 브랜드는 2-3배 넉넉한 여백 사용
 */
export const SPACING = {
  // Base Units
  px: '1px',
  0: '0',
  0.5: '4px',
  1: '8px',
  1.5: '12px',
  2: '16px',
  2.5: '20px',
  3: '24px',
  4: '32px',
  5: '40px',
  6: '48px',
  7: '56px',
  8: '64px',
  10: '80px',
  12: '96px',
  15: '120px',
  20: '160px',
  
  // Section Padding (Desktop)
  sectionSm: '64px',
  sectionMd: '80px',
  sectionLg: '96px',
  sectionXl: '120px',
  
  // Section Padding (Mobile)
  sectionSmMobile: '40px',
  sectionMdMobile: '48px',
  sectionLgMobile: '56px',
  sectionXlMobile: '64px',
  
  // Content
  contentGap: '32px',
  cardPadding: '24px',
  cardPaddingLg: '32px',
  
  // Touch Targets
  touchMin: '44px',
  touchOptimal: '48px',
} as const

// =============================================================================
// LAYOUT SYSTEM
// =============================================================================

export const LAYOUT = {
  // Container Widths
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    xxl: '1400px',
    content: '720px',    // 읽기 최적
    wide: '1440px',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    pill: '9999px',
  },
  
  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1050,
    tooltip: 1060,
  },
  
  // Aspect Ratios
  aspectRatio: {
    hero: '16 / 9',
    portrait: '3 / 4',
    square: '1 / 1',
    wide: '21 / 9',
  },
} as const

// =============================================================================
// EFFECTS
// =============================================================================

export const EFFECTS = {
  // Shadows (Subtle for luxury)
  shadow: {
    none: 'none',
    sm: '0 2px 4px rgba(0, 0, 0, 0.04)',
    md: '0 4px 8px rgba(0, 0, 0, 0.06)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.08)',
    xl: '0 16px 32px rgba(0, 0, 0, 0.10)',
    
    // Layered Luxury Shadow
    elevated: '0 1px 2px rgba(0,0,0,0.03), 0 4px 8px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.05)',
    
    // Card Shadow
    card: '0 4px 20px rgba(0, 0, 0, 0.06)',
    cardHover: '0 8px 32px rgba(0, 0, 0, 0.10)',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
    
    // Luxury Cubic Bezier
    luxury: '300ms cubic-bezier(0.16, 1, 0.3, 1)',
    athletic: '250ms cubic-bezier(0.77, 0, 0.175, 1)',
    smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Hover Effects
  hover: {
    scale: 'scale(1.02)',
    scaleSmall: 'scale(1.01)',
    lift: 'translateY(-4px)',
    opacity: '0.85',
  },
  
  // Gradients
  gradient: {
    fadeUp: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
    fadeDown: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
    gold: 'linear-gradient(135deg, #B88746 0%, #C4B454 50%, #B88746 100%)',
    chrome: 'linear-gradient(to bottom, #999 5%, #FFF 10%, #CCC 30%, #DDD 50%, #CCC 70%, #FFF 80%, #999 95%)',
    dark: 'linear-gradient(to bottom, #111 0%, #000 100%)',
  },
  
  // Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.7)',
    gradient: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)',
  },
} as const

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const COMPONENTS = {
  // Button Sizes
  button: {
    sm: {
      height: '36px',
      padding: '8px 16px',
      fontSize: '14px',
    },
    md: {
      height: '48px',
      padding: '12px 24px',
      fontSize: '15px',
    },
    lg: {
      height: '56px',
      padding: '16px 32px',
      fontSize: '16px',
    },
    xl: {
      height: '60px',
      padding: '18px 40px',
      fontSize: '16px',
    },
  },
  
  // Card Variants
  card: {
    padding: {
      sm: '16px',
      md: '24px',
      lg: '32px',
    },
    gap: {
      sm: '12px',
      md: '16px',
      lg: '24px',
    },
  },
  
  // Badge
  badge: {
    height: '24px',
    padding: '4px 10px',
    fontSize: '12px',
    borderRadius: '4px',
  },
  
  // Avatar
  avatar: {
    sm: '32px',
    md: '48px',
    lg: '64px',
    xl: '96px',
    xxl: '120px',
    profile: '160px',
  },
  
  // Input
  input: {
    height: '48px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
  },
} as const

// =============================================================================
// CONVERSION OPTIMIZATION
// =============================================================================

/**
 * 전환율 최적화를 위한 디자인 가이드라인
 */
export const CONVERSION = {
  // CTA 버튼 최적 사이즈
  cta: {
    minHeight: '48px',
    optimalHeight: '56px',
    minWidth: '200px',
    optimalWidth: '280px',
  },
  
  // 첫 화면(Above the Fold) 필수 요소
  aboveTheFold: {
    headline: '10 words max',
    subhead: '20 words max',
    ctaCount: 1, // 단일 CTA가 266% 더 효과적
  },
  
  // Trust Signal 배치
  trustSignals: {
    position: 'below-hero',
    elements: ['certification', 'rating', 'student-count', 'experience'],
  },
  
  // 폼 최적화
  form: {
    maxFields: 3, // 이름, 전화번호, 희망시간
    buttonCopy: 'first-person', // "나의 상담 예약하기"
  },
} as const

// =============================================================================
// MOBILE SPECIFIC
// =============================================================================

export const MOBILE = {
  // 최소 터치 타겟
  touchTarget: '48px',
  
  // 본문 폰트 (iOS auto-zoom 방지)
  minBodyFont: '16px',
  optimalBodyFont: '17px',
  
  // 버튼 간격
  buttonSpacing: '32px',
  
  // 한 줄 최대 글자 수
  maxLineLength: '40ch',
  
  // Sticky CTA
  stickyCtaHeight: '72px',
} as const

// =============================================================================
// EXPORTS
// =============================================================================

export const DESIGN_TOKENS = {
  typography: TYPOGRAPHY,
  colors: COLORS,
  spacing: SPACING,
  layout: LAYOUT,
  effects: EFFECTS,
  components: COMPONENTS,
  conversion: CONVERSION,
  mobile: MOBILE,
} as const

export default DESIGN_TOKENS
