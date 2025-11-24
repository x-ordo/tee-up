# TEE:UP Project Plan
## Product Development Roadmap

> **Last Updated:** 2025-11-24
> **Version:** 1.0.0
> **Status:** Active Development (Phase 1)

---

## 📊 Project Overview

### Vision
Create a premium golf lesson matching platform that connects VIP golfers with verified professional golfers through visual-first, data-driven experiences.

### Success Criteria
- **Month 3:** 50+ verified pros, 200+ golfer sign-ups
- **Month 6:** 40% lead conversion rate, ₩5M+ MRR
- **Year 1:** 200+ pros, 2,000+ golfers, profitable operations

---

## 🗓 Timeline Overview

| Phase | Duration | Status | Key Deliverables |
|-------|----------|--------|------------------|
| **Phase 1: MVP** | 4 weeks | 🚧 In Progress | Pro profiles, Directory, Admin panel |
| **Phase 2: Beta** | 8 weeks | 📋 Planned | Real-time chat, Auth, Subscriptions |
| **Phase 3: Scale** | Ongoing | 📋 Planned | Analytics, AI matching, Mobile apps |

---

## 🎯 Phase 1: MVP (Weeks 1-4)

### Goal: "Showcase Platform"
Launch a visual-first platform that showcases verified golf pros and enables basic inquiry flow.

### Week 1: Foundation ✅
**Status:** COMPLETED

#### Frontend Foundation
- [x] Next.js 14 project setup with App Router
- [x] Tailwind CSS + Design system configuration
- [x] Pretendard font integration
- [x] Korean Luxury Minimalism design system
- [x] Global CSS with reusable component classes

#### Design System
- [x] Color palette (Calm Neutrals + Blue Accent)
- [x] Typography system (Pretendard + Inter)
- [x] Component library (`.btn-primary`, `.card`, `.input`)
- [x] Design tokens (CSS variables)

#### Documentation
- [x] CONTEXT.md (System source of truth)
- [x] README.md (Quick start guide)
- [x] INDEX.md (Documentation index)
- [x] DESIGN_SYSTEM.md (Full design specs)
- [x] UX_STRATEGY.md (UX philosophy)
- [x] CONTRIBUTING.md (Development guidelines)

**Deliverables:** ✅ Complete design system, Documentation structure

---

### Week 2: Pro Profiles & Directory ✅
**Status:** COMPLETED

#### Pro Profile Pages
- [x] Hero section with featured pro (large card)
- [x] Video play button overlay
- [x] Verification badges (LPGA/PGA verified)
- [x] Pro statistics display (tour experience, re-booking rate, rating)
- [x] Specialties tags
- [x] Pricing display
- [x] CTA buttons (Profile view, Instant inquiry)

#### Pro Directory
- [x] Search & filter bar (name, location, specialty)
- [x] Grid layout (responsive 1-3 columns)
- [x] Pro cards with hover effects
- [x] Empty state handling
- [x] Quick filter pills (Driver, Short game, Putting, etc.)

#### Sample Data
- [x] 9 realistic pro profiles with rich credentials
- [x] Professional images (Unsplash placeholders)
- [x] Detailed career descriptions

**Deliverables:** ✅ Working homepage with pro showcase, Searchable directory

---

### Week 3: Admin Panel ✅
**Status:** COMPLETED

#### Admin Dashboard
- [x] Admin authentication (Supabase Auth)
- [x] Dashboard overview (metrics summary)
- [x] Pro management table
- [x] Chat management interface
- [x] Analytics widgets with time filtering

#### Pro Verification System
- [ ] Pending pro applications list
- [ ] Pro profile review interface
  - View all submitted information
  - Verify credentials (LPGA/PGA certificates)
  - Approve/Reject with notes
- [ ] Approved pros list with edit capability
- [ ] Rejected pros with re-application option

#### Chat Management
- [ ] Active chat rooms table
- [ ] Chat history viewer
- [ ] Message search and filter
- [ ] Flagged/reported messages
- [ ] Admin moderation tools (warn, suspend, ban)

