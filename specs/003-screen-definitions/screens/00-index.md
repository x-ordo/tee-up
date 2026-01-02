# TEE:UP Screen Index

**Total Pages**: 37
**Completed**: 30
**Unimplemented**: 7
**Last Updated**: 2025-12-30

---

## Overview

TEE:UP 프로젝트의 전체 페이지 목차 및 구현 상태이다.

### Priority Legend

| Priority | Description | Target |
|----------|-------------|--------|
| **P0** | 핵심 비즈니스 플로우 | MVP 필수 |
| **P1** | 비즈니스 지원 | MVP 권장 |
| **P2** | 부가 기능 | 후속 릴리스 |
| **P3** | 낮은 우선순위 | 필요시 구현 |

### Status Legend

| Status | Description |
|--------|-------------|
| Implemented | 구현 완료 |
| Partial | 부분 구현 |
| **Unimplemented** | 미구현 |

---

## Core Business Flow (P0)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ /auth/login │ →  │ /dashboard  │ →  │ /dashboard/ │
│             │    │             │    │  portfolio  │
└─────────────┘    └─────────────┘    └─────────────┘
                          ↓                   ↓
                   ┌─────────────┐    ┌─────────────┐
                   │ /dashboard/ │ ←  │   /[slug]   │ ← Lead
                   │    leads    │    │ (Portfolio) │
                   └─────────────┘    └─────────────┘
