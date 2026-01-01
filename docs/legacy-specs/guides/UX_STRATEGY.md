# TEE:UP UI/UX Strategy Document
## Data-Driven B2C Platform with "Calm Control" Philosophy

**Project:** TEE:UP — Premium Golf Lesson Matching Platform
**Design Mission:** Transform complexity into clarity through Korean Luxury Minimalism
**Target Launch:** Phase 2 (Beta with Dashboard + Analytics)

---

## Executive Summary

TEE:UP transitions from a showcase platform to a **data-driven ecosystem** where:
- **Pro Golfers** (Expert Users) manage leads, analyze performance, and control subscriptions
- **VIP Golfers** (General Users) book lessons with confidence and transparency
- Both user types experience **"Calm Control"** — a UX philosophy that reduces cognitive load while maintaining complete transparency

**Key Insight:** Golf lesson booking is a **high-stakes decision** (expensive, time-sensitive, trust-dependent). Our design must convey **professionalism, clarity, and reassurance** through visual calm and functional precision.

---

## 1. User Personas & Psychological Profiles

### 1.1 Primary User: Pro Golfers (Expert Users)

**Demographics:**
- Age: 28-45
- Role: KPGA/LPGA certified professionals, independent instructors
- Tech Savvy: Medium-High (comfortable with digital tools)

**Goals:**
- Maximize lesson bookings without manual outreach
- Track performance metrics (views, leads, conversions)
- Manage subscription costs efficiently
- Build personal brand through platform

**Pain Points:**
- **Cognitive Overload:** Managing multiple clients, schedules, and payment methods
- **Time Pressure:** Limited time between lessons to handle admin tasks
- **Accuracy Demands:** Cannot afford to miss inquiries or double-book

**Psychological State:**
- High-performing, goal-oriented
- Need for **control and transparency**
- Low tolerance for ambiguity or system failures

**Design Response:**
```
✓ Dashboard with clear metrics (views, leads, matched lessons)
✓ Data tables with filtering and sorting
✓ Subscription alerts with clear upgrade paths
✓ Progressive disclosure (show details only when needed)
✓ Fast load times and instant feedback
```

---

### 1.2 Secondary User: VIP Golfers (General Users)

**Demographics:**
- Age: 30-55
- Occupation: C-Suite executives, entrepreneurs, high-net-worth individuals
- Location: Gangnam, Seoul elite districts
- Golf Experience: Beginner to intermediate (looking to improve)

**Goals:**
- Find a **trustworthy, skilled** pro quickly
- Book lessons without hassle or confusion
- Feel reassured that their information is secure
- Receive clear confirmation and next steps

**Pain Points:**
- **Vulnerability:** Sharing contact info with strangers online
- **Decision Paralysis:** Too many options, unclear differentiation
- **Trust Deficit:** Fear of scams or low-quality service

**Psychological State:**
- Busy, limited time for research
- High expectations for service quality
- Need for **reassurance and simplicity**

**Design Response:**
```
✓ Large, reassuring call-to-action buttons
✓ Clear pro verification badges (KPGA, LPGA)
✓ Transparent pricing and booking process
✓ Instant confirmation with clear next steps
✓ Minimal form fields (reduce friction)
```

---

## 2. Core UX Principles

### 2.1 Calm Control (차분한 통제)

**Definition:** A design philosophy that provides **complete transparency** while maintaining **visual serenity**.

**Application:**
1. **Whitespace First:** Every component has breathing room (minimum 24px padding)
2. **Data Clarity:** Metrics are scannable at a glance (large numbers, clear labels)
3. **Subtle Feedback:** System state is always visible (loading, success, error)
4. **Progressive Disclosure:** Advanced features are hidden until needed
5. **No Surprises:** Confirm destructive actions, show costs upfront

**Visual Language:**
- 90% neutral tones (calm-white, calm-cloud, calm-stone)
- 8% accent blue (trust, professionalism)
- 2% functional colors (success, warning, error)
- Minimal use of shadows (border-based separation instead)
- Rounded corners (16-24px) for approachability

---

### 2.2 Function-First Design (Shadcn/ui Influence)

**Principles:**
- **Clarity over Decoration:** No visual elements without purpose
- **Readable Data Tables:** Large font sizes (14-16px), generous padding
- **Accessible Contrast:** WCAG AA minimum (4.5:1 for text)
- **Keyboard Navigation:** All interactions accessible via Tab
- **Screen Reader Support:** Semantic HTML, ARIA labels

