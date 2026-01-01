# TEE:UP Design Tokens

This document outlines the core design tokens used across the TEE:UP platform, providing a single source of truth for visual styles. These tokens are implemented using Tailwind CSS custom configurations and CSS variables for flexibility and consistency.

---

## 1. Colors

Our color palette is built around a "Monochrome + Single Accent" philosophy, using a sophisticated neutral base with strategic pops of our primary accent color.

### Core Palette

| Token Name          | HEX       | Description                                      | Tailwind Class Example     |
|---------------------|-----------|--------------------------------------------------|----------------------------|
| `--tee-background`  | `#F7F4F0` | Neutral background for the overall application.  | `bg-tee-background`        |
| `--tee-surface`     | `#FFFFFF` | Used for UI surfaces, cards, and modal backgrounds.| `bg-tee-surface`           |
| `--tee-ink-strong`  | `#1A1A1A` | Primary text color, headings, and strong elements. | `text-tee-ink-strong`      |
| `--tee-ink-light`   | `#52524E` | Secondary text, subheadings, descriptive labels. | `text-tee-ink-light`       |
| `--tee-accent-primary`| `#0A362B` | Main brand accent, used for CTAs, active states. | `bg-tee-accent-primary`    |
| `--tee-accent-secondary`| `#B39A68` | Secondary accent, for highlights, badges, icons. | `text-tee-accent-secondary`|

### State Colors

These colors provide visual feedback for interactive elements and system statuses.

| Token Name              | HEX       | Description                                      | Tailwind Class Example       |
|-------------------------|-----------|--------------------------------------------------|------------------------------|
| `--tee-accent-primary-hover` | `#072A21` | Darker primary for hover states.               | `hover:bg-tee-accent-primary-hover`|
| `--tee-accent-primary-active`| `#051E18` | Even darker primary for active/pressed states. | `active:bg-tee-accent-primary-active`|
| `--tee-accent-primary-disabled`| `#B4C6BF` | Lighter, desaturated primary for disabled elements.| `disabled:bg-tee-accent-primary-disabled`|
| `--tee-error`           | `#D32F2F` | Used for error messages and destructive actions. | `text-tee-error`             |
| `--tee-success`         | `#388E3C` | Used for success messages and positive feedback. | `text-tee-success`           |
| `--tee-warning`         | `#FBC02D` | Used for warning messages and cautionary notes. | `text-tee-warning`           |
| `--tee-info`            | `#1976D2` | Used for informational messages.                 | `text-tee-info`              |

---

## 2. Typography

We use a combination of Korean (Pretendard) and English (Inter) fonts to ensure optimal readability and aesthetic appeal across all content. JetBrains Mono is reserved for technical content like code snippets.

### Font Families

| Token Name        | Font Stack                     | Description                            | CSS Variable             | Tailwind Class Example |
|-------------------|--------------------------------|----------------------------------------|--------------------------|------------------------|
| `Pretendard`      | `'Pretendard', sans-serif`     | Primary font for headings and display text, especially for Korean content. | `--font-pretendard`      | `font-pretendard`      |
| `Inter`           | `'Inter', sans-serif`          | Body text, captions, and general UI text, especially for English content. | `--font-inter`           | `font-inter`           |
| `JetBrains Mono`  | `'JetBrains Mono', monospace`  | Monospaced font for code, data, etc. (if needed). | `--font-jetbrains-mono`  | `font-jetbrains-mono`  |

### Font Sizes (Responsive, REM-based Scale)

Our font sizes are defined using a responsive, REM-based scale to maintain visual hierarchy and adaptability across devices, aligned with Apple HIG for readability.

| Token Name | REM Value | PX Value (Base 16px) | Line Height | Tailwind Class Example |
|------------|-----------|----------------------|-------------|------------------------|
| `h1`       | `3rem`    | `48px`               | `1.2`       | `text-h1`              |
| `h2`       | `2.25rem` | `36px`               | `1.25`      | `text-h2`              |
| `h3`       | `1.5rem`  | `24px`               | `1.33`      | `text-h3`              |
| `body`     | `1rem`    | `16px`               | `1.5`       | `text-body`            |
| `caption`  | `0.875rem`| `14px`               | `1.4`       | `text-caption`         |

---

## 3. Spacing

We utilize a 4px grid system for all spacing, translated into REM values for consistent and scalable layouts.

| Token Name  | REM Value   | PX Value (Base 16px) | Tailwind Class Example |
|-------------|-------------|----------------------|------------------------|
| `space-1`   | `0.25rem`   | `4px`                | `p-space-1`            |
| `space-2`   | `0.5rem`    | `8px`                | `m-space-2`            |
| `space-3`   | `0.75rem`   | `12px`               | `gap-space-3`          |
| `space-4`   | `1rem`      | `16px`               | `px-space-4`           |
| `space-5`   | `1.25rem`   | `20px`               | `py-space-5`           |
| `space-6`   | `1.5rem`    | `24px`               | `top-space-6`          |
| `space-7`   | `1.75rem`   | `28px`               | `left-space-7`         |
| `space-8`   | `2rem`      | `32px`               | `w-space-8`            |
| `space-10`  | `2.5rem`    | `40px`               | `h-space-10`           |
| `space-12`  | `3rem`      | `48px`               | `translate-x-space-12` |
| `space-16`  | `4rem`      | `64px`               | `text-space-16`        |
| `space-20`  | `5rem`      | `80px`               | `max-w-space-20`       |
| `space-24`  | `6rem`      | `96px`               | `min-h-space-24`       |
| `space-32`  | `8rem`      | `128px`              | `grid-cols-space-32`   |

---

## 4. Border Radius

Soft, rounded corners are applied to UI elements to enhance the sense of luxury and approachability, following HIG recommendations for shape and form.

| Token Name | Value      | Description                      | Tailwind Class Example |
|------------|------------|----------------------------------|------------------------|
| `rounded-none`| `0`        | No border radius.               | `rounded-none`         |
| `rounded-sm` | `0.25rem`  | Small rounded corners (4px).    | `rounded-sm`           |
| `rounded-md` | `0.5rem`   | Medium rounded corners (8px).   | `rounded-md`           |
| `rounded-lg` | `1rem`     | Large rounded corners (16px).   | `rounded-lg`           |
| `rounded-xl` | `1.25rem`  | Extra large rounded corners (20px).| `rounded-xl`           |
| `rounded-full`| `9999px`   | Fully rounded, pill-shaped.     | `rounded-full`         |

---

## 5. Shadows

Shadows are used sparingly and subtly to provide depth without distracting, maintaining a clean and minimalist aesthetic.

| Token Name | Value                                | Description                                | Tailwind Class Example |
|------------|--------------------------------------|--------------------------------------------|------------------------|
| `shadow-card`| `0px 2px 8px rgba(0, 0, 0, 0.05)`    | Subtle shadow for cards and elevated surfaces. | `shadow-card`          |
| `shadow-none`| `none`                               | No shadow.                                 | `shadow-none`          |