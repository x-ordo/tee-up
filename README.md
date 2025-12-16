---
title: TEE:UP 프로젝트 README
version: 3.0.0
status: Approved
owner: "@tech-lead"
created: 2025-11-24
updated: 2025-12-16
reviewers: ["@product-manager", "@backend-lead"]
language: Korean (한국어)
---

# TEE:UP (티업)

## 골프 프로 포트폴리오 SaaS

> **Status:** Phase 2 (Portfolio SaaS Pivot)
> **Target Launch:** Q1 2025
> **Version:** 3.0.0

---

## 변경 이력 (Changelog)

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 3.0.0 | 2025-12-16 | @tech-lead | SaaS 피봇: Express 제거, 웹 단독 실행 |
| 2.0.0 | 2025-11-25 | @tech-lead | Master Prompt 표준 적용 |
| 1.0.0 | 2025-11-24 | @tech-lead | 최초 작성 |

---

## 개요 (Overview)

TEE:UP은 골프 프로를 위한 **포트폴리오 SaaS** 플랫폼입니다. 프로가 자신만의 미니사이트를 만들고, 리드를 수집하며, 브랜딩을 강화할 수 있습니다.

**핵심 전략:** "White Labeling" - 플랫폼 브랜딩 최소화, 프로 개인 브랜드 극대화

```
┌─────────────────────────────────────────────────────────────┐
│                     TEE:UP                                  │
│         "나만의 골프 포트폴리오, TEE:UP"                       │
├─────────────────────────────────────────────────────────────┤
│  프로: 포트폴리오 생성 → 테마 선택 → 리드 수집 → 레슨 확보     │
│  골퍼: 프로 발견 → 포트폴리오 탐색 → 문의 → 레슨 예약          │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 기능

| 기능 | 설명 | 상태 |
|------|------|------|
| **3종 포트폴리오 템플릿** | Visual, Curriculum, Social | ✅ 완료 |
| **리드 캡처** | 문의폼, 카카오톡, 전화 클릭 추적 | ✅ 완료 |
| **프로 대시보드** | 리드 관리, 분석 | ✅ 완료 |
| **스튜디오 페이지** | 아카데미/팀 페이지 | 🚧 진행중 |
| **일정/예약** | 예약 요청, 확정, 리마인드 | 📋 P1 |

---

## 빠른 시작 (Quick Start)

### 사전 요구사항

| 도구 | 버전 | 확인 명령어 |
|------|------|------------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | 2.x | `git --version` |

### 설치

```bash
# 저장소 클론
git clone https://github.com/Prometheus-P/tee-up.git
cd tee-up

# 의존성 설치
cd web
npm install
```

### 환경 변수 설정

```bash
# 환경 변수 설정
cp web/.env.example web/.env.local
```

필수 환경 변수:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 개발 서버 실행

```bash
cd web
npm run dev
# → http://localhost:3000
```

### 프로덕션 빌드

```bash
cd web
npm run build
npm start
```

---

## 프로젝트 구조

```
tee-up/
├── 📄 CLAUDE.md               # Claude Code 가이드 (핵심)
├── 📄 README.md               # 프로젝트 소개 (현재 문서)
├── 📄 .gitignore              # Git 제외 파일
│
├── 📁 web/                    # Next.js 14 풀스택 앱
│   ├── src/
│   │   ├── app/               # App Router
│   │   │   ├── (portfolio)/   # 프로 포트폴리오 페이지
│   │   │   ├── (dashboard)/   # 프로 대시보드 (인증 필요)
│   │   │   ├── admin/         # 플랫폼 관리자
│   │   │   └── api/           # Route Handlers (웹훅용)
│   │   ├── actions/           # Server Actions (백엔드 로직)
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── ui/            # shadcn/ui 컴포넌트
│   │   │   └── portfolio/     # 포트폴리오 템플릿
│   │   └── lib/supabase/      # Supabase 클라이언트
│   ├── e2e/                   # Playwright E2E 테스트
│   └── package.json
│
├── 📁 supabase/               # 데이터베이스
│   ├── schema.sql             # 기본 스키마
│   └── migrations/            # 마이그레이션 SQL
│
└── 📁 specs/                  # 기능 명세 (SpecKit)
    └── {feature-id}/
        ├── spec.md
        ├── plan.md
        └── tasks.md
