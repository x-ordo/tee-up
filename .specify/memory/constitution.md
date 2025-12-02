<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (Initial constitution)

  Modified principles: N/A (new file)

  Added sections:
  - Core Principles (5 principles)
  - Performance & Quality Standards
  - Development Workflow
  - Governance

  Removed sections: N/A

  Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Constitution Check section exists
  - .specify/templates/spec-template.md: ✅ Compatible (no changes needed)
  - .specify/templates/tasks-template.md: ✅ Compatible (no changes needed)
  - .specify/templates/checklist-template.md: ✅ Compatible (no changes needed)
  - .specify/templates/agent-file-template.md: ✅ Compatible (no changes needed)

  Follow-up TODOs: None
-->

# TEE:UP Constitution

## Core Principles

### I. User-Centric Design (Korean Luxury Minimalism)

All user interfaces MUST adhere to the "Calm Control" (차분한 통제) design philosophy:

- **90/10 Rule**: 90% neutral tones (calm-white, calm-cloud, calm-stone), 10% accent blue (#3B82F6)
- **Show, Don't Tell**: Visual storytelling over text; let data and imagery communicate value
- **Data Clarity**: All metrics MUST be scannable at a glance; no cognitive overload
- **No Unnecessary Copy**: Every text element MUST justify its presence; default to removal

**Rationale**: VIP golfers and professional instructors expect premium, distraction-free experiences that respect their time and attention.

### II. Trust & Transparency

All platform interactions MUST build user trust through honest, clear communication:

- **No Dark Patterns**: Pricing MUST be explicit; subscription limits MUST be visible before action
- **Verified Professionals**: Pro profiles MUST display verification badges based on actual credentials
- **Off-Platform Payment Clarity**: System MUST clearly communicate that lesson fees are paid directly to pros
- **Lead-Based Model Transparency**: Free inquiry limits (3/month) MUST be visible to pros before registration

**Rationale**: Premium platforms earn loyalty through honesty, not manipulation. Users who feel tricked will not return.

### III. Mobile-First Accessibility

All features MUST prioritize mobile experience and accessibility standards:

- **Responsive Design**: Support 320px to 4K; mobile breakpoints MUST be tested first
- **WCAG AA Compliance**: All interactive elements MUST meet contrast ratios, keyboard navigation, and ARIA requirements
- **Touch-Friendly**: Tap targets MUST be minimum 44x44px; gestures MUST have alternatives
- **Performance Budget**: LCP < 2.5s on 4G mobile connections

**Rationale**: Target users (VIP golfers, busy professionals) primarily access on mobile between activities.

### IV. Test-First Quality

All production code MUST be covered by appropriate tests:

- **E2E for Critical Paths**: User authentication, pro verification, and booking flows MUST have Playwright tests
- **Unit Tests for Logic**: Business logic in hooks, utilities, and services MUST have Jest coverage
- **Contract Tests for APIs**: Backend endpoints MUST have request/response validation tests
- **No Silent Failures**: All errors MUST be logged and user-facing errors MUST be actionable

**Rationale**: Premium service requires premium reliability. Broken features damage trust irreparably.

### V. Incremental Delivery

All features MUST be delivered in independently testable increments:

- **Phase-Based Development**: MVP first, then progressive enhancement (Phase 1 → 2 → 3)
- **User Story Independence**: Each story MUST be deployable without requiring other stories
- **Feature Flags Over Branches**: Long-running features MUST use flags, not long-lived branches
- **Checkpoint Validation**: Each phase MUST pass validation before next phase begins

**Rationale**: Rapid iteration with working software beats perfect plans. Ship value early, learn, adapt.

## Performance & Quality Standards

All code MUST meet these measurable standards:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load (LCP) | < 2.5s | Lighthouse, Vercel Analytics |
| API Response (p95) | < 200ms | Supabase Dashboard, Sentry |
| Uptime | 99.5% (MVP), 99.9% (GA) | UptimeRobot |
| Error Rate | < 1% sessions | Sentry |
| Accessibility | WCAG AA | axe-core, manual audit |
| Test Coverage | > 80% critical paths | Jest, Playwright |

Violations MUST be documented in plan.md "Complexity Tracking" section with justification.

## Development Workflow

All development MUST follow this process:

1. **Specification** (`/speckit.specify`): User stories with acceptance criteria
2. **Planning** (`/speckit.plan`): Technical approach with constitution check
3. **Task Generation** (`/speckit.tasks`): Ordered, parallel-aware task list
4. **Implementation** (`/speckit.implement`): Execute tasks with checkpoint validation
5. **Analysis** (`/speckit.analyze`): Cross-artifact consistency verification

Pull requests MUST reference the originating spec and pass all constitution checks.

## Governance

This constitution supersedes all other development practices in this repository.

**Amendment Process**:

1. Propose change in ADR format (`/docs/specs/ADRs/`)
2. Tech lead review required
3. Update constitution version per semantic versioning:
   - MAJOR: Principle removal or incompatible redefinition
   - MINOR: New principle or material expansion
   - PATCH: Clarification, wording, or typo fixes
4. Propagate changes to dependent templates
5. Commit with message: `docs: amend constitution to vX.Y.Z`

**Compliance Review**:

- All PRs MUST verify compliance with active principles
- Quarterly review of constitution relevance
- Constitution violations MUST be logged and addressed

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02