#### Pro Profile Management
- [ ] Edit pro profiles (admin override)
- [ ] Upload/manage pro images
- [ ] Feature/unfeature pros
- [ ] Set subscription tier manually

**Deliverables:** 🎯 Admin panel for pro verification and chat oversight

---

### Week 4: Integration & Polish
**Status:** PLANNED

#### KakaoTalk Integration
- [ ] KakaoTalk link button on pro profiles
- [ ] Deep linking to KakaoTalk chat
- [ ] Message template pre-fill
- [ ] Tracking of KakaoTalk inquiry conversions

#### Landing Page Refinement
- [ ] SEO optimization (meta tags, Open Graph)
- [ ] Page load performance tuning
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit (WCAG AA)

#### Admin Features
- [ ] Bulk actions (approve multiple pros)
- [ ] Export data (CSV for analytics)
- [ ] Activity logs (audit trail)
- [ ] Email notifications (new pro applications)

#### Testing & QA
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Mobile device testing (iOS, Android)
- [ ] Performance benchmarks (Lighthouse score > 90)
- [ ] Security review (XSS, CSRF protection)

**Deliverables:** 🎯 Production-ready MVP, Deployed to staging

---

## 🚀 Phase 2: Beta (Weeks 5-12)

### Goal: "Lock-in with Real-time Features"
Add authentication, real-time chat, and subscription billing to enable full platform functionality.

### Week 5-6: Authentication & Database Integration (Current) 🚧
**Status:** IN PROGRESS

#### Supabase Setup
- [x] Supabase project creation
- [x] Database schema design (profiles, pro_profiles, chat_rooms, messages)
- [x] Supabase Auth configuration
- [x] Row-level security (RLS) policies

#### Admin Authentication
- [x] Supabase Auth integration
- [x] Email/password login for admin
- [x] Session management with cookies
- [x] Protected admin routes (middleware)
- [x] Logout functionality

#### Testing (TDD)
- [ ] RED: Auth login tests (failing)
- [ ] GREEN: Auth login tests (passing)
- [ ] RED: Profile CRUD tests (failing)
- [ ] GREEN: Profile CRUD tests (passing)

#### User Profiles
- [ ] Golfer profile page (name, phone, preferences)
- [ ] Pro profile edit page (self-service)
- [ ] Profile completion wizard
- [ ] Avatar upload

**Deliverables:** 🎯 User authentication system, Profile management

---

### Week 7-8: Real-time Chat (Supabase Realtime)
**Status:** PLANNED

#### Chat Infrastructure
- [ ] Supabase Realtime setup
- [ ] Chat rooms table (schema)
- [ ] Messages table (schema)
- [ ] Presence tracking (online/offline)

#### Chat UI
- [ ] Chat interface component
- [ ] Message bubbles (sent/received)
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File/image sharing (optional)

#### Chat Features
- [ ] Create chat room (golfer → pro inquiry)
- [ ] Real-time message sync
- [ ] Push notifications (new message)
- [ ] Chat history persistence
- [ ] Search chat history

#### Lead Tracking
- [ ] Count new chat rooms as "leads"
- [ ] Display lead count on pro dashboard
- [ ] Free tier limit enforcement (3 leads/month)
- [ ] Subscription upgrade prompt

**Deliverables:** 🎯 Real-time chat system, Lead counting

---

### Week 9-10: Pro Dashboard & Analytics
**Status:** PLANNED

#### Dashboard Metrics
- [ ] Profile view count (daily, weekly, monthly)
- [ ] Lead count (this month, total)
- [ ] Matched lesson count
- [ ] Average rating display

#### Analytics Widgets
- [ ] View trends chart (line chart)
- [ ] Lead conversion funnel
- [ ] Revenue insights (future feature)
- [ ] Top specialties requested

#### Subscription Management
- [ ] Current subscription tier display
- [ ] Usage this month (leads used)
- [ ] Upgrade/downgrade CTA
- [ ] Billing history (future)

**Deliverables:** 🎯 Pro dashboard with analytics

---

### Week 11-12: Subscription Billing (Toss Payments)
**Status:** PLANNED