```

> ⚠️ **Note:** `web/lib/` 폴더의 `chat/`, `leads/`, `payments/` 모듈은 기존 중개 플랫폼 코드로, 현재 DEPRECATED 상태입니다.

---

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 14.x | 풀스택 프레임워크 (App Router + Server Actions) |
| **TypeScript** | 5.x | 정적 타입 (strict mode) |
| **Tailwind CSS** | 3.x | 유틸리티 스타일링 |
| **Supabase** | - | PostgreSQL + Auth + RLS |
| **shadcn/ui** | - | UI 컴포넌트 |
| **Playwright** | - | E2E 테스트 |
| **Pretendard** | - | 한국어 폰트 |
| **Inter** | - | 영문 폰트 |

### 인프라

| 서비스 | 용도 |
|--------|------|
| Vercel | 호스팅 (추천) |
| Supabase | 데이터베이스, 인증 |
| Stripe / Toss Payments | 결제 (리드 기반 과금) |

---

## 디자인 시스템

TEE:UP은 **Korean Luxury Minimalism** 디자인 원칙을 따릅니다.

### 색상 팔레트

```css
/* Neutrals (90%) */
--calm-white: #FAFAF9;
--calm-cloud: #F4F4F2;
--calm-stone: #E8E8E5;
--calm-charcoal: #52524E;
--calm-obsidian: #1A1A17;

/* Accent (10%) */
--calm-accent: #3B82F6;
```

### 핵심 원칙

1. **Show, Don't Tell** — 텍스트보다 시각적 스토리텔링
2. **Calm Control** — 인지 부하 감소, 투명성 유지
3. **Data Clarity** — 지표는 한눈에 스캔 가능하게

전체 디자인 스펙: [DESIGN_SYSTEM.md](docs/specs/DESIGN_SYSTEM.md)

---

## 개발 로드맵

### P0 (MVP - 필수)

| 상태 | 기능 |
|------|------|
| ✅ | 3종 포트폴리오 템플릿 |
| ✅ | 프로 대시보드 |
| 🚧 | 대화형 무드 온보딩 (60초 세팅) |
| 🚧 | 연락처 마스킹 + '연락처 보기' 버튼 |
| 📋 | 문의 폼 + 리드 대시보드 |

### P1

| 상태 | 기능 |
|------|------|
| 📋 | 일정/예약 요청/확정/취소 |
| 📋 | 리마인드 (이메일/푸시) |

### P2 (후순위)

| 상태 | 기능 |
|------|------|
| 📋 | 아카데미(스튜디오) + 원장 대시보드 |
| 📋 | 캘린더 연동 / Open API |

---

## 기여 가이드

PR 제출 전 [CONTRIBUTING.md](docs/guides/CONTRIBUTING.md)를 참조하세요.

### 개발 워크플로우

```bash
# 1. 저장소 Fork

# 2. 기능 브랜치 생성
git checkout -b feat/amazing-feature

# 3. 변경사항 커밋 (Conventional Commits)
git commit -m "feat(auth): add JWT refresh token"

# 4. 브랜치 푸시
git push origin feat/amazing-feature

# 5. Pull Request 생성
```

### 커밋 컨벤션

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat(auth): add login` |
| `fix` | 버그 수정 | `fix(api): resolve null pointer` |
| `refactor` | 리팩토링 | `refactor(core): extract logic` |
| `docs` | 문서 변경 | `docs(readme): update guide` |
| `test` | 테스트 | `test(auth): add login tests` |
| `chore` | 빌드/설정 | `chore(deps): upgrade packages` |

