---
title: TEE:UP 프로젝트 README
version: 2.0.0
status: Approved
owner: "@tech-lead"
created: 2025-11-24
updated: 2025-11-25
reviewers: ["@product-manager", "@backend-lead"]
language: Korean (한국어)
---

# TEE:UP (티업)

## 프리미엄 골프 레슨 매칭 플랫폼

> **Status:** Phase 1 MVP (Active Development)
> **Target Launch:** Q1 2025
> **Version:** 2.0.0

---

## 변경 이력 (Changelog)

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 2.0.0 | 2025-11-25 | @tech-lead | Master Prompt 표준 적용 |
| 1.0.0 | 2025-11-24 | @tech-lead | 최초 작성 |

---

## 개요 (Overview)

TEE:UP은 VIP 골퍼와 검증된 프로 골퍼를 연결하는 **매거진 스타일, 데이터 기반 플랫폼**입니다.

```
┌─────────────────────────────────────────────────────────────┐
│                     TEE:UP                                  │
│         "골프 레슨의 시작, TEE:UP"                            │
├─────────────────────────────────────────────────────────────┤
│  골퍼: 프로 발견 → 프로필 비교 → 1:1 채팅 → 레슨 예약         │
│  프로: 프로필 등록 → 퍼스널 브랜딩 → 리드 수신 → 고객 확보     │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 기능

| 기능 | 설명 | 상태 |
|------|------|------|
| **Visual-First 프로필** | 멋진 이미지, 영상, 검증된 자격증 | ✅ 완료 |
| **즉각적인 매칭** | 빠른 연결을 위한 실시간 채팅 | 📋 Phase 2 |
| **신뢰 구축** | LPGA/PGA 인증 배지, 통계, 리뷰 | ✅ 완료 |
| **투명한 가격** | 명확한 요금, 오프라인 결제 | ✅ 완료 |
| **프로 대시보드** | 분석, 리드 관리, 구독 관리 | 📋 Phase 2 |

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
git clone https://github.com/your-org/tee-up.git
cd tee-up

# 프론트엔드 의존성 설치
cd web
npm install

# 백엔드 의존성 설치
cd ../api
npm install
```

### 환경 변수 설정

```bash
# 프론트엔드 환경 변수
cp web/.env.example web/.env.local

# 백엔드 환경 변수
cp api/.env.example api/.env
```

자세한 환경 설정은 [ENVIRONMENT.md](ENVIRONMENT.md)를 참조하세요.

### 개발 서버 실행

```bash
# 프론트엔드 (http://localhost:3000)
cd web
npm run dev

# 백엔드 (http://localhost:5000)
cd api
npm start
```

### 프로덕션 빌드

```bash
# 프론트엔드
cd web
npm run build
npm run start

# 백엔드
cd api
npm run build
npm start
```

---

## 프로젝트 구조

