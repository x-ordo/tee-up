# Changelog

All notable changes to TEE:UP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Supabase 실시간 연동
- 프로 인증 워크플로우 완성

---

## [1.0.0-beta.4] - 2025-12-26

### Added

#### PRD v1.2: "무료 홍보 페이지 중심" 전략
- **가격 시스템 개편**: Free/Pro(₩49K)/Premium(₩99K)/Enterprise 4티어
- **Quick Setup 마법사**: 5분 프로필 생성 (3단계 온보딩)
- **간단 예약 요청 시스템**: `booking_requests` 테이블 및 Server Actions
- **SimpleRequestForm**: 포트폴리오 페이지 내 문의 폼
- **레슨 문의 관리**: `/dashboard/requests` 대시보드 페이지
- **SOLAPI 알림 서비스**: SMS/카카오 알림톡 연동 라이브러리

#### 신규 파일
- `supabase/migrations/018_booking_requests.sql`
- `web/src/actions/booking-requests.ts`
- `web/src/components/booking/SimpleRequestForm.tsx`
- `web/src/components/onboarding/QuickSetupWizard.tsx`
- `web/src/app/onboarding/quick-setup/page.tsx`
- `web/src/app/(dashboard)/dashboard/requests/page.tsx`
- `web/src/lib/notifications/` (solapi, templates)

### Changed
- 로그인 후 프로필 없는 프로 사용자 → Quick Setup으로 리다이렉트
- 포트폴리오 ContactSection에 문의 폼 통합
- 가격 페이지 UI 4티어 구조로 개편

---

## [1.0.0-beta.3] - 2025-12-23

### Added

#### 비즈니스 개선 (Week 1-4)
- **환불 시스템**: Toss Payments 환불 API 연동, 분쟁 관리 UI
- **레슨 일지**: CRUD 기능, 미디어 업로더 컴포넌트
- **스튜디오 N:M 관계**: 프로-스튜디오 소속 관리
- **카카오 알림톡**: 비즈니스 메시지 라이브러리
- **Vercel Cron**: 예약 리마인더 알림