**Implementation:**
```typescript
// Data Table Example
<table className="table-container">
  <thead>
    <tr className="table-header">
      <th>Pro Name</th>
      <th>Location</th>
      <th>Leads (This Month)</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row hover:bg-calm-cloud">
      <td className="table-cell">Hannah Park</td>
      <td className="table-cell">Seoul</td>
      <td className="table-cell font-mono">5</td>
      <td className="table-cell">
        <span className="tag-warning">Approaching Limit</span>
      </td>
    </tr>
  </tbody>
</table>
```

---

### 2.3 Subtle Dynamism (uiverse.io Influence)

**Philosophy:** Modern micro-interactions enhance, not distract.

**Where to Apply:**
- **Button Hovers:** Subtle brightness increase (110%), shadow expansion
- **Card Hovers:** Border color change (stone → accent), glow effect
- **Loading States:** Modern spinners with smooth rotation
- **Success Confirmations:** Gentle scale-in animation (0.95 → 1.0)

**Where NOT to Apply:**
- Data tables (stability over flair)
- Modal backgrounds (keep calm)
- Text content (readability first)

**Example:**
```css
/* Primary CTA Button */
.btn-primary {
  background: linear-gradient(to bottom right, var(--calm-accent), var(--calm-accent-dark));
  box-shadow: 0 10px 20px var(--glow-accent);
  transition: all 300ms ease-in-out;
}

.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 15px 30px var(--glow-accent);
}
```

---

## 3. Information Architecture

### 3.1 Site Map (Phase 2)

```
TEE:UP
├── Landing Page
│   ├── Hero Section
│   ├── Featured Pros (Top 3)
│   ├── How It Works
│   └── CTA: Browse Pros
│
├── Pro Directory
│   ├── Search & Filter Bar
│   │   ├── Name/Location Search
│   │   ├── Specialty Filter
│   │   └── Price Range Filter
│   ├── Pro Cards Grid (3 columns)
│   └── Pagination
│
├── Pro Profile (Detail Page)
│   ├── Hero Image
│   ├── Pro Info Sidebar
│   │   ├── Name, Title, Location
│   │   ├── Verification Badge
│   │   ├── Pricing Tiers
│   │   └── Book Now CTA
│   ├── Career Timeline
│   ├── Skills Breakdown
│   ├── Video (if available)
│   ├── Testimonials
│   └── Booking Modal (triggered by CTA)
│
├── Pro Dashboard (Authenticated — Pro Users Only)
│   ├── Overview
│   │   ├── Profile Views (This Month)
│   │   ├── Leads Count (Warning if approaching limit)
│   │   ├── Matched Lessons
│   │   └── Average Rating
│   ├── Lead Management
│   │   ├── Active Chats Table
│   │   ├── Pending Inquiries
│   │   └── Matched Lessons History
│   ├── Analytics
│   │   ├── View Trends (Chart)
│   │   ├── Lead Conversion Rate
│   │   └── Revenue Insights (future)
│   ├── Subscription
│   │   ├── Current Plan (Basic / Pro)
│   │   ├── Usage This Month
│   │   └── Upgrade/Manage CTA
│   └── Profile Settings
│       ├── Edit Bio, Images, Videos
│       ├── Pricing Configuration
│       └── Notification Preferences
│
├── Golfer Dashboard (Authenticated — Golfer Users Only)
│   ├── My Bookings
│   │   ├── Upcoming Lessons
│   │   ├── Past Lessons
│   │   └── Pending Inquiries
│   ├── Saved Pros
│   └── Account Settings
│
└── Chat Interface (Shared)
    ├── Conversation List
    ├── Active Chat Window
    │   ├── Message History
    │   ├── Input Field
    │   └── Send Button
    └── Match Confirmation (Pro-Initiated)
```

---

### 3.2 User Flows

#### Flow 1: Golfer Books a Lesson

