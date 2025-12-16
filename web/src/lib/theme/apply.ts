/**
 * Theme Application - CSS Variable Injection
 * TEE:UP Portfolio SaaS - SSR-first, FOUC-minimized
 */

import type { ThemeTokens } from './types';

// ============================================
// CSS Variable Mapping
// ============================================

/**
 * 토큰 키를 CSS 변수 이름으로 변환
 * camelCase → kebab-case with --tee- prefix
 */
function tokenKeyToCssVar(key: string): string {
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `--tee-${kebab}`;
}

/**
 * 토큰 객체를 CSS 변수 문자열로 변환
 */
export function tokensToCssString(tokens: ThemeTokens): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string') {
      lines.push(`${tokenKeyToCssVar(key)}: ${value};`);
    }
  }

  return lines.join('\n');
}

/**
 * 토큰 객체를 CSS 변수 객체로 변환 (React style prop용)
 */
export function tokensToCssVars(
  tokens: ThemeTokens
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string') {
      vars[tokenKeyToCssVar(key)] = value;
    }
  }

  return vars;
}

// ============================================
// SSR Theme Injection
// ============================================

/**
 * SSR용 <style> 태그 내용 생성
 * layout.tsx의 <head>에 삽입하여 FOUC 방지
 */
export function generateThemeStyleTag(tokens: ThemeTokens): string {
  const cssVars = tokensToCssString(tokens);

  return `
    :root {
      ${cssVars}
    }

    /* Dark mode variant */
    [data-theme="dark"] {
      /* Dark mode overrides are applied via computed_tokens */
    }
  `.trim();
}

/**
 * SSR용 인라인 스타일 객체 생성
 * body 또는 wrapper element에 직접 적용
 */
export function generateInlineStyles(
  tokens: ThemeTokens
): React.CSSProperties {
  const cssVars = tokensToCssVars(tokens);
  return cssVars as unknown as React.CSSProperties;
}

// ============================================
// Client-side Theme Application
// ============================================

/**
 * 클라이언트에서 동적으로 CSS 변수 적용
 * 새로고침 없이 테마 변경 시 사용
 */
export function applyThemeToDocument(tokens: ThemeTokens): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string') {
      root.style.setProperty(tokenKeyToCssVar(key), value);
    }
  }
}

/**
 * 특정 요소에 테마 적용
 * 프리뷰 컴포넌트 등에서 사용
 */
export function applyThemeToElement(
  element: HTMLElement,
  tokens: ThemeTokens
): void {
  for (const [key, value] of Object.entries(tokens)) {
    if (typeof value === 'string') {
      element.style.setProperty(tokenKeyToCssVar(key), value);
    }
  }
}

/**
 * 테마 변수 초기화 (기본값으로 복구)
 */
export function clearThemeFromDocument(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const style = root.style;

  // --tee-로 시작하는 모든 변수 제거
  for (let i = style.length - 1; i >= 0; i--) {
    const prop = style[i];
    if (prop.startsWith('--tee-')) {
      style.removeProperty(prop);
    }
  }
}

// ============================================
// Cookie-based Theme Persistence
// ============================================

const THEME_COOKIE_NAME = 'tee-theme';
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1년

/**
 * 테마를 쿠키에 저장 (SSR용)
 */
export function saveThemeToCookie(
  presetSlug: string,
  variant: string
): void {
  if (typeof document === 'undefined') return;

  const value = JSON.stringify({ presetSlug, variant });
  document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * 쿠키에서 테마 로드
 */
export function loadThemeFromCookie(): {
  presetSlug: string;
  variant: string;
} | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`)
  );

  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

/**
 * 서버에서 쿠키 파싱 (Next.js cookies() 결과에서)
 */
export function parseThemeCookie(
  cookieValue: string | undefined
): { presetSlug: string; variant: string } | null {
  if (!cookieValue) return null;

  try {
    return JSON.parse(decodeURIComponent(cookieValue));
  } catch {
    return null;
  }
}

// ============================================
// Default Theme Tokens
// ============================================

export const DEFAULT_TOKENS: ThemeTokens = {
  fontFamily: 'Pretendard, Inter, sans-serif',
  fontSizeBase: '16px',
  fontSizeH1: '2.5rem',
  fontSizeH2: '2rem',
  fontSizeH3: '1.5rem',
  fontWeightHeading: '600',
  fontWeightBody: '400',

  colorBackground: '#FAFAF9',
  colorSurface: '#FFFFFF',
  colorBorder: '#E8E8E5',
  colorTextPrimary: '#1A1A17',
  colorTextSecondary: '#52524E',
  colorTextMuted: '#8A8A87',
  accentColor: '#3B82F6',
  accentColorLight: '#DBEAFE',
  accentColorDark: '#1E40AF',

  borderRadius: '8px',
  borderRadiusLarge: '12px',
  borderRadiusSmall: '4px',

  spacingUnit: '8px',
  spacingSection: '64px',

  shadowSmall: '0 1px 2px rgba(0,0,0,0.05)',
  shadowMedium: '0 4px 6px -1px rgba(0,0,0,0.1)',
  shadowLarge: '0 10px 15px -3px rgba(0,0,0,0.1)',

  heroStyle: 'centered',
  cardStyle: 'elevated',
  buttonStyle: 'solid',
};