```
tee-up/
├── 📄 CONTEXT.md              # 프로젝트 단일 진실 공급원
├── 📄 README.md               # 프로젝트 소개 (현재 문서)
├── 📄 ENVIRONMENT.md          # 환경 설정 가이드
├── 📄 plan.md                 # TDD 개발 계획
├── 📄 .env.example            # 환경 변수 템플릿
├── 📄 .gitignore              # Git 제외 파일
│
├── 📁 docs/                   # 문서 루트
│   ├── 📁 specs/              # 기술 명세서
│   │   ├── PRD.md             # 제품 요구사항
│   │   ├── ARCHITECTURE.md    # 시스템 아키텍처
│   │   ├── API_SPEC.md        # REST API 명세
│   │   ├── DATA_MODEL.md      # 데이터베이스 스키마
│   │   └── 📁 ADRs/           # 아키텍처 결정 기록
│   │
│   ├── 📁 guides/             # 개발 가이드
│   │   ├── TDD_GUIDE.md       # TDD 가이드
│   │   ├── CLEAN_CODE_GUIDE.md # 클린 코드 규칙
│   │   └── ERROR_HANDLING_GUIDE.md # 에러 처리
│   │
│   ├── 📁 business/           # 비즈니스 문서
│   │   ├── BUSINESS_PLAN.md   # 사업 계획
│   │   └── PRD.md             # 제품 요구사항
│   │
│   └── 📁 operations/         # 운영 문서
│       ├── DEPLOYMENT_CHECKLIST.md
│       └── INCIDENT_RESPONSE.md
│
├── 📁 .github/                # GitHub 설정
│   ├── 📁 workflows/          # CI/CD 파이프라인
│   └── 📁 ISSUE_TEMPLATE/     # 이슈 템플릿
│
├── 📁 web/                    # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/               # App Router 페이지
│   │   ├── components/        # React 컴포넌트
│   │   └── lib/               # 유틸리티
│   └── package.json
│
├── 📁 api/                    # Express.js 백엔드
│   ├── src/
│   │   ├── routes/            # API 라우트
│   │   ├── services/          # 비즈니스 로직
│   │   └── middleware/        # 미들웨어
│   └── package.json
│
├── 📁 tests/                  # 테스트
│   ├── unit/                  # 단위 테스트
│   ├── integration/           # 통합 테스트
│   └── e2e/                   # E2E 테스트
│
├── 📁 scripts/                # 유틸리티 스크립트
└── 📁 infra/                  # 인프라 코드 (IaC)
```

---

## 기술 스택

### 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.x | App Router 프레임워크 |
| TypeScript | 5.x | 정적 타입 (strict mode) |
| Tailwind CSS | 3.x | 유틸리티 스타일링 |
| Pretendard | - | 한국어 폰트 |
| Inter | - | 영문 폰트 |

### 백엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Express.js | 4.x | REST API 프레임워크 |
| TypeScript | 5.x | 정적 타입 시스템 |
| Supabase | - | PostgreSQL + Auth + Realtime |

### 인프라 (계획)

| 서비스 | 용도 |
|--------|------|
| Supabase | 데이터베이스, 인증, 실시간 |
| Cloudinary/S3 | 미디어 저장소 |
| Toss Payments | 구독 결제 |
| Vercel | 프론트엔드 호스팅 |
| Railway/Fly.io | 백엔드 호스팅 |

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

### Phase 1: MVP (4주) - "Showcase"

| 상태 | 기능 |
|------|------|
| ✅ | 프로 프로필 페이지 |
| ✅ | 검색/필터 프로 디렉토리 |
| ✅ | Korean Luxury Minimalism 디자인 시스템 |
| 🚧 | 관리자 대시보드 |
| 📋 | 카카오톡 링크 통합 |

### Phase 2: Beta (8주) - "Lock-in"

| 상태 | 기능 |
|------|------|
| 🚧 | 사용자 인증 (Supabase Auth) |
| 📋 | 인앱 채팅 (Supabase Realtime) |
| 📋 | 프로 대시보드 및 분석 |
| 📋 | Toss Payments 구독 |

### Phase 3: Scale (Future)

- 수익 최적화
- 고급 분석
- AI 기반 매칭
- 모바일 앱

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

- 프로 프로필 탐색
- 무제한 문의 전송
- 프로와 직접 레슨 예약

### 프로

| 티어 | 가격 | 기능 |
|------|------|------|
| **Basic** | 무료 | 월 3건 문의 |
| **Pro** | ₩49,000/월 | 무제한 문의 + 분석 |

### 수익 모델

- 프로 구독료 기반 수익
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

- **전화번호 개인정보**: 채팅 시작 전까지 숨김
- **PII 암호화**: 모든 민감 데이터 암호화
- **GDPR/PIPA 준수**: 사용자 동의 플로우, 데이터 삭제 권한
- **콘텐츠 모더레이션**: 프로필 검토, 스팸 탐지

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
