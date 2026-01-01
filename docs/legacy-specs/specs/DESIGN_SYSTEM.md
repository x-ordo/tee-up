# TEE:UP Design System
## Korean Luxury Minimalism with "Calm Control" Philosophy

> **Design Mission:** Transform TEE:UP into a data-driven B2C platform that embodies "차분한 통제(Calm Control)" — where sophistication meets efficiency, and clarity emerges from complexity.

---

## 1. Design Philosophy

### Core Principle: Calm Control (차분한 통제)

TEE:UP serves two distinct user personas:

| User Type | Primary Need | Psychological State | Design Response |
|-----------|--------------|---------------------|-----------------|
| **Pro Golfers** (Expert Users) | Efficiency, Control, Insights | High cognitive load, time pressure, precision demands | **Minimalist Data Tables**, **Progressive Disclosure**, **Clear Hierarchy** |
| **VIP Golfers** (General Users) | Simplicity, Trust, Reassurance | Vulnerability, privacy concerns, need for guidance | **Whitespace**, **Soft Interactions**, **Transparent Feedback** |

**The Promise:** In the chaos of data and decisions, TEE:UP provides **visual calm and operational clarity**.

---

## 2. Visual Reference Integration

We synthesize three aesthetic sources with the following weight distribution:

### 50% — Korean Luxury (명품 감성)
- **Inspiration:** Amorepacific, Gentle Monster, Ader Error
- **Principles:**
  - Extensive whitespace (피로도 없는 여백)
  - Refined lines and minimal ornamentation
  - Neutral base tones with single accent color
  - Typography as primary design element
  - "Breathing room" for content hierarchy

### 30% — Shadcn/ui & Magic UI
- **Inspiration:** shadcn/ui, Radix UI, Vercel Design
- **Principles:**
  - Function-first component design
  - Clean data tables with zebra striping
  - High readability with system fonts
  - Accessible contrast ratios (WCAG AAA)
  - Border-based separation (not shadows)

### 20% — uiverse.io
- **Inspiration:** Modern CSS effects, micro-interactions
- **Principles:**
  - Subtle gradient accents (not overwhelming)
  - Glow effects on interactive elements
  - Smooth hover transitions (300ms)
  - Loading states with modern spinners
  - Glass morphism for modals/overlays

---

## 3. Color System

### Philosophy: "Monochrome + Single Accent"

We abandon the previous dark luxury theme entirely. The new palette prioritizes **cognitive ease** and **visual serenity**.

```css
/* ===== BASE NEUTRALS (Korean Luxury) ===== */
--calm-white: #FAFAF9;        /* Background — soft, not harsh */
--calm-cloud: #F4F4F2;        /* Secondary background */
--calm-stone: #E8E8E5;        /* Borders, dividers */
--calm-ash: #B8B8B3;          /* Muted text, placeholders */
--calm-charcoal: #52524E;     /* Body text */
--calm-obsidian: #1A1A17;     /* Headings, emphasis */

/* ===== ACCENT COLOR (Data Focus) ===== */
--calm-accent: #3B82F6;       /* Primary action — trust, clarity */
--calm-accent-light: #DBEAFE; /* Accent backgrounds */
--calm-accent-dark: #1E40AF;  /* Hover, active states */

/* ===== FUNCTIONAL COLORS ===== */
--calm-success: #10B981;      /* Completed, confirmed */
--calm-success-bg: #D1FAE5;
--calm-warning: #F59E0B;      /* Attention, limits */
--calm-warning-bg: #FEF3C7;
--calm-error: #EF4444;        /* Critical, error */
--calm-error-bg: #FEE2E2;
--calm-info: #8B5CF6;         /* Informational */
--calm-info-bg: #EDE9FE;

/* ===== GLASS & GLOW (uiverse.io influence) ===== */
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-border: rgba(0, 0, 0, 0.08);
--glow-accent: rgba(59, 130, 246, 0.15);
--glow-success: rgba(16, 185, 129, 0.12);
```

### Color Usage Rules

1. **90% Neutrals** — Backgrounds, text, borders use calm-* neutrals only
2. **8% Accent** — Buttons, links, active states use calm-accent
3. **2% Functional** — Status indicators, alerts use success/warning/error
4. **No Gradients** except for:
   - Primary CTA buttons (subtle gradient)
   - Loading states
   - Glass morphism overlays

