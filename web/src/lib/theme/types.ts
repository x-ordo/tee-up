/**
 * Theme System Types
 * TEE:UP Portfolio SaaS - Theme Token System
 */

// ============================================
// Theme Token Types
// ============================================

export interface ThemeTokens {
  // Typography
  fontFamily: string;
  fontSizeBase: string;
  fontSizeH1: string;
  fontSizeH2: string;
  fontSizeH3: string;
  fontWeightHeading: string;
  fontWeightBody: string;

  // Colors
  colorBackground: string;
  colorSurface: string;
  colorBorder: string;
  colorTextPrimary: string;
  colorTextSecondary: string;
  colorTextMuted: string;
  accentColor: string;
  accentColorLight: string;
  accentColorDark: string;

  // Border Radius
  borderRadius: string;
  borderRadiusLarge: string;
  borderRadiusSmall: string;

  // Spacing
  spacingUnit: string;
  spacingSection: string;

  // Shadows
  shadowSmall: string;
  shadowMedium: string;
  shadowLarge: string;

  // Component Styles
  heroStyle: 'centered' | 'fullwidth' | 'minimal';
  cardStyle: 'elevated' | 'flat' | 'glassmorphism';
  buttonStyle: 'solid' | 'outlined' | 'soft';
}

// ============================================
// Preset Types
// ============================================

export type PresetSlug = 'classic' | 'editorial' | 'air';
export type ThemeVariant = 'light' | 'dark';

export interface ThemePreset {
  id: string;
  name: string;
  slug: PresetSlug;
  description: string;
  previewImageUrl?: string;
  tokens: ThemeTokens;
  variants: {
    light: Partial<ThemeTokens>;
    dark: Partial<ThemeTokens>;
  };
  isActive: boolean;
  displayOrder: number;
}

// ============================================
// Site Theme Types
// ============================================

export interface SiteTheme {
  id: string;
  siteId: string;
  presetId?: string;
  presetSlug: PresetSlug;
  variant: ThemeVariant;
  accentColor?: string; // #RRGGBB
  computedTokens: ThemeTokens;
}

// ============================================
// Onboarding Types
// ============================================

export type OnboardingQuestionId =
  | 'mood'
  | 'target'
  | 'style'
  | 'colorPreference'
  | 'contentFocus'
  | 'personality';

export interface OnboardingQuestion {
  id: OnboardingQuestionId;
  question: string;
  options: OnboardingOption[];
}

export interface OnboardingOption {
  id: string;
  label: string;
  emoji?: string;
  description?: string;
  weight: Record<PresetSlug, number>; // 각 프리셋에 대한 가중치
}

export interface OnboardingAnswers {
  mood?: string;
  target?: string;
  style?: string;
  colorPreference?: string;
  contentFocus?: string;
  personality?: string;
}

export interface OnboardingResult {
  answers: OnboardingAnswers;
  recommendedPresets: PresetSlug[];
  selectedPreset?: PresetSlug;
  completedAt?: string;
  durationSeconds?: number;
}

// ============================================
// Theme Context Types
// ============================================

export interface ThemeContextValue {
  theme: SiteTheme | null;
  preset: ThemePreset | null;
  isLoading: boolean;
  error: string | null;
  setTheme: (presetSlug: PresetSlug, variant?: ThemeVariant, accentColor?: string) => Promise<void>;
  applyTheme: (tokens: ThemeTokens) => void;
}
