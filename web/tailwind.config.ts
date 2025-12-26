import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
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
        'tee-stone': '#E8E8E5',      // Border / Divider
        'tee-ink-strong': '#1A1A1A', // Primary Text / Headings
        'tee-ink-light': '#52524E',  // Secondary Text / Subheadings
        'tee-ink-muted': '#8A8A87',  // Tertiary Text / Placeholder
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

        // Brand Colors (Social Media)
        'tee-kakao': '#FEE500',      // KakaoTalk
        'tee-kakao-text': '#3C1E1E', // KakaoTalk text
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
        // Shadow Scale (Elevation System)
        // Based on Material Design elevation with softer, warmer tones
        'none': 'none',
        'xs': '0 1px 2px rgba(26, 26, 26, 0.04)',           // Subtle, buttons
        'sm': '0 2px 4px rgba(26, 26, 26, 0.06)',           // Cards, inputs
        'md': '0 4px 8px rgba(26, 26, 26, 0.08)',           // Dropdowns, popovers
        'lg': '0 8px 16px rgba(26, 26, 26, 0.10)',          // Modals, dialogs
        'xl': '0 12px 24px rgba(26, 26, 26, 0.12)',         // Floating elements
        '2xl': '0 16px 32px rgba(26, 26, 26, 0.14)',        // Hero overlays
        // Semantic shadows
        'card': '0 2px 8px rgba(26, 26, 26, 0.05)',         // Default card shadow
        'card-hover': '0 4px 12px rgba(26, 26, 26, 0.08)', // Card hover state
        'dropdown': '0 4px 12px rgba(26, 26, 26, 0.10)',   // Dropdown menus
        'modal': '0 8px 24px rgba(26, 26, 26, 0.12)',      // Modal dialogs
        'toast': '0 4px 16px rgba(26, 26, 26, 0.15)',      // Toast notifications
        // Inner shadow for inputs
        'inner': 'inset 0 1px 2px rgba(26, 26, 26, 0.06)',
      },
      // Z-Index Scale (Layer System)
      // Organized by semantic layer names for consistency
      zIndex: {
        'base': '0',           // Default layer
        'above': '10',         // Above base content
        'dropdown': '50',      // Dropdown menus, select options
        'sticky': '100',       // Sticky headers, navigation
        'overlay': '200',      // Background overlays
        'modal': '300',        // Modal dialogs
        'popover': '400',      // Popovers, tooltips
        'toast': '500',        // Toast notifications (always on top)
        'max': '9999',         // Emergency override (use sparingly)
      },
      // Transition Duration Tokens
      transitionDuration: {
        'instant': '0ms',      // No transition
        'fast': '100ms',       // Micro-interactions (hover, focus)
        'normal': '200ms',     // Standard transitions
        'slow': '300ms',       // Emphasis animations
        'slower': '500ms',     // Complex animations
      },
      // Transition Timing Functions
      transitionTimingFunction: {
        'ease-out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',    // Smooth deceleration
        'ease-in-out-soft': 'cubic-bezier(0.45, 0, 0.55, 1)', // Gentle in-out
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',   // Playful bounce
      },
      keyframes: {
        // Accordion animations (Radix UI)
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Fade animations
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        // Slide animations
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        // Scale animations
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        // Spin animation
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        // Pulse animation (softer than default)
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        // Marquee animations
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        // Shake animation (for errors)
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        // Accordion
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up': 'accordion-up 200ms ease-out',
        // Fade
        'fade-in': 'fade-in 200ms ease-out forwards',
        'fade-in-slow': 'fade-in 500ms ease-out forwards',
        'fade-out': 'fade-out 200ms ease-out forwards',
        // Slide
        'slide-in-top': 'slide-in-from-top 300ms ease-out',
        'slide-in-bottom': 'slide-in-from-bottom 300ms ease-out',
        'slide-in-left': 'slide-in-from-left 300ms ease-out',
        'slide-in-right': 'slide-in-from-right 300ms ease-out',
        // Scale
        'scale-in': 'scale-in 200ms ease-out',
        'scale-out': 'scale-out 200ms ease-out',
        // Continuous
        'spin-slow': 'spin-slow 2s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        // Marquee
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        // Error feedback
        'shake': 'shake 400ms ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;