---

## 4. Typography System

### Fonts

```typescript
// Primary: Pretendard (Korean excellence) + Inter (global standard)
fontFamily: {
  sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
  display: ['Pretendard', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'monospace'],
}
```

**Why Pretendard?**
- Superior Korean rendering (better than Noto Sans KR)
- Clean, modern aesthetic aligned with Korean luxury
- Excellent readability at all sizes
- Free and open source

### Type Scale

```css
/* Display (Headings) */
--text-display-lg: 3rem;      /* 48px — Hero titles */
--text-display-md: 2.25rem;   /* 36px — Section titles */
--text-display-sm: 1.875rem;  /* 30px — Card titles */

/* Body */
--text-body-lg: 1.125rem;     /* 18px — Large body */
--text-body-md: 1rem;         /* 16px — Default body */
--text-body-sm: 0.875rem;     /* 14px — Secondary text */
--text-body-xs: 0.75rem;      /* 12px — Captions, labels */

/* Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;        /* Headings */
--leading-normal: 1.5;        /* Body text */
--leading-relaxed: 1.75;      /* Long-form content */

/* Letter Spacing */
--tracking-tight: -0.02em;    /* Display text */
--tracking-normal: 0;         /* Body text */
--tracking-wide: 0.05em;      /* Uppercase labels */
```

### Typography Rules

1. **Headings:** Semibold (600), tight leading, obsidian color
2. **Body:** Regular (400), normal leading, charcoal color
3. **Labels:** Medium (500), wide tracking, uppercase, ash color
4. **Data:** Mono font for numbers, medium weight
5. **Links:** Accent color, medium weight, no underline (underline on hover)

---

## 5. Spacing System

### Spatial Rhythm (8px base)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Layout Rules

1. **Component Padding:** space-6 (24px) minimum
2. **Section Spacing:** space-16 to space-24 (64-96px)
3. **Card Gap:** space-6 (24px)
4. **Text Spacing:** space-4 between paragraphs
5. **Form Fields:** space-5 vertical rhythm

---

## 6. Component Design Specifications

### 6.1 Buttons

```typescript
// Primary CTA
className: "
  px-6 py-3
  rounded-xl
  bg-gradient-to-br from-[--calm-accent] to-[--calm-accent-dark]
  text-white font-semibold text-sm
  shadow-lg shadow-[--glow-accent]
  hover:shadow-xl hover:brightness-110
  transition-all duration-300
  focus:ring-4 focus:ring-[--calm-accent-light]
"

// Secondary Button
className: "
  px-6 py-3
  rounded-xl
  border-2 border-[--calm-stone]
  bg-white
  text-[--calm-charcoal] font-medium text-sm
  hover:border-[--calm-accent] hover:text-[--calm-accent]
  transition-all duration-300
"

// Ghost Button
className: "
  px-4 py-2
  text-[--calm-accent] font-medium text-sm
  hover:bg-[--calm-accent-light]
  rounded-lg
  transition-all duration-200
"
```

### 6.2 Data Tables (Shadcn/ui Inspired)

```typescript
// Table Container
className: "
  w-full
  border border-[--calm-stone]
  rounded-2xl
  overflow-hidden
  bg-white
"

// Table Header
className: "
  bg-[--calm-cloud]
  border-b border-[--calm-stone]
  text-[--calm-charcoal] text-xs uppercase tracking-wide font-medium
  px-6 py-4
"

// Table Row
className: "
  border-b border-[--calm-stone] last:border-0
  hover:bg-[--calm-cloud]
  transition-colors duration-150
"

// Zebra Striping (optional)
className: "even:bg-[--calm-white] odd:bg-white"

// Table Cell
className: "
  px-6 py-4
  text-[--calm-charcoal] text-sm font-regular
"
```

### 6.3 Cards (Pro Profiles)

```typescript
// Pro Card (Grid View)
className: "
  group
  bg-white
  border border-[--calm-stone]
  rounded-2xl
  overflow-hidden
  hover:border-[--calm-accent]
  hover:shadow-xl hover:shadow-[--glow-accent]
  transition-all duration-300
"

// Card Image Container
className: "
  w-full h-64
  overflow-hidden
  bg-[--calm-cloud]
"

// Card Content
className: "
  p-6 space-y-4
"

// Card Title
className: "
  text-xl font-semibold text-[--calm-obsidian]
  group-hover:text-[--calm-accent]
  transition-colors duration-200
"

// Tags
className: "
  inline-flex items-center
  px-3 py-1
  rounded-full
  bg-[--calm-accent-light]
  text-[--calm-accent-dark] text-xs font-medium
"
```

