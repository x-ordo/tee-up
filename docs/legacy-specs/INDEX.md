# TEE:UP Documentation Index

> **Last Updated:** 2025-11-26
> **Purpose:** Quick navigation to all project documentation

---

## 🎯 Start Here

| Document | Purpose | Owner |
|----------|---------|-------|
| [README.md](../README.md) | Project overview & quick start | Product Team |
| [CONTEXT.md](../CONTEXT.md) | **System source of truth** — Vision, guardrails, metrics | Tech Lead |
| [CLAUDE.md](../CLAUDE.md) | Claude Code development guide | Tech Lead |

---

## 📊 Business Documents

| Document | Purpose | Owner |
|----------|---------|-------|
| [BUSINESS_PLAN.md](business/BUSINESS_PLAN.md) | Business model, market analysis, financial projections | CEO |
| [PRD.md](business/PRD.md) | Product requirements & feature specifications | Product Manager |

---

## 🛠 Technical Specifications

| Document | Purpose | Owner |
|----------|---------|-------|
| [DESIGN_SYSTEM.md](specs/DESIGN_SYSTEM.md) | Visual design system — colors, typography, components | Design Lead |
| [API_SPEC.md](specs/API_SPEC.md) | RESTful API endpoints & contracts | Backend Lead |
| [DATA_MODEL.md](specs/DATA_MODEL.md) | Database schema & entity relationships | Backend Lead |

---

## 📖 Development Guides

| Document | Purpose | Owner |
|----------|---------|-------|
| [PROJECT_METHODOLOGY.md](guides/PROJECT_METHODOLOGY.md) | 프로젝트 개발 방법론 (필독!) | Tech Lead |
| [PROJECT_QUICK_REFERENCE.md](guides/PROJECT_QUICK_REFERENCE.md) | 프로젝트 진행 빠른 참조 | Tech Lead |
| [DEVELOPMENT_SETUP.md](guides/DEVELOPMENT_SETUP.md) | Development environment setup guide | Tech Lead |
| [CODING_CONVENTIONS.md](guides/CODING_CONVENTIONS.md) | Coding conventions & best practices | Tech Lead |
| [CODE_REVIEW_CHECKLIST.md](guides/CODE_REVIEW_CHECKLIST.md) | Code review checklist | Tech Lead |
| [ERROR_HANDLING.md](guides/ERROR_HANDLING.md) | Error handling patterns | Tech Lead |
| [CONTRIBUTING.md](guides/CONTRIBUTING.md) | How to contribute — code style, PR process | Tech Lead |
| [UX_STRATEGY.md](guides/UX_STRATEGY.md) | UX philosophy, user personas, component specs | UX Designer |
| [CLAUDE_DEVELOPMENT_ANALYSIS.md](guides/CLAUDE_DEVELOPMENT_ANALYSIS.md) | Claude 개발 활용 분석 및 개선 방안 | Tech Lead |
| [IMAGE_GENERATION_PROMPTS.md](guides/IMAGE_GENERATION_PROMPTS.md) | AI 이미지 생성 프롬프트 가이드 | Design Lead |

---

## 🧪 QA & Testing

| Document | Purpose | Owner |
|----------|---------|-------|
| [QA_CHECKLIST.md](qa/QA_CHECKLIST.md) | 종합 QA 체크리스트 | QA Lead |
| [TDD_RULES.md](qa/TDD_RULES.md) | TDD 규칙 및 가이드라인 | Tech Lead |
| [AI_TEST_AUTOMATION_PROMPT.md](qa/AI_TEST_AUTOMATION_PROMPT.md) | AI 테스트 자동화 시스템 프롬프트 | Tech Lead |

### QA Reports

| Document | Purpose | Date |
|----------|---------|------|
| [QA_TEST_REPORT.md](qa/reports/QA_TEST_REPORT.md) | QA 테스트 보고서 | 2025-11-24 |
| [QA_TEST_REPORT_FINAL.md](qa/reports/QA_TEST_REPORT_FINAL.md) | QA 최종 보고서 | 2025-11-24 |

---

## 🚀 Operations

| Document | Purpose | Owner |
|----------|---------|-------|
| [SECURITY_AUDIT.md](operations/SECURITY_AUDIT.md) | Security audit report & best practices | Tech Lead |

---

## 📋 Project Planning

| Document | Purpose | Owner |
|----------|---------|-------|
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | 프로젝트 상세 계획 및 로드맵 | Tech Lead |

---

## 🗄 Database

