---
id: ISSUE-006
title: Landing - Pros (/pro) Implementation Scope
status: Done
priority: P1
owner: TBD
created: 2025-12-30
completed: 2025-12-30
---

# Landing - Pros (/pro) Implementation Scope

## Scope
Define the implementation scope and content boundaries for the pro-focused landing page.

## Goals
- Align the `/pro` page with the manager-service positioning.
- Finalize the minimal set of sections and CTAs for v1.
- Ensure handoff-ready copy/structure for design + development.

## Deliverables
- Section list for `/pro` (hero, value pillars, concierge tier, template gallery, proof, pricing CTA).
- CTA destinations and copy (signup vs. consultation).
- Required data inputs (template previews, pricing summary, trust proof).
- Success criteria and basic analytics events.

## Open Questions
- Which CTA is primary: "프로 등록" or "상담 요청"?
- Do we route to `/onboarding/quick-setup` or collect lead first?
- What proof elements are acceptable for v1 (counts, testimonials, partner logos)?

## Decision
- Primary CTA: "프로 등록" → `/onboarding/quick-setup`
- Secondary CTA: "상담 요청" → 리드 캡처/운영팀 연결
- 상담 방식은 사용자가 선택 (채팅/폼/콜백)
- Lead-first flow는 컨시어지 전용으로 유지
- 프로 등록 필수 수집 항목: 이름/생년월일/연락처/프로 인증/주요 활동 위치/프로필 사진 1장
- 상담 채널 카피
  - 지금 채팅하기: "지금 바로 요구사항을 빠르게 확인합니다"
  - 간단 상담 폼: "필수 정보만 남기면 24시간 내 연락드립니다"
  - 콜백 예약: "원하는 시간에 담당 매니저가 연락드립니다"
- Proof & Trust는 인증 + 응답 SLA + 성과 지표 조합으로 구성
  - 응답 SLA: 1차 응답 시간 기준 노출
  - 운영 리드타임: 프로필 완성 리드타임 노출
  - 성과 지표: 문의 전환율, 프로필 조회수 상승
  - 수치/사례는 검증된 데이터만 노출 (없으면 운영 기준 카피 사용)
  - 우선순위: 인증 배지 → 응답 SLA → 성과 지표
- Proof & Trust 데이터 소스
  - 응답 SLA: `leads` + `messages` 기반, 중앙값 산출
  - 프로필 완성 리드타임: `pro_profiles.approved_at - created_at`
  - 전환율: `total_leads / profile_views` (30일 기준)
- 상담 채널 실제 경로
  - 채팅: 카카오 오픈채팅 (contact_method = `kakao`)
  - 폼: `/pro` 인라인 폼 → `trackLead` (contact_method = `form`)
  - 콜백 예약: `/pro` 인라인 예약 → `createBookingRequest`
- 배치 작업/캐시 설계
  - 배치: 매일 02:00 KST, 30일 기준 중앙값/전환율 산출
  - 저장소: `ops_metrics` 최신 스냅샷
  - API: `getProofTrustMetrics` + `unstable_cache` 1시간
  - 캐시 태그: `proof-trust-metrics`

## Success Criteria
- `/pro` scope is approved for v1 implementation.
- Section order + CTA logic are locked.
- Copy tone matches "luxury manager" positioning.

## References
- `specs/003-screen-definitions/screens/01-marketing/landing-pro.md`
- `web/lib/docs/business/PRD.md`