```
1. Land on Homepage
   ↓
2. Browse Featured Pros OR Click "Browse All Pros"
   ↓
3. Filter by Specialty/Location (Optional)
   ↓
4. Click Pro Card → Pro Profile Page
   ↓
5. Review Profile (Bio, Skills, Pricing, Videos)
   ↓
6. Click "Book Now" CTA → Booking Modal
   ↓
7. Select Service Type (Trial / 3-Month / Field Lesson)
   ↓
8. Choose Date & Time (Calendar Widget)
   ↓
9. Enter Contact Info (Name, Phone, Notes)
   ↓
10. Submit Inquiry → Success Confirmation
    ↓
11. Chat Room Created → Pro Notified
    ↓
12. Pro Responds in Chat → Negotiation
    ↓
13. Pro Clicks "Confirm Match" → Golfer Accepts
    ↓
14. Lesson Confirmed → Both Receive SMS/Email Confirmation
```

#### Flow 2: Pro Manages Leads

```
1. Login to Pro Dashboard
   ↓
2. See Metrics Card: "5 Leads This Month" (Warning: Approaching Limit)
   ↓
3. Click "View Active Chats" → Lead Management Table
   ↓
4. Click Chat Row → Chat Interface Opens
   ↓
5. Review Golfer's Inquiry → Respond with Availability
   ↓
6. Negotiate Details (Price, Location, Time)
   ↓
7. Click "Confirm Match" → Golfer Notified
   ↓
8. Golfer Accepts → Lead Converted to "Matched Lesson"
   ↓
9. Metrics Update: "Matched Lessons: +1", "Leads: 5 → 6"
   ↓
10. If Leads > 3 → Subscription Alert Appears
    ↓
11. Click "Upgrade to Pro" → Payment Flow (Toss Payments)
    ↓
12. Subscription Active → Continue Receiving Leads
```

---

## 4. Component-Level UX Specifications

### 4.1 Dashboard Metrics (Pro Dashboard)

**Purpose:** At-a-glance performance summary for time-strapped pros.

**Design:**
- 4 metric cards in a 2x2 grid (mobile: 1 column)
- Large numbers (30px+) with font-mono for clarity
- Icons for visual scanning (👁️ Views, 💬 Leads, ✅ Matched)
- Warning state for "Leads Approaching Limit" (yellow border, background)

**Interaction:**
- Hover: Border color changes to accent blue
- Click: Expands to detailed breakdown (future feature)

**Example:**
```
┌────────────────┐  ┌────────────────┐
│ 👁️  247        │  │ 💬  5          │
│ Profile Views  │  │ This Month's   │
│                │  │ Leads ⚠️       │
└────────────────┘  └────────────────┘
┌────────────────┐  ┌────────────────┐
│ ✅  3          │  │ ⭐  4.8        │
│ Matched        │  │ Average        │
│ Lessons        │  │ Rating         │
└────────────────┘  └────────────────┘
```

---

### 4.2 Data Table (Lead Management)

**Purpose:** Efficient scanning and action on golfer inquiries.

**Features:**
- Zebra striping (optional, for long lists)
- Sortable columns (Name, Date, Status)
- Row hover highlights entire row
- Action buttons (View Chat, Confirm Match)

**Columns:**
1. Golfer Name
2. Inquiry Date
3. Service Type (Trial / 3-Month / Field)
4. Status (New / In Discussion / Confirmed)
5. Actions (Button)

**Interaction:**
- Click Row → Opens Chat Interface
- Click "Confirm Match" → Confirmation Modal
- Hover → Row background changes to calm-cloud

