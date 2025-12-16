import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Core Palette
        'tee-background': '#F7F4F0', // Neutral Background
        'tee-surface': '#FFFFFF',    // UI Surface / Card Background
        'tee-ink-strong': '#1A1A1A', // Primary Text / Headings
        'tee-ink-light': '#52524E',  // Secondary Text / Subheadings
        'tee-accent-primary': '#0A362B', // Primary Brand Accent (e.g., CTA, active states)
        'tee-accent-secondary': '#B39A68', // Secondary Accent (e.g., Highlights, badges)

        // State Colors (Derived from primary/secondary or standard)
        'tee-accent-primary-hover': '#072A21', // Darker primary for hover
        'tee-accent-primary-active': '#051E18', // Even darker for active
        'tee-accent-primary-disabled': '#B4C6BF', // Lighter, desaturated for disabled
        'tee-error': '#D32F2F',      // Error messages/states
        'tee-success': '#388E3C',    // Success messages/states
        'tee-warning': '#FBC02D',    // Warning messages/states
        'tee-info': '#1976D2',       // Informational messages/states

        // Semantic UI Colors (if needed, map to core palette)
        // 'ui-border': 'tee-ink-light/20',
        // 'ui-focus-ring': 'tee-accent-primary/50',
      },
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
        inter: ['var(--font-inter)'],
        // For code snippets or monospaced elements if needed
        // 'jetbrains-mono': ['var(--font-jetbrains-mono)'],
      },
      fontSize: {
        h1: ['3rem', { lineHeight: '1.2' }],      // ~48px
        h2: ['2.25rem', { lineHeight: '1.25' }],  // ~36px
        h3: ['1.5rem', { lineHeight: '1.33' }],   // ~24px
        body: ['1rem', { lineHeight: '1.5' }],    // ~16px
        caption: ['0.875rem', { lineHeight: '1.4' }], // ~14px
      },
      spacing: {
        'space-1': '0.25rem', // 4px
        'space-2': '0.5rem',  // 8px
        'space-3': '0.75rem', // 12px
        'space-4': '1rem',    // 16px
        'space-5': '1.25rem', // 20px
        'space-6': '1.5rem',  // 24px
        'space-7': '1.75rem', // 28px
        'space-8': '2rem',    // 32px
        'space-10': '2.5rem', // 40px
        'space-12': '3rem',   // 48px
        'space-16': '4rem',   // 64px
        'space-20': '5rem',   // 80px
        'space-24': '6rem',   // 96px
        'space-32': '8rem',   // 128px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        'md': '0.5rem',     // 8px
        'lg': '1rem',       // 16px
        'xl': '1.25rem',    // 20px
        'full': '9999px',
      },
      boxShadow: {
        'card': '0px 2px 8px rgba(0, 0, 0, 0.05)', // Subtle shadow for cards
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;