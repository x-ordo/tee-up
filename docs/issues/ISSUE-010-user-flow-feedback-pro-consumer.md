---
id: ISSUE-010
title: User Flow Feedback - Pro vs Consumer
status: Open
priority: P1
owner: TBD
created: 2025-12-30
---

# User Flow Feedback - Pro vs Consumer

## Scope
Summarize user-flow friction and improvements from both supply (pro golfer) and demand (consumer) perspectives.

## Findings

### Pro (Supplier) Perspective
- Entry messaging: `/pro → /onboarding/quick-setup` flow needs a clear incentive (e.g., “verified pros get immediate exposure + lead routing”) to avoid early drop-off.
- Input burden: 6 required fields are reasonable, but two uploads feel heavy; add reassurance like “profile photo can be replaced later.”
- Post-submit expectations: clarify “verification timeline → who contacts you → when you go live” to reduce anxiety and support load.
- Self-promotion cue: after submission, offer a lightweight choice (template/highlight section) to boost ownership and reduce churn.
- Concierge value: the “real manager” value must be emphasized inside the flow to justify premium positioning.

### Consumer (Demand) Perspective
- Trust signals: Landing 2 needs 2–3 proof points backing “AI recommendation + verified pros.”
- Simplicity: enforce a single primary CTA (“Get Recommendations” / “Request Consultation”); keep secondary CTAs lower priority.
- Chat clarity: specify who responds (ops team / AI / pro) to avoid hesitation.
- Recommendation quality: ontology is strong, but early data is thin; use manual curation/ops moderation in v1.
- Anxiety reduction: add a minimal FAQ (pricing/process/cancellation/refund) to lift first-contact conversion.

## Priority Actions
- Pro: strengthen messaging for “fast onboarding → visibility → concierge support → outcomes.”
- Consumer: pin three trust blocks (verification, responder identity, reassurance copy) on Landing 2.
- Both: keep a single, dominant primary CTA and demote everything else.

## Assumptions
- Primary flows: `/pro → /onboarding/quick-setup` and `/ → 상담/채팅`.
- Ops team can assist with curation and verification in early stages.