**Example:**
```
┌─────────────────────────────────────────────────────────────┐
│ Golfer Name   │ Inquiry Date │ Service    │ Status  │ Action│
├─────────────────────────────────────────────────────────────┤
│ James Lee     │ 2025-11-20   │ Trial      │ New     │ [Chat]│
│ Sarah Kim     │ 2025-11-19   │ 3-Month    │ Discuss │ [Chat]│
│ Michael Park  │ 2025-11-18   │ Field      │Confirmed│ [View]│
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Booking Modal (Golfer-Facing)

**Purpose:** Streamline lesson inquiry with minimal friction.

**Design:**
- Glass morphism background (backdrop-blur-xl)
- 3-step wizard:
  1. Select Service Type (Cards)
  2. Choose Date & Time (Calendar Widget)
  3. Enter Contact Info (Form)
- Progress indicator (Step 1 of 3)
- Clear CTA: "Send Inquiry" (accent blue, large)

**Validation:**
- Real-time field validation (red border for errors)
- Disable "Next" button until required fields filled
- Show estimated response time ("Pros typically respond within 24 hours")

**Success State:**
- Confetti animation (subtle)
- Success message: "Inquiry Sent! Check your email for confirmation."
- CTA: "View My Bookings" OR "Browse More Pros"

---

### 4.4 Chat Interface (Shared)

**Purpose:** Facilitate negotiation between pro and golfer.

**Design:**
- Left Sidebar: Conversation List (Avatar, Name, Last Message)
- Main Panel: Active Chat
  - Header: Pro/Golfer Name, Status (Online / Offline)
  - Messages: Left-aligned (received), Right-aligned (sent)
  - Input: Rounded text field with send button
- Right Sidebar: Quick Info (Pro's Pricing, Golfer's Inquiry Details)

**Features:**
- Real-time updates (Supabase Realtime)
- Read receipts (checkmark icons)
- "Pro is typing..." indicator
- "Confirm Match" button (Pro-only, appears after 3+ messages)

**Interaction:**
- Click Conversation → Loads Chat
- Send Message → Instant append to chat (optimistic UI)
- Click "Confirm Match" → Confirmation Modal → Golfer Notified

---

### 4.5 Subscription Alert (Pro Dashboard)

**Purpose:** Encourage subscription upgrade when free limit exceeded.

**Design:**
- Prominent banner at top of dashboard
- Warning icon (⚠️)
- Clear message: "You've exceeded your free monthly lead limit (3 leads). Upgrade to Pro membership to continue receiving new inquiries."
- CTA: "Upgrade to Pro ($49/month)" (gradient button)
- Dismiss option (X icon, top-right)

**Trigger:**
- Appears when `monthly_chat_count > 3`
- Persists until subscription activated

**Interaction:**
- Click CTA → Payment Modal (Toss Payments integration)
- Click Dismiss → Hides for 24 hours (cookie-based)

---

## 5. Visual Design Specifications

### 5.1 Color Usage Guidelines

**Background Hierarchy:**
```
Level 1: calm-white (#FAFAF9)    — Page background
Level 2: white (#FFFFFF)          — Card backgrounds
Level 3: calm-cloud (#F4F4F2)     — Table headers, hover states
```

**Text Hierarchy:**
```
Headings: calm-obsidian (#1A1A17) — High contrast
Body:     calm-charcoal (#52524E) — Readable, not harsh
Muted:    calm-ash (#B8B8B3)      — Labels, captions
```

**Interactive Elements:**
```
Primary CTA:   Gradient (accent → accent-dark) + glow
Secondary CTA: calm-stone border, white background
Links:         calm-accent (#3B82F6)
Hover:         calm-accent-dark (#1E40AF)
```

**Functional States:**
```
Success:  calm-success (#10B981) + calm-success-bg
Warning:  calm-warning (#F59E0B) + calm-warning-bg
Error:    calm-error (#EF4444) + calm-error-bg
Info:     calm-info (#8B5CF6) + calm-info-bg
```

---

### 5.2 Typography Hierarchy

```
H1 (Hero Titles):      48px / 3rem, Semibold, Obsidian
H2 (Section Titles):   36px / 2.25rem, Semibold, Obsidian
H3 (Card Titles):      30px / 1.875rem, Semibold, Obsidian
Body Large:            18px / 1.125rem, Regular, Charcoal
Body Default:          16px / 1rem, Regular, Charcoal
Body Small:            14px / 0.875rem, Regular, Charcoal
Captions/Labels:       12px / 0.75rem, Medium, Ash, UPPERCASE
Data (Numbers):        Font-Mono, Bold
```

**Line Heights:**
- Headings: 1.25 (tight)
- Body: 1.5 (normal)
- Long-form: 1.75 (relaxed)

**Letter Spacing:**
- Headings: -0.02em (tight)
- Labels: +0.05em (wide, for uppercase)

---

### 5.3 Spacing Rules

**Component Padding:**
- Cards: 24px (6 units)
- Modals: 32px (8 units)
- Buttons: 12px vertical, 24px horizontal

**Section Spacing:**
- Between sections: 64-96px (16-24 units)
- Between cards: 24px (6 units)
- Between paragraphs: 16px (4 units)

**Responsive Adjustments:**
- Mobile: Reduce padding by 25% (e.g., 24px → 18px)
- Tablet: Keep 100%
- Desktop: Increase section spacing by 20%

---

## 6. Accessibility Standards

### 6.1 WCAG AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1 (AA)
- Large Text (18px+): Minimum 3:1
- UI Components: Minimum 3:1

**Keyboard Navigation:**
- All interactive elements accessible via Tab
- Focus states clearly visible (4px ring, accent color)
- Skip to main content link (hidden until focused)

**Screen Readers:**
- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- ARIA labels for icon-only buttons
- Alt text for all images
- Live regions for dynamic content (chat messages, alerts)

### 6.2 Inclusive Design

**Font Size:**
- Minimum 14px for body text (16px preferred)
- Allow user zoom up to 200%

**Touch Targets:**
- Minimum 44x44px for mobile
- 8px spacing between adjacent targets

**Error Handling:**
- Clear error messages (not "Invalid input", but "Email must include @")
- Inline validation (before form submission)
- Error summary at top of form

---

## 7. Performance Guidelines

### 7.1 Load Time Targets

- **First Contentful Paint:** < 1.2s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s

**Strategies:**
- Lazy load images below fold
- Code splitting for routes
- Server-side rendering (Next.js)
- CDN for static assets

### 7.2 Perceived Performance

**Skeleton Loading:**
- Show placeholders while data loads
- Maintain layout stability (no jank)

**Optimistic UI:**
- Instant feedback for user actions (e.g., message send)
- Rollback if server request fails

**Progress Indicators:**
- Spinners for < 2s waits
- Progress bars for > 2s operations (e.g., file upload)

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [x] Design system documentation
- [x] Update global.css with new tokens
- [x] Update tailwind.config.ts
- [ ] Install Pretendard font
- [ ] Create base component library (Buttons, Inputs, Cards)

### Phase 2: Core Components (Week 3-4)
- [ ] Build Dashboard Metrics component
- [ ] Build Data Table component
- [ ] Build Booking Modal
- [ ] Build Chat Interface
- [ ] Build Subscription Alert

### Phase 3: Page Layouts (Week 5-6)
- [ ] Pro Dashboard page
- [ ] Pro Directory page (refactor existing)
- [ ] Pro Profile page (refactor existing)
- [ ] Golfer Dashboard page

### Phase 4: Integration (Week 7-8)
- [ ] Connect to Supabase backend
- [ ] Implement real-time chat (Supabase Realtime)
- [ ] Integrate Toss Payments (subscription)
- [ ] Add authentication (Supabase Auth)

### Phase 5: Polish & Testing (Week 9-10)
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization (Lighthouse)
- [ ] Cross-browser testing
- [ ] User acceptance testing (UAT)

---

## 9. Success Metrics

### 9.1 User Metrics

**Pro Users:**
- Dashboard engagement: > 60% weekly active users
- Subscription conversion: > 25% of pros upgrade within 3 months
- Lead response time: < 4 hours average

**Golfer Users:**
- Booking completion rate: > 40% (inquiry → confirmed lesson)
- Profile view duration: > 90 seconds average
- Return rate: > 30% book second lesson within 6 months

### 9.2 Design Metrics

**Performance:**
- Lighthouse score: > 90 (all categories)
- Error rate: < 1% of user sessions

**Accessibility:**
- WCAG AA compliance: 100%
- Keyboard navigation: 100% of features accessible

**Usability:**
- Task completion rate: > 85%
- User satisfaction (CSAT): > 4.5/5

---

## 10. Design Principles Summary

1. **Whitespace is a Feature** — Don't fear empty space; it reduces cognitive load
2. **Data is King** — Tables, metrics, and charts must be scannable at a glance
3. **Trust Through Transparency** — Always show system state and next steps
4. **Monochrome + Accent** — 90% neutrals, 10% accent and functional colors
5. **Subtle > Flashy** — Micro-interactions enhance, not distract
6. **Mobile is Not Desktop** — Thoughtfully adaptive, not just responsive
7. **Korean Aesthetic** — Refined, minimal, sophisticated without ostentation

---

**Next Steps:**
1. Review this strategy with stakeholders
2. Begin implementation of base components
3. Conduct usability testing on prototypes
4. Iterate based on user feedback

---

*Document Version: 1.0*
*Last Updated: 2025-11-24*
*Author: Claude Code (AI-Assisted Design)*
