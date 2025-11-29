# Changelog

All notable changes to TEE:UP will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 글로벌 에러 바운더리 (`error.tsx`, `global-error.tsx`)
- 404 Not Found 페이지 (`not-found.tsx`)
- 로딩 스켈레톤 컴포넌트 (`Skeleton.tsx`)
- 페이지별 로딩 상태 (`loading.tsx`)
- 유틸리티 함수 (`cn`, `formatKRW`, `formatCompact` 등)

### Changed
- **전체 디자인 시스템 통일** (다크 골드 → Calm Control 라이트 블루 테마)
  - 홈페이지 (`page.tsx`): 네비게이션, 히어로, 카드, 푸터 전면 개편
  - 에러 페이지: `error.tsx`, `not-found.tsx`, `global-error.tsx`
  - 인증 컴포넌트: `AuthLayout`, `AuthInput`, `AuthButton`
  - 인증 페이지: `login`, `signup`, `reset-password`
  - Admin 페이지: 에러 메시지 스타일 표준화
  - 컴포넌트: `BookingModal`, `ScheduleWidget`, `Skeleton`, `KakaoTalkButton`
  - 로딩 상태: `loading.tsx` (root, profile, admin)

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

### Planned
- Supabase 실시간 연동
- KakaoTalk 링크 통합
- 프로 인증 워크플로우 완성

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
| 1.0.0-alpha | 2025-11-27 | Phase 1 MVP 초기 릴리스 |

---

## Links

- [GitHub Repository](https://github.com/Prometheus-P/tee-up)
- [Project Documentation](./docs/)
- [Design System](./docs/specs/DESIGN_SYSTEM.md)