### 6.4 Forms & Inputs

```typescript
// Input Field
className: "
  w-full
  px-4 py-3
  border-2 border-[--calm-stone]
  rounded-xl
  bg-white
  text-[--calm-charcoal] text-sm
  placeholder:text-[--calm-ash]
  focus:border-[--calm-accent]
  focus:ring-4 focus:ring-[--calm-accent-light]
  transition-all duration-200
"

// Select Dropdown
className: "
  w-full
  px-4 py-3
  border-2 border-[--calm-stone]
  rounded-xl
  bg-white
  text-[--calm-charcoal] text-sm
  focus:border-[--calm-accent]
  focus:ring-4 focus:ring-[--calm-accent-light]
  cursor-pointer
"

// Label
className: "
  block mb-2
  text-[--calm-charcoal] text-sm font-medium uppercase tracking-wide
"
```

### 6.5 Modals (Glass Morphism)

```typescript
// Modal Overlay
className: "
  fixed inset-0 z-50
  bg-black/40
  backdrop-blur-sm
  flex items-center justify-center
"

// Modal Container
className: "
  bg-[--glass-bg]
  backdrop-blur-xl
  border border-[--glass-border]
  rounded-3xl
  shadow-2xl
  max-w-2xl w-full
  max-h-[90vh] overflow-y-auto
"

// Modal Header
className: "
  px-8 py-6
  border-b border-[--glass-border]
"

// Modal Title
className: "
  text-2xl font-semibold text-[--calm-obsidian]
"
```

### 6.6 Dashboard Metrics

```typescript
// Metric Card
className: "
  bg-white
  border border-[--calm-stone]
  rounded-2xl
  p-6
  hover:border-[--calm-accent]
  transition-all duration-200
"

// Metric Number
className: "
  text-4xl font-bold text-[--calm-obsidian]
  font-mono
"

// Metric Label
className: "
  text-sm uppercase tracking-wide text-[--calm-ash] font-medium
  mt-2
"

// Warning State (Subscription Alert)
className: "
  border-2 border-[--calm-warning]
  bg-[--calm-warning-bg]
"
```

### 6.7 Chat Interface

```typescript
// Chat Container
className: "
  bg-white
  border border-[--calm-stone]
  rounded-2xl
  overflow-hidden
"

// Message Bubble (Received)
className: "
  max-w-[70%]
  px-4 py-3
  rounded-2xl rounded-tl-sm
  bg-[--calm-cloud]
  text-[--calm-charcoal] text-sm
"

// Message Bubble (Sent)
className: "
  max-w-[70%]
  px-4 py-3
  rounded-2xl rounded-tr-sm
  bg-[--calm-accent]
  text-white text-sm
"

// Chat Input
className: "
  flex-1
  px-4 py-3
  border-2 border-[--calm-stone]
  rounded-full
  bg-white
  text-[--calm-charcoal]
  focus:border-[--calm-accent]
  focus:ring-4 focus:ring-[--calm-accent-light]
"
```

### 6.8 Loading States (uiverse.io Inspired)

```typescript
// Spinner Container
className: "
  inline-flex items-center justify-center
"

// Modern Spinner
<svg className="animate-spin h-8 w-8 text-[--calm-accent]" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
</svg>

// Skeleton Loading
className: "
  animate-pulse
  bg-[--calm-cloud]
  rounded-lg
"
```

---

## 7. Layout Patterns

### 7.1 Dashboard Layout

```
┌─────────────────────────────────────────────┐
│ Header (Sticky)                             │
├─────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Metric  │ │ Metric  │ │ Metric  │        │
│ │ Card    │ │ Card    │ │ Card    │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Data Table                              │ │
│ │ (Pro List / Lead History)               │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 7.2 Pro Profile Page

```
┌─────────────────────────────────────────────┐
│ Hero Image (Full Width)                     │
├─────────────────────────────────────────────┤
│ ┌───────────────┐  ┌──────────────────────┐ │
│ │ Pro Info      │  │ Booking Widget       │ │
│ │ - Name        │  │ - Date Selection     │ │
│ │ - Bio         │  │ - Time Slots         │ │
│ │ - Skills      │  │ - CTA Button         │ │
│ └───────────────┘  └──────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Career Timeline                         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Testimonials Grid                       │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 7.3 Pro Directory (Grid)