```

---

## 01. Marketing Pages (6)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 1 | Landing - Pros | `/pro` | Implemented | P1 | [landing-pro.md](./01-marketing/landing-pro.md) |
| 2 | Landing - Golfers | `/` | Implemented | P1 | [home.md](./01-marketing/home.md) |
| 3 | Pricing | `/pricing` | Implemented | P2 | [pricing.md](./01-marketing/pricing.md) |
| 4 | Onboarding Mood | `/onboarding/mood` | Implemented | P1 | [onboarding-mood.md](./01-marketing/onboarding-mood.md) |
| 5 | Onboarding Quick Setup | `/onboarding/quick-setup` | Implemented | P1 | [onboarding-quick-setup.md](./01-marketing/onboarding-quick-setup.md) |
| 6 | Get Started | `/get-started` | Implemented | P1 | [get-started.md](./01-marketing/get-started.md) |

---

## 02. Auth Pages (3)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 7 | Login | `/auth/login` | Implemented | P0 | [login.md](./02-auth/login.md) |
| 8 | Signup | `/auth/signup` | Implemented | P0 | [signup.md](./02-auth/signup.md) |
| 9 | Reset Password | `/auth/reset-password` | Implemented | P1 | [reset-password.md](./02-auth/reset-password.md) |

---

## 03. Portfolio Pages (4)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 10 | Pro Portfolio | `/[slug]` | Implemented | P0 | [pro-portfolio.md](./03-portfolio/pro-portfolio.md) |
| 11 | Studio Portfolio | `/studio/[studioSlug]` | Implemented | P1 | [studio-portfolio.md](./03-portfolio/studio-portfolio.md) |
| 12 | Site Portfolio | `/site/[handle]` | Implemented | P1 | [site-portfolio.md](./03-portfolio/site-portfolio.md) |
| 13 | Site Contact | `/site/[handle]/contact` | **Unimplemented** | P2 | [site-contact.md](./03-portfolio/site-contact.md) |

---

## 04. Dashboard Pages (6)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 14 | Dashboard Home | `/dashboard` | Implemented | P0 | [dashboard-home.md](./04-dashboard/dashboard-home.md) |
| 15 | Leads | `/dashboard/leads` | Implemented | P0 | [leads.md](./04-dashboard/leads.md) |
| 16 | **Portfolio Editor** | `/dashboard/portfolio` | **Unimplemented** | **P0** | [portfolio-editor.md](./04-dashboard/portfolio-editor.md) |
| 17 | **Settings** | `/dashboard/settings` | **Unimplemented** | P1 | [settings.md](./04-dashboard/settings.md) |
| 18 | Concierge | `/dashboard/concierge` | Implemented | P2 | [concierge.md](./04-dashboard/concierge.md) |
| 19 | Studio Management | `/dashboard/studio/[id]` | Implemented | P2 | [studio-management.md](./04-dashboard/studio-management.md) |

---

## 05. Booking & Payment Pages (4)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 20 | Booking Success | `/booking/success` | Implemented | P1 | [booking-success.md](./05-booking-payment/booking-success.md) |
| 21 | **Booking Fail** | `/booking/fail` | **Unimplemented** | P1 | [booking-fail.md](./05-booking-payment/booking-fail.md) |
| 22 | Payment Success | `/payment/success` | Implemented | P1 | [payment-success.md](./05-booking-payment/payment-success.md) |
| 23 | **Payment Fail** | `/payment/fail` | **Unimplemented** | P1 | [payment-fail.md](./05-booking-payment/payment-fail.md) |

---

## 06. Chat Pages (2)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 24 | Chat List | `/chat` | Implemented | P2 | [chat-list.md](./06-chat/chat-list.md) |
| 25 | Chat Room | `/chat/[roomId]` | Implemented | P2 | [chat-room.md](./06-chat/chat-room.md) |

---

## 07. Admin Pages (7)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 26 | Admin Dashboard | `/admin` | Implemented | P1 | [admin-dashboard.md](./07-admin/admin-dashboard.md) |
| 27 | Admin Login | `/admin/login` | Implemented | P0 | [admin-login.md](./07-admin/admin-login.md) |
| 28 | Admin Pros | `/admin/pros` | Implemented | P0 | [admin-pros.md](./07-admin/admin-pros.md) |
| 29 | **Admin Pro Detail** | `/admin/pros/[id]` | **Unimplemented** | P1 | [admin-pro-detail.md](./07-admin/admin-pro-detail.md) |
| 30 | Admin Users | `/admin/users` | Implemented | P2 | [admin-users.md](./07-admin/admin-users.md) |
| 31 | Admin Chats | `/admin/chats` | Implemented | P2 | [admin-chats.md](./07-admin/admin-chats.md) |
| 32 | Admin Analytics | `/admin/analytics` | Implemented | P2 | [admin-analytics.md](./07-admin/admin-analytics.md) |

---

## 08. Legal Pages (2)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 33 | Terms | `/legal/terms` | Implemented | P1 | [terms.md](./08-legal/terms.md) |
| 34 | Privacy | `/legal/privacy` | Implemented | P1 | [privacy.md](./08-legal/privacy.md) |

---

## 09. Studio & Error Pages (3)

| # | Screen | Route | Status | Priority | File |
|---|--------|-------|--------|----------|------|
| 35 | Studio Join | `/studio/join/[token]` | Implemented | P2 | [studio-join.md](./09-studio-error/studio-join.md) |
| 36 | **Studio Join Invalid** | `/studio/join/invalid` | **Unimplemented** | P3 | [studio-join-invalid.md](./09-studio-error/studio-join-invalid.md) |
| 37 | Error Pages | `not-found`, `error`, `global-error` | Implemented | P1 | [error-pages.md](./09-studio-error/error-pages.md) |

---

## Unimplemented Pages Summary

총 **7개** 미구현 페이지:

| Priority | Page | Route | Category |
|----------|------|-------|----------|
| **P0** | Portfolio Editor | `/dashboard/portfolio` | Dashboard |
| P1 | Settings | `/dashboard/settings` | Dashboard |
| P1 | Booking Fail | `/booking/fail` | Booking |
| P1 | Payment Fail | `/payment/fail` | Payment |
| P1 | Admin Pro Detail | `/admin/pros/[id]` | Admin |
| P2 | Site Contact | `/site/[handle]/contact` | Portfolio |
| P3 | Studio Join Invalid | `/studio/join/invalid` | Studio |

### Implementation Priority

1. **Phase 1 (P0)**: Portfolio Editor - 핵심 기능
2. **Phase 2 (P1)**: Settings, Fail Pages, Admin Pro Detail - 필수 지원 기능
3. **Phase 3 (P2-P3)**: Site Contact, Studio Join Invalid - 부가 기능

---

## Statistics

### By Category

| Category | Total | Implemented | Unimplemented |
|----------|-------|-------------|---------------|
| Marketing | 6 | 6 | 0 |
| Auth | 3 | 3 | 0 |
| Portfolio | 4 | 3 | 1 |
| Dashboard | 6 | 4 | 2 |
| Booking/Payment | 4 | 2 | 2 |
| Chat | 2 | 2 | 0 |
| Admin | 7 | 6 | 1 |
| Legal | 2 | 2 | 0 |
| Studio/Error | 3 | 2 | 1 |
| **Total** | **37** | **30** | **7** |

### By Priority

| Priority | Total | Implemented | Unimplemented |
|----------|-------|-------------|---------------|
| P0 | 8 | 7 | 1 |
| P1 | 18 | 14 | 4 |
| P2 | 10 | 9 | 1 |
| P3 | 1 | 0 | 1 |
| **Total** | **37** | **30** | **7** |

---

## Navigation Map

```
Root
├── Marketing
│   ├── /pro (Landing - Pros)
│   ├── / (Landing - Golfers)
│   ├── /pricing
│   ├── /onboarding/mood
│   ├── /onboarding/quick-setup
│   └── /get-started
│
├── Auth
│   ├── /auth/login
│   ├── /auth/signup
│   └── /auth/reset-password
│
├── Portfolio (Public)
│   ├── /[slug]
│   ├── /studio/[studioSlug]
│   └── /site/[handle]
│       └── /contact *
│
├── Dashboard (Auth Required)
│   ├── /dashboard
│   ├── /dashboard/leads
│   ├── /dashboard/portfolio *
│   ├── /dashboard/settings *
│   ├── /dashboard/concierge
│   └── /dashboard/studio/[id]
│
├── Booking & Payment
│   ├── /booking/success
│   ├── /booking/fail *
│   ├── /payment/success
│   └── /payment/fail *
│
├── Chat (Auth Required)
│   ├── /chat
│   └── /chat/[roomId]
│
├── Admin (Admin Only)
│   ├── /admin
│   ├── /admin/login
│   ├── /admin/pros
│   │   └── /[id] *
│   ├── /admin/users
│   ├── /admin/chats
│   └── /admin/analytics
│
├── Legal
│   ├── /legal/terms
│   └── /legal/privacy
│
└── Studio & Error
    ├── /studio/join/[token]
    ├── /studio/join/invalid *
    └── Error Pages

* = Unimplemented
```

---

## References

- [spec.md](../spec.md) - 전체 스펙
- [quickstart.md](../quickstart.md) - 빠른 시작 가이드
- [screen-template.md](../templates/screen-template.md) - 화면 정의 템플릿