#### Toss Payments Integration
- [ ] Toss Payments SDK setup
- [ ] Payment modal component
- [ ] Subscription plan selection
- [ ] Checkout flow
- [ ] Payment confirmation page

#### Subscription Logic
- [ ] Create subscription tiers (Basic, Pro, Premium)
- [ ] Monthly billing cycle
- [ ] Lead limit enforcement
- [ ] Auto-renewal handling
- [ ] Cancellation flow

#### Billing Features
- [ ] Invoice generation
- [ ] Payment history page
- [ ] Receipt email notifications
- [ ] Refund handling (admin)

**Deliverables:** 🎯 Subscription billing system, Revenue generation

---

## 📈 Phase 3: Scale (Months 4-12)

### Goal: "Optimize & Expand"
Focus on revenue optimization, advanced features, and market expansion.

### Months 4-6: Revenue Optimization
**Status:** PLANNED

#### Pricing Experiments
- [ ] A/B test subscription pricing
- [ ] Tiered pricing optimization
- [ ] Promotional campaigns (first month free)
- [ ] Referral program (pros invite pros)

#### Retention Features
- [ ] Pro loyalty program
- [ ] Golfer rewards (book 5 lessons, get 1 free)
- [ ] Review and rating system
- [ ] Testimonial collection

#### Analytics & Insights
- [ ] Google Analytics integration
- [ ] Mixpanel event tracking
- [ ] Cohort analysis (retention, LTV)
- [ ] Business intelligence dashboard

**Deliverables:** 🎯 Optimized pricing, Retention programs, BI dashboard

---

### Months 7-9: AI-Powered Matching
**Status:** PLANNED

#### Smart Recommendations
- [ ] Golfer preference learning (skill level, goals)
- [ ] Pro recommendation algorithm
- [ ] "Pros similar to this" feature
- [ ] Personalized email campaigns

#### Search Optimization
- [ ] Semantic search (beyond keywords)
- [ ] Filters by availability, price range
- [ ] Sorting options (rating, popularity, price)
- [ ] Saved searches

#### Chatbot Assistance (Optional)
- [ ] AI chatbot for basic inquiries
- [ ] FAQ automation
- [ ] Booking assistance

**Deliverables:** 🎯 AI matching engine, Smart recommendations

---

### Months 10-12: Mobile & Expansion
**Status:** PLANNED

#### Mobile Apps
- [ ] React Native project setup
- [ ] iOS app development
- [ ] Android app development
- [ ] Push notifications
- [ ] App Store & Play Store launch

#### Market Expansion
- [ ] Busan region launch
- [ ] Jeju Island pros onboarding
- [ ] International pros (Japan, Singapore)
- [ ] Multi-language support (English, Japanese)

#### Platform Features
- [ ] Video lessons (recorded sessions)
- [ ] Group lessons
- [ ] Golf event booking
- [ ] Equipment marketplace (future)

**Deliverables:** 🎯 Mobile apps, Geographic expansion, New features

---

## 🎭 Epics & User Stories

### Epic 1: Pro Showcase (Phase 1) ✅
**As a golfer, I want to discover elite golf pros so I can find the best coach for my needs.**

- [x] Story 1.1: View featured pro on homepage
- [x] Story 1.2: Browse all pros in directory
- [x] Story 1.3: Search pros by name/location
- [x] Story 1.4: Filter by specialty
- [x] Story 1.5: Click to view detailed profile

---

### Epic 2: Admin Management (Phase 1) 🚧
**As an admin, I want to verify pros and manage chats so the platform maintains quality.**

- [ ] Story 2.1: Review pending pro applications
- [ ] Story 2.2: Approve/reject pro profiles
- [ ] Story 2.3: View all active chat rooms
- [ ] Story 2.4: Moderate flagged messages
- [ ] Story 2.5: Edit pro profiles (override)

---

### Epic 3: User Authentication (Phase 2)
**As a user, I want to create an account so I can save my preferences and chat with pros.**