#### 포트폴리오 기능
- 포트폴리오 에디터 및 설정 페이지 (#39)
- 화이트 라벨 테마 시스템 (#42)
- 스케줄러 및 캘린더 통합 (#35)
- `LessonLogCard` 컴포넌트 (#67)

#### 인프라 & 보안
- Supabase Storage 버킷 마이그레이션 (017)
- `SECURITY.md` 보안 정책 문서
- Dependabot 자동 의존성 업데이트 설정
- 커뮤니티 가이드라인 및 라이센스

#### 문서화
- 35개 페이지 화면 정의 문서 (#38)
- `terms.test.ts` 도메인 용어 단위 테스트 (43개 케이스)

### Fixed

#### 접근성 개선
- 모달 포커스 트랩 포커스 복원 개선 (#70)
- E2E 테스트 안정성 개선 (WebKit 호환)

#### 보안 수정
- glob 보안 취약점 수정 (GHSA-5j98-mcp5-4vw2) (#68)

#### 코드 품질
- ESLint unused variables 및 img element 경고 수정 (#69)
- E2E 테스트 assertion 수정 및 인증 테스트 skip (#41)
- 모바일/포트폴리오 테스트 데이터 누락 대응 (#40)
- 404 오류 및 E2E 테스트 실패 수정 (#36)
- Vercel Hobby 플랜 크론 일정 일간으로 변경

### Changed
- `tee-*` 디자인 토큰 통일 및 컴포넌트 라이브러리 추가
- 디자인 시스템 통합 (004)
- 라이센스 독점 비즈니스 저작권으로 변경

### Dependencies
- `github/codeql-action` 3 → 4
- `actions/upload-artifact` 4 → 6
- `actions/setup-node` 4 → 6
- `lucide-react` 0.561.0 → 0.562.0
- `@supabase/supabase-js` 2.88.0 → 2.89.0

---

## [1.0.0-beta.2] - 2025-12-04

### Security
- `.gitignore` 보안 강화 (민감 파일 패턴 확장)
- `web/.env.test` 버전관리 제외 (자격 증명 보호)
- Git 히스토리 정리 가이드 추가 (`docs/SECURITY_INCIDENT_RESPONSE.md`)

### Added
- `docs/SECURITY_INCIDENT_RESPONSE.md` - Git 히스토리에서 민감 데이터 제거 가이드
  - git-filter-repo 사용법
  - BFG Repo-Cleaner 사용법
  - GitHub 캐시 무효화 절차

### Changed
- `.gitignore` 전면 개편
  - 보안 섹션 최상단 배치
  - 자격 증명 패턴 확장 (`*.pem`, `*.key`, `*-credentials.json` 등)
  - 개발도구 설정 공유 허용 (`.claude/commands/`, `.specify/`)
  - 로컬 전용 설정만 제외 (`.claude/settings.local.json`)

---

## [1.0.0-beta.1] - 2025-12-03

### Added

#### 다크 모드 지원 (US1)
- `next-themes` 기반 다크/라이트 모드 전환
- 시스템 설정 동기화 및 localStorage 저장
- `ThemeToggle` 컴포넌트 (홈, 프로필, 관리자 페이지)
- `useTheme` 커스텀 훅 (타입 안전성)

#### 마이크로 인터랙션 (US2)
- `.btn-hover`, `.card-hover`, `.link-hover` 유틸리티 클래스
- 모달 애니메이션 (overlay fade, modal scale)
- 홈페이지 섹션 staggered fade-in 애니메이션

#### Material Design 3 통합 (US6)
- **M3 Motion Tokens**: Standard Scheme 이징 커브
  - `--ease-standard`: cubic-bezier(0.2, 0, 0, 1)
  - `--ease-standard-decelerate`: cubic-bezier(0, 0, 0, 1)
  - `--ease-standard-accelerate`: cubic-bezier(0.3, 0, 1, 1)
- **M3 Duration Tokens**: short1-4, medium1-4, long1-2
- **M3 Shape Tokens**: extra-small(4px) ~ full(9999px)
- **M3 Color Roles**: surface, on-surface, outline, container
- 다크 모드 Tonal Elevation 지원

#### 스켈레톤 UI 개선 (US4)
- shimmer 애니메이션 효과
- `SkeletonCard`, `SkeletonText`, `SkeletonAvatar` 변형
- `aria-busy`, `aria-live` 접근성 속성

#### Empty/Error States (US5)
- `EmptyState` 컴포넌트 (아이콘, 제목, 설명, CTA)
- `ErrorState` 컴포넌트 (재시도, 홈으로 이동)
- `role="status"`, `role="alert"` 접근성 속성

### Changed
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`에 M3 Standard Easing 적용
- `.card`, `.modal`, `.input`, `.select`에 M3 Shape Tokens 적용
- `.table-container`, `.metric-card`에 M3 Color Roles 적용
- Accent 색상 대비율 개선: #3B82F6 (3.67:1) → #2563EB (4.7:1)

### Fixed
- WCAG AA 대비율 준수 (4.5:1 이상)
- CI/CD 빌드 오류 수정 (Supabase 환경변수 폴백 처리)
- useFocusTrap 테스트 케이스 순환 포커스 동작 수정

### Dependencies
- `next-themes` 패키지 추가

### Testing
- 136 E2E 테스트 통과
- 다크 모드 전환 테스트
- axe-core WCAG AA 접근성 검사 통과

---

## [1.0.0-beta] - 2025-12-01

### Added
- 글로벌 에러 바운더리 (`error.tsx`, `global-error.tsx`)
- 404 Not Found 페이지 (`not-found.tsx`)
- 로딩 스켈레톤 컴포넌트 (`Skeleton.tsx`)
- 페이지별 로딩 상태 (`loading.tsx`)
- 유틸리티 함수 (`cn`, `formatKRW`, `formatCompact` 등)
- UI/UX 원칙 문서 (`docs/UI_UX_PRINCIPLES.md`)

### Changed

#### 디자인 시스템 완전 통일 (P0 Critical)
다크 테마(`#0a0e27`) + 골드(`#d4af37`) → 라이트 테마(`--calm-white`) + 블루(`#3B82F6`)로 전면 전환

| 카테고리 | 수정 파일 |
|----------|----------|
| 공통 | `LoadingSpinner.tsx`, `global.css` |
| 결제 | `payment/success/page.tsx`, `payment/fail/page.tsx` |
| 가격 | `pricing/page.tsx` |
| 대시보드 | `dashboard/page.tsx`, `StatCard.tsx`, `LeadChart.tsx`, `LeadList.tsx` |
| 채팅 | `chat/page.tsx`, `chat/[roomId]/page.tsx`, `ChatInput.tsx`, `ChatRoomList.tsx`, `MessageBubble.tsx` |
| 프로필 | `ProfileTemplate.tsx` |

#### 접근성 개선 (P1 High)
- **global.css 확장**
  - 버튼 disabled/focus 스타일 (`.btn-primary:disabled`, `.btn-secondary:disabled`, `.btn-ghost:disabled`)
  - 새 컴포넌트 클래스: `.tag-info`, `.radio-option`, `.checkbox`, `.schedule-day-button`
  - 테이블 zebra striping (`.table-row:nth-child(even)`)
- **ARIA 속성 추가**
  - `pricing/page.tsx`: 토글 버튼 `role="switch"`, `aria-checked`, `aria-label`
  - `AdminLoginForm.tsx`: 에러 `role="alert"`, 복구 안내
  - `admin/pros/[id]/page.tsx`: 탭 `role="tab"`, `aria-selected`, 저장 버튼 로딩 상태
  - `PendingProCard.tsx`: 버튼 `aria-label`, 로딩 스피너
  - `AuthInput.tsx`: `.label` 클래스, `aria-invalid`, `aria-describedby`
- **포커스 상태 개선**
  - 홈페이지 네비게이션 링크 `focus:ring-2 focus:ring-accent-light`
  - 스크롤 인디케이터 대비 개선 (`text-calm-ash` → `text-calm-charcoal`)

#### 컴포넌트 패턴 통일 (P1 High)
- `auth/login/page.tsx`, `admin/chats/page.tsx`: 인라인 에러 → `.alert-error`
- `ProsDirectory.tsx`: 검색바/빈 상태 → `.card` 클래스

#### 스페이싱 표준화 (P2 Medium)
- `ProfileTemplate.tsx`: `py-20` → `py-16` (10개 섹션 수정)

### Fixed
- date-fns v4 locale import 경로 수정
- tsconfig.json에서 playwright 설정 파일 제외 (빌드 오류 해결)
- profiles.test.ts 함수명 불일치 수정
- CI workflow: CodeQL v2 → v3 업그레이드
- CI workflow: 빌드 시 Supabase 환경변수 누락 수정
- CI workflow: CodeQL security-events 권한 추가
- Test Pipeline: E2E 테스트 조건부 실행 (ENABLE_E2E_TESTS 변수로 제어)

### Dependencies
- clsx, tailwind-merge 패키지 추가
- @playwright/test 패키지 추가

---

## [1.0.0-alpha] - 2025-11-27

### Added

#### Phase 1 MVP 기능
- **프로 프로필 페이지**: 매거진 스타일의 프로 상세 페이지
- **프로 디렉토리**: 검색/필터 기능이 포함된 프로 목록
- **Korean Luxury Minimalism 디자인 시스템**: 90% neutrals + 10% accent blue (#3B82F6)
- **관리자 대시보드**: 프로 관리, 채팅 모더레이션, 사용자 관리, 분석 페이지

#### 인프라 & 설정
- Next.js 14 (App Router) 프론트엔드 설정
- Express.js 백엔드 API (Mock 데이터)
- Supabase 스키마 및 RLS 정책 정의
- TypeScript strict 모드 적용

#### 테스트 환경
- Jest 단위 테스트 설정 (Frontend & Backend)
- Playwright E2E 테스트 환경 구축
- GitHub Actions CI/CD 파이프라인

#### 문서화
- CONTEXT.md: 시스템 단일 진실 공급원
- CLAUDE.md: AI 코딩 어시스턴트 가이드
- PRD, Architecture, Design System 문서

### Technical Details

| 구분 | 기술 |
|------|------|
| Frontend | Next.js 14, TypeScript 5.x, Tailwind CSS 3.x |
| Backend | Express.js 4.x, TypeScript 5.x |
| Database | Supabase (PostgreSQL) |
| Testing | Jest, Playwright |
| CI/CD | GitHub Actions |

### Contributors
- Initial development by TEE:UP team
- AI-assisted development with Claude Code

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0-beta.3 | 2025-12-23 | 비즈니스 개선 Week 1-4, 포트폴리오 에디터, 접근성 개선 |
| 1.0.0-beta.2 | 2025-12-04 | 보안 강화, .gitignore 개편, 개발도구 설정 공유 |
| 1.0.0-beta.1 | 2025-12-03 | 다크 모드, M3 디자인 시스템, 마이크로 인터랙션 |
| 1.0.0-beta | 2025-12-01 | 디자인 시스템 통일, 접근성 개선, UI/UX 완성도 향상 |
| 1.0.0-alpha | 2025-11-27 | Phase 1 MVP 초기 릴리스 |

---

## Links

- [GitHub Repository](https://github.com/Prometheus-P/tee-up)
- [Project Documentation](./docs/)
- [Design System](./docs/specs/DESIGN_SYSTEM.md)
