# TEE:UP Documentation Index

> **Last Updated:** 2025-11-24
> **Purpose:** Quick navigation to all project documentation

---

## 🎯 Start Here

| Document | Purpose | Owner |
|----------|---------|-------|
| [README.md](README.md) | Project overview & quick start | Product Team |
| [CONTEXT.md](CONTEXT.md) | **System source of truth** — Vision, guardrails, metrics | Tech Lead |

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
| [API_SPEC.md](specs/API_SPEC.md) ✨ | RESTful API endpoints & contracts | Backend Lead |
| [DATA_MODEL.md](specs/DATA_MODEL.md) ✨ | Database schema & entity relationships | Backend Lead |
| ARCHITECTURE.md *(planned)* | System architecture diagram & component design | Tech Lead |

---

## 📖 Development Guides

| Document | Purpose | Owner |
|----------|---------|-------|
| [PROJECT_METHODOLOGY.md](guides/PROJECT_METHODOLOGY.md) ✨ | 프로젝트 개발 방법론 (필독!) | Tech Lead |
| [PROJECT_QUICK_REFERENCE.md](guides/PROJECT_QUICK_REFERENCE.md) ✨ | 프로젝트 진행 빠른 참조 | Tech Lead |
| [UX_STRATEGY.md](guides/UX_STRATEGY.md) | UX philosophy, user personas, component specs | UX Designer |
| [CLAUDE_GUIDE.md](guides/CLAUDE_GUIDE.md) | Claude Code integration guide | Tech Lead |
| [CLAUDE_DEVELOPMENT_ANALYSIS.md](guides/CLAUDE_DEVELOPMENT_ANALYSIS.md) ✨ | Claude 개발 활용 분석 및 개선 방안 | Tech Lead |
| [DEVELOPMENT_SETUP.md](guides/DEVELOPMENT_SETUP.md) ✨ | Development environment setup guide | Tech Lead |
| [CODING_CONVENTIONS.md](guides/CODING_CONVENTIONS.md) ✨ | Coding conventions & best practices | Tech Lead |
| [CODE_REVIEW_CHECKLIST.md](guides/CODE_REVIEW_CHECKLIST.md) ✨ | Code review checklist | Tech Lead |
| [ERROR_HANDLING.md](guides/ERROR_HANDLING.md) ✨ | Error handling patterns | Tech Lead |
| CONTRIBUTING.md *(planned)* | How to contribute — code style, PR process | Tech Lead |

---

## 🚀 Operations

| Document | Purpose | Owner |
|----------|---------|-------|
| [SECURITY_AUDIT.md](SECURITY_AUDIT.md) ✨ | Security audit report & best practices | Tech Lead |
| DEPLOYMENT.md *(planned)* | Deployment checklist & procedures | DevOps |
| ENVIRONMENT.md *(planned)* | Environment setup (local, staging, production) | DevOps |

---

## 📂 Directory Structure

```
tee_up/
├── README.md              # Project overview
├── CONTEXT.md             # System source of truth
├── INDEX.md               # This file
│
├── business/              # Business documents
│   ├── BUSINESS_PLAN.md
│   └── PRD.md
│
├── specs/                 # Technical specifications
│   └── DESIGN_SYSTEM.md
│
├── guides/                # Development guides
│   ├── UX_STRATEGY.md
│   └── CLAUDE_GUIDE.md
│
├── operations/            # Operations & deployment
│   └── (planned)
│
├── web/                   # Next.js frontend
│   ├── src/app/
│   └── package.json
│
└── api/                   # Express.js backend
    ├── src/
    └── package.json
```

---

## 🔍 Quick Links by Role

### Product Manager
- [CONTEXT.md](CONTEXT.md) — System vision & guardrails
- [PRD.md](business/PRD.md) — Feature requirements
- [UX_STRATEGY.md](guides/UX_STRATEGY.md) — User flows & personas

### Developer
- [README.md](README.md) — Quick start guide
- [CLAUDE_GUIDE.md](guides/CLAUDE_GUIDE.md) — Development with Claude Code
- [DESIGN_SYSTEM.md](specs/DESIGN_SYSTEM.md) — UI component specs

### Designer
- [DESIGN_SYSTEM.md](specs/DESIGN_SYSTEM.md) — Full design system
- [UX_STRATEGY.md](guides/UX_STRATEGY.md) — UX principles & patterns
- [CONTEXT.md](CONTEXT.md) — Brand positioning & personas

### Business Stakeholder
- [BUSINESS_PLAN.md](business/BUSINESS_PLAN.md) — Market & financials
- [PRD.md](business/PRD.md) — Product roadmap
- [CONTEXT.md](CONTEXT.md) — Success metrics & KPIs

---

## 📝 Document Lifecycle

### Creating New Documents
1. Check if topic fits existing structure
2. Create in appropriate folder (`business/`, `specs/`, `guides/`, `operations/`)
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

## 📞 Document Owners

| Owner | Responsibility | Contact |
|-------|----------------|---------|
| **Tech Lead** | CONTEXT.md, architecture, code standards | [TBD] |
| **Product Manager** | PRD, roadmap, feature specs | [TBD] |
| **Design Lead** | Design system, UX strategy | [TBD] |
| **CEO** | Business plan, vision, market strategy | [TBD] |

---

## 🔗 External Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Guides](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Pretendard Font](https://github.com/orioncactus/pretendard)

---

**Need to add a new document? Update this index and notify the team!**