- [ ] Story 3.1: Sign up with email/phone
- [ ] Story 3.2: Log in to my account
- [ ] Story 3.3: Reset forgotten password
- [ ] Story 3.4: Edit my profile
- [ ] Story 3.5: Log out securely

---

### Epic 4: Real-time Chat (Phase 2)
**As a golfer, I want to chat with pros in real-time so I can quickly book lessons.**

- [ ] Story 4.1: Send inquiry message to a pro
- [ ] Story 4.2: Receive instant reply notification
- [ ] Story 4.3: See typing indicator
- [ ] Story 4.4: View chat history
- [ ] Story 4.5: Confirm lesson booking

---

### Epic 5: Pro Dashboard (Phase 2)
**As a pro, I want to track my performance so I can optimize my coaching business.**

- [ ] Story 5.1: View profile view count
- [ ] Story 5.2: See leads this month
- [ ] Story 5.3: Track matched lessons
- [ ] Story 5.4: Monitor subscription usage
- [ ] Story 5.5: Upgrade subscription

---

### Epic 6: Subscription Billing (Phase 2)
**As a pro, I want to subscribe to receive unlimited leads so I can grow my client base.**

- [ ] Story 6.1: See subscription tier options
- [ ] Story 6.2: Select a subscription plan
- [ ] Story 6.3: Enter payment information
- [ ] Story 6.4: Confirm monthly billing
- [ ] Story 6.5: View billing history

---

## 🔧 Technical Debt & Improvements

### High Priority
- [ ] **TypeScript Strict Mode:** Enable across all files (currently partial)
- [ ] **Error Handling:** Add global error boundary
- [ ] **Loading States:** Add skeletons for all async operations
- [ ] **Image Optimization:** Use next/image instead of <img>
- [ ] **API Error Handling:** Standardize error responses

### Medium Priority
- [ ] **Testing:** Add unit tests (Jest + React Testing Library)
- [ ] **E2E Testing:** Playwright for critical user flows
- [ ] **Code Splitting:** Lazy load heavy components
- [ ] **SEO:** Add sitemap, robots.txt
- [ ] **Performance:** Optimize bundle size (<200KB gzip)

### Low Priority
- [ ] **Dark Mode:** Add theme toggle (optional)
- [ ] **Internationalization:** i18n setup for multi-language
- [ ] **Accessibility:** ARIA labels for all interactive elements
- [ ] **PWA:** Service worker for offline support
- [ ] **Animation:** Add Framer Motion for smoother transitions

---

## 📊 Success Metrics & KPIs

### Business Metrics

| Metric | Target (Month 3) | Target (Month 6) | How to Measure |
|--------|------------------|------------------|----------------|
| **Pro Sign-Ups** | 50+ | 150+ | Supabase user count (role=pro) |
| **Golfer Sign-Ups** | 200+ | 800+ | Supabase user count (role=golfer) |
| **Lead Conversion** | 30% | 40% | (Matched lessons / Total inquiries) × 100 |
| **Subscription Rate** | 20% | 25% | (Paid pros / Total pros) × 100 |
| **MRR** | ₩2M+ | ₩5M+ | Sum of all pro subscriptions |
| **Churn Rate** | <10% | <5% | (Cancelled subs / Total subs) × 100 |

### Product Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Page Load Time** | <2.5s (LCP) | Lighthouse, Vercel Analytics |
| **API Response** | <200ms (p95) | Supabase Dashboard, Sentry |
| **Uptime** | 99.5% (Phase 1), 99.9% (Phase 2) | UptimeRobot, StatusPage |
| **Error Rate** | <1% sessions | Sentry error tracking |
| **Mobile Users** | >60% | Google Analytics |

### User Engagement

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Avg Session Duration** | >3 min | Google Analytics |
| **Pro Profile Views/User** | >5 profiles | Mixpanel event tracking |
| **Return Rate (30d)** | >40% | Cohort analysis (Mixpanel) |
| **Inquiry Send Rate** | >15% of visitors | (Inquiries / Unique visitors) × 100 |
| **Chat Response Time** | <4 hours | Chat room analytics |

---