### 코드 표준

- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- WCAG AA 접근성 준수

---

## 문서

### 핵심 문서

| 문서 | 설명 |
|------|------|
| [CONTEXT.md](CONTEXT.md) | 시스템 단일 진실 공급원 |
| [PRD.md](docs/specs/PRD.md) | 제품 요구사항 |
| [ARCHITECTURE.md](docs/specs/ARCHITECTURE.md) | 시스템 아키텍처 |
| [API_SPEC.md](docs/specs/API_SPEC.md) | REST API 명세 |

### 개발 가이드

| 문서 | 설명 |
|------|------|
| [ENVIRONMENT.md](ENVIRONMENT.md) | 환경 설정 |
| [TDD_GUIDE.md](docs/guides/TDD_GUIDE.md) | TDD 가이드 |
| [CONTRIBUTING.md](docs/guides/CONTRIBUTING.md) | 기여 가이드 |

---

## 비즈니스 모델

### 골퍼 (무료)

- 프로 포트폴리오 탐색
- 문의 전송
- 프로와 직접 레슨 예약 (오프라인 결제)

### 프로

| 티어 | 가격 | 기능 |
|------|------|------|
| **Free** | 무료 | 포트폴리오, 월 3건 연락처 노출 |
| **Basic** | ₩29,000/월 | 월 10건 연락처 노출, 모든 템플릿 |
| **Pro** | ₩49,000/월 | 무제한 연락처 노출 + 분석 + 커스텀 도메인 |

### 수익 모델

- **리드(연락처 보기 클릭) 기반 과금** - 실질적 가치 발생 시점에 과금
- 레슨 결제 수수료 없음

---

## 핵심 지표

### 비즈니스 KPI

| 지표 | 목표 (Month 3) | 목표 (Month 6) |
|------|----------------|----------------|
| 프로 가입 | 50+ | 150+ |
| 골퍼 가입 | 200+ | 800+ |
| 리드 전환율 | 30% | 40% |
| MRR | ₩2M+ | ₩5M+ |

### 기술 SLI

| 지표 | 목표 |
|------|------|
| 페이지 로드 | < 2.5s (LCP) |
| API 응답 | < 200ms (p95) |
| 가용성 | 99.5%+ |

---

## 보안 및 개인정보

- **연락처 마스킹**: 전화번호 텍스트 직접 노출 금지, '연락처 보기' 버튼을 통해서만 접근
- **이벤트 로깅**: 모든 연락처 조회는 RPC를 통해 기록 (과금 근거)
- **Rate Limiting**: 스팸/남용 방지
- **RLS (Row Level Security)**: Supabase RLS로 데이터 접근 제어
- **GDPR/PIPA 준수**: 사용자 동의 플로우, 데이터 삭제 권한

---

## 연락처

| 채널 | 연락처 |
|------|--------|
| 이메일 | hello@teeup.kr |
| 지원 | support@teeup.kr |
| Instagram | @teeup.official (예정) |

---

## 라이선스

Proprietary — All rights reserved.

---

## 감사의 말

- 디자인 영감: Catchtable, Tesla, Gentle Monster
- UI 컴포넌트: Shadcn/ui, Magic UI, uiverse.io
- 폰트: Pretendard (길형진), Inter (Rasmus Andersson)

---

**Built with care for the golf community in Seoul.**

═══════════════════════════════════════════════════════════════
✅ VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════
- [x] 목적이 명확하게 정의됨
- [x] 대상 독자가 식별됨
- [x] 범위가 명시됨
- [x] 예제 코드/다이어그램 포함
- [x] 빠른 시작 가이드 포함
- [x] 선행 문서 참조 완료
- [x] 용어 일관성 검증
- [x] 한국어(Korean)로 작성됨
═══════════════════════════════════════════════════════════════
