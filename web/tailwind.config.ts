import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS Variable References (auto-switch in dark mode)
        'calm-white': 'var(--calm-white)',
        'calm-cloud': 'var(--calm-cloud)',
        'calm-stone': 'var(--calm-stone)',
        'calm-ash': 'var(--calm-ash)',
        'calm-charcoal': 'var(--calm-charcoal)',
        'calm-obsidian': 'var(--calm-obsidian)',
        'calm-accent': 'var(--calm-accent)',
        'calm-accent-light': 'var(--calm-accent-light)',
        'calm-accent-dark': 'var(--calm-accent-dark)',
        'calm-success': 'var(--calm-success)',
        'calm-success-bg': 'var(--calm-success-bg)',
        'calm-warning': 'var(--calm-warning)',
        'calm-warning-bg': 'var(--calm-warning-bg)',
        'calm-error': 'var(--calm-error)',
        'calm-error-bg': 'var(--calm-error-bg)',
        'calm-info': 'var(--calm-info)',
        'calm-info-bg': 'var(--calm-info-bg)',
        // Brand colors
        'brand-kakao': 'var(--brand-kakao)',
        'brand-kakao-text': 'var(--brand-kakao-text)',
        'brand-kakao-hover': 'var(--brand-kakao-hover)',
        // Neutrals (Korean Luxury) - static fallbacks
        calm: {
          white: '#FAFAF9',
          cloud: '#F4F4F2',
          stone: '#E8E8E5',
          ash: '#B8B8B3',
          charcoal: '#52524E',
          obsidian: '#1A1A17',
        },
        // Accent - static fallbacks
        accent: {
          DEFAULT: '#2563EB',  // WCAG AA compliant (4.7:1 on white)
          light: '#DBEAFE',
          dark: '#1E40AF',
        },
        // Functional - static fallbacks
        success: {
          DEFAULT: '#10B981',
          bg: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444',
          bg: '#FEE2E2',
        },
        info: {
          DEFAULT: '#8B5CF6',
          bg: '#EDE9FE',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Pretendard', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        'body-md': ['1rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
      borderRadius: {
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow-accent': '0 10px 30px rgba(59, 130, 246, 0.15)',
        'glow-success': '0 10px 30px rgba(16, 185, 129, 0.12)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