## 🚧 Risks & Mitigation

### Risk 1: Low Pro Sign-Ups
**Impact:** High
**Probability:** Medium
**Mitigation:**
- Referral program (pros invite pros)
- Direct outreach to golf academies
- Partnerships with KPGA/KLPGA
- Free premium features for early adopters

### Risk 2: Golfer Trust Issues
**Impact:** High
**Probability:** Medium
**Mitigation:**
- Mandatory verification (LPGA/PGA badges)
- User reviews and ratings
- Transparent pricing (no hidden fees)
- Money-back guarantee (if lesson unsatisfactory)

### Risk 3: Technical Scalability
**Impact:** Medium
**Probability:** Low
**Mitigation:**
- Use Supabase (auto-scaling)
- CDN for static assets (Cloudinary)
- Database indexing optimization
- Horizontal scaling plan (if needed)

### Risk 4: Subscription Churn
**Impact:** High
**Probability:** Medium
**Mitigation:**
- Loyalty discounts (3-month, 6-month plans)
- Proactive customer success outreach
- Feature updates to increase value
- Exit surveys to understand churn reasons

---

## 🛠 Development Resources

### Team Structure
- **Product Manager:** 1 (0.5 FTE, Phase 1-2)
- **Tech Lead/Fullstack Dev:** 1 (1.0 FTE)
- **Frontend Dev:** 1 (1.0 FTE, Phase 2+)
- **Backend Dev:** 1 (0.5 FTE, Phase 2+)
- **Designer:** 1 (0.5 FTE, Phase 1-2)
- **QA Engineer:** 1 (0.25 FTE, Phase 2+)

### Infrastructure Costs (Monthly)

| Service | Phase 1 | Phase 2 | Phase 3 |
|---------|---------|---------|---------|
| **Vercel (Frontend)** | Free | $20 | $50 |
| **Supabase (DB)** | Free | $25 | $100 |
| **Cloudinary (Images)** | Free | $0 | $50 |
| **Toss Payments** | $0 | 3% fee | 3% fee |
| **Monitoring (Sentry)** | Free | $26 | $50 |
| **Email (SendGrid)** | Free | $15 | $50 |
| **Total** | ~$0 | ~$86 | ~$300 |

### Development Timeline (Person-Hours)

| Phase | Duration | Effort (Hours) | Team Size |
|-------|----------|----------------|-----------|
| **Phase 1** | 4 weeks | 320h | 2 devs × 40h/week |
| **Phase 2** | 8 weeks | 640h | 2 devs × 40h/week |
| **Phase 3** | 24 weeks | 1,920h | 3 devs × 40h/week |

---

## 📞 Stakeholder Communication

### Weekly Sprint Review (Internal)
- **When:** Every Friday, 3pm KST
- **Attendees:** PM, Tech Lead, Designers, Devs
- **Format:** Demo completed features, discuss blockers
- **Output:** Sprint notes in Notion

### Monthly Business Review (Leadership)
- **When:** First Monday of each month
- **Attendees:** CEO, PM, Tech Lead
- **Format:** Metrics review, roadmap adjustments
- **Output:** Updated OKRs, budget approvals

### Quarterly Strategy Session
- **When:** End of each quarter
- **Attendees:** All team + advisors
- **Format:** Retrospective, planning next quarter
- **Output:** Roadmap v2.0, hiring plan

---

## 🎯 Next Actions (This Week)

### Priority 1: Admin Panel Development
- [ ] Create `/admin` route in Next.js
- [ ] Build admin dashboard layout
- [ ] Implement pro verification table
- [ ] Add approve/reject functionality
- [ ] Create chat management interface

### Priority 2: Documentation
- [ ] Update CONTEXT.md with admin features
- [ ] Write API spec for admin endpoints
- [ ] Create admin user guide

### Priority 3: Testing
- [ ] Manual QA of homepage
- [ ] Mobile responsive testing
- [ ] Performance benchmarks

---

**This plan is a living document. Update weekly as priorities shift and new information emerges.**

**Last Review:** 2025-11-24
**Next Review:** 2025-12-01