| Document | Purpose | Owner |
|----------|---------|-------|
| [Supabase README](../supabase/README.md) | Supabase setup guide | Backend Lead |
| [ADMIN_SETUP.md](../supabase/ADMIN_SETUP.md) | Admin account setup | Backend Lead |

---

## 📂 Directory Structure

```
tee_up/
├── README.md              # Project overview
├── CONTEXT.md             # System source of truth
├── CLAUDE.md              # Claude Code guide
│
├── docs/                  # 📚 All documentation
│   ├── INDEX.md           # This file
│   ├── PROJECT_PLAN.md    # Project roadmap
│   │
│   ├── business/          # Business documents
│   │   ├── BUSINESS_PLAN.md
│   │   └── PRD.md
│   │
│   ├── specs/             # Technical specifications
│   │   ├── API_SPEC.md
│   │   ├── DATA_MODEL.md
│   │   └── DESIGN_SYSTEM.md
│   │
│   ├── guides/            # Development guides
│   │   ├── DEVELOPMENT_SETUP.md
│   │   ├── CODING_CONVENTIONS.md
│   │   ├── CONTRIBUTING.md
│   │   └── ...
│   │
│   ├── qa/                # QA & Testing
│   │   ├── QA_CHECKLIST.md
│   │   ├── TDD_RULES.md
│   │   └── reports/
│   │
│   └── operations/        # Operations & deployment
│       └── SECURITY_AUDIT.md
│
├── web/                   # Next.js frontend
│   ├── src/app/
│   ├── e2e/               # E2E tests
│   └── package.json
│
├── api/                   # Express.js backend
│   ├── src/
│   └── package.json
│
├── supabase/              # Database setup
│   ├── schema.sql
│   └── README.md
│
└── prototypes/            # HTML prototypes
    └── *.html
```

---

## 🔍 Quick Links by Role

### Product Manager
- [CONTEXT.md](../CONTEXT.md) — System vision & guardrails
- [PRD.md](business/PRD.md) — Feature requirements
- [UX_STRATEGY.md](guides/UX_STRATEGY.md) — User flows & personas

### Developer
- [README.md](../README.md) — Quick start guide
- [CLAUDE.md](../CLAUDE.md) — Development with Claude Code
- [DEVELOPMENT_SETUP.md](guides/DEVELOPMENT_SETUP.md) — Environment setup
- [CODING_CONVENTIONS.md](guides/CODING_CONVENTIONS.md) — Code standards
- [DESIGN_SYSTEM.md](specs/DESIGN_SYSTEM.md) — UI component specs

### Designer
- [DESIGN_SYSTEM.md](specs/DESIGN_SYSTEM.md) — Full design system
- [UX_STRATEGY.md](guides/UX_STRATEGY.md) — UX principles & patterns
- [CONTEXT.md](../CONTEXT.md) — Brand positioning & personas

### QA Engineer
- [QA_CHECKLIST.md](qa/QA_CHECKLIST.md) — QA checklist
- [TDD_RULES.md](qa/TDD_RULES.md) — TDD guidelines
- [AI_TEST_AUTOMATION_PROMPT.md](qa/AI_TEST_AUTOMATION_PROMPT.md) — AI testing

### Business Stakeholder
- [BUSINESS_PLAN.md](business/BUSINESS_PLAN.md) — Market & financials
- [PRD.md](business/PRD.md) — Product roadmap
- [CONTEXT.md](../CONTEXT.md) — Success metrics & KPIs

---

## 📝 Document Lifecycle

### Creating New Documents
1. Check if topic fits existing structure
2. Create in appropriate folder (`business/`, `specs/`, `guides/`, `qa/`, `operations/`)
3. Add front-matter (title, owner, last updated)
4. Update this INDEX.md
5. Link from CONTEXT.md if it's a key reference

### Updating Documents
1. Increment version if major change
2. Update "Last Updated" date
3. Add changelog note at bottom
4. Notify team in #teeup-dev Slack

### Archiving Documents
- Move to `archive/` folder
- Add "(archived)" to INDEX.md entry
- Keep for historical reference

---

## 🔄 Status Indicators

| Status | Meaning |
|--------|---------|
| ✅ **Complete** | Document finished, reviewed, active |
| 🚧 **In Progress** | Draft, being actively written |
| 📋 **Planned** | Not started, on roadmap |
| 🗄️ **Archived** | Obsolete, kept for reference only |

---

## 🔗 External Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Guides](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Pretendard Font](https://github.com/orioncactus/pretendard)

---

**Need to add a new document? Update this index and notify the team!**