```
┌─────────────────────────────────────────────┐
│ Search & Filter Bar                         │
├─────────────────────────────────────────────┤
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│ │ Pro  │  │ Pro  │  │ Pro  │  │ Pro  │     │
│ │ Card │  │ Card │  │ Card │  │ Card │     │
│ └──────┘  └──────┘  └──────┘  └──────┘     │
│                                             │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│ │ Pro  │  │ Pro  │  │ Pro  │  │ Pro  │     │
│ │ Card │  │ Card │  │ Card │  │ Card │     │
│ └──────┘  └──────┘  └──────┘  └──────┘     │
└─────────────────────────────────────────────┘
```

---

## 8. Interaction Patterns

### 8.1 Hover States

```css
/* Cards */
hover:border-[--calm-accent]
hover:shadow-xl hover:shadow-[--glow-accent]

/* Buttons */
hover:brightness-110
hover:shadow-2xl

/* Links */
hover:text-[--calm-accent]

/* Inputs */
focus:border-[--calm-accent]
focus:ring-4 focus:ring-[--calm-accent-light]
```

### 8.2 Transitions

```css
/* Standard */
transition-all duration-300 ease-in-out

/* Fast */
transition-all duration-150 ease-in-out

/* Smooth */
transition-all duration-500 ease-in-out
```

### 8.3 Animations

```typescript
// Fade In
className: "animate-fadeIn"
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

// Slide Up
className: "animate-slideUp"
// @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

// Scale In
className: "animate-scaleIn"
// @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
```

---

## 9. Accessibility Guidelines

1. **Color Contrast:** Minimum WCAG AA (4.5:1 for text)
2. **Focus States:** Visible focus rings (4px, accent color)
3. **Keyboard Navigation:** All interactive elements accessible via Tab
4. **Screen Readers:** Semantic HTML, ARIA labels
5. **Touch Targets:** Minimum 44x44px for mobile

---

## 10. Responsive Breakpoints

```css
/* Mobile First */
--screen-sm: 640px;   /* Tablets */
--screen-md: 768px;   /* Small laptops */
--screen-lg: 1024px;  /* Desktops */
--screen-xl: 1280px;  /* Large desktops */
--screen-2xl: 1536px; /* Ultra-wide */
```

---

## 11. Implementation Checklist

### Phase 1: Foundation
- [x] Define color system
- [ ] Update global.css with new CSS variables
- [ ] Update tailwind.config.ts with new theme
- [ ] Install Pretendard font
- [ ] Create base component classes

### Phase 2: Core Components
- [ ] Button variants (Primary, Secondary, Ghost)
- [ ] Input fields (Text, Select, Textarea)
- [ ] Cards (Pro Card, Metric Card)
- [ ] Data Table
- [ ] Modal/Dialog
- [ ] Loading states

### Phase 3: Page Layouts
- [ ] Dashboard (Pro Analytics)
- [ ] Pro Directory (Grid + Search)
- [ ] Pro Profile (Detail Page)
- [ ] Booking Flow
- [ ] Chat Interface

### Phase 4: Polish
- [ ] Hover states and transitions
- [ ] Loading animations
- [ ] Error states
- [ ] Empty states
- [ ] Success confirmations

---

## 12. Design Principles Summary

1. **Whitespace First** — Let content breathe, reduce cognitive load
2. **Data Clarity** — Tables and metrics are king, make them scannable
3. **Subtle Interactions** — Micro-animations enhance, not distract
4. **Monochrome Base** — 90% neutrals, 10% accent and functional colors
5. **Trust Through Transparency** — Show system state, confirm actions
6. **Mobile Adaptive** — Not responsive, but thoughtfully adaptive
7. **Korean Aesthetic** — Refined, minimal, sophisticated without ostentation

---

**Next Steps:**
1. Implement new color system in `global.css`
2. Update Tailwind config with new theme
3. Refactor existing components to match new design system
4. Create UI/UX documentation for developers

---

*Last Updated: 2025-11-24*
*Design System Version: 2.0.0*
