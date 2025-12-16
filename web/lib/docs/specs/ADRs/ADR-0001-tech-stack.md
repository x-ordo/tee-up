---
title: 기술 스택 선정
version: 1.0.0
status: Accepted
owner: "@tech-lead"
created: 2025-11-25
updated: 2025-11-25
language: Korean (한국어)
---

# ADR-0001: 기술 스택 선정

## Status (상태)

**Accepted** (2025-11-25)

## Context (배경)

TEE:UP은 프리미엄 골프 레슨 매칭 플랫폼으로, VIP 골퍼와 검증된 프로 골퍼를 연결합니다. MVP 단계에서 빠른 개발과 향후 확장성을 모두 고려한 기술 스택 선정이 필요합니다.

### 제약 사항

- **개발 인력**: 소규모 팀 (2-3명)
- **예산**: 초기 인프라 비용 최소화 필요
- **기간**: MVP 4주 내 런칭
- **대상 시장**: 한국 (한국어 지원 필수)

### 요구사항

- 빠른 개발 속도
- SEO 지원 (검색 엔진 노출 중요)
- 실시간 기능 지원 (채팅)
- 모바일 반응형
- 향후 모바일 앱 확장 가능성

## Decision (결정)

다음 기술 스택을 채택합니다:

### 프론트엔드

| 기술 | 선정 |
|------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **언어** | TypeScript (strict mode) |
| **스타일링** | Tailwind CSS |
| **상태 관리** | Zustand |

### 백엔드

| 기술 | 선정 |
|------|------|
| **프레임워크** | Express.js |
| **언어** | TypeScript |
| **BaaS** | Supabase (PostgreSQL + Auth + Realtime) |

### 인프라

| 서비스 | 용도 |
|--------|------|
| **Vercel** | 프론트엔드 호스팅 |
| **Railway** | 백엔드 호스팅 |
| **Supabase Cloud** | 데이터베이스 |
| **Cloudinary** | 이미지/비디오 저장 |

## Rationale (근거)

### Next.js 14 선정 이유

1. **SSR/SSG 지원**: SEO 최적화 필수
2. **App Router**: 최신 React 18 기능 활용
3. **풀스택 가능**: API Routes로 간단한 백엔드 처리
4. **Vercel 통합**: 배포 자동화

### Supabase 선정 이유

1. **올인원 솔루션**: DB + Auth + Realtime + Storage
2. **PostgreSQL**: 강력한 관계형 데이터베이스
3. **무료 티어**: 초기 비용 절감
4. **자동 API**: REST/GraphQL 자동 생성

### Express.js 선정 이유

1. **유연성**: 커스텀 비즈니스 로직 처리
2. **미들웨어 생태계**: 풍부한 플러그인
3. **TypeScript 호환**: 프론트엔드와 타입 공유

## Consequences (결과)

### Positive (긍정적)

- **빠른 개발**: 풀스택 TypeScript로 생산성 향상
- **비용 효율**: 초기 무료/저렴한 서비스 활용
- **SEO 최적화**: Next.js SSR로 검색 노출
- **실시간 기능**: Supabase Realtime으로 채팅 구현 용이

### Negative (부정적)

- **Supabase 종속**: 플랫폼 종속성
- **Express 오버헤드**: 간단한 API는 Next.js API Routes로 충분했을 수 있음
- **학습 곡선**: App Router 새 패러다임

### Risks (위험)

| 위험 | 확률 | 영향 | 완화 방안 |
|------|------|------|----------|
| Supabase 서비스 장애 | 낮음 | 높음 | 로컬 PostgreSQL 백업 전략 수립 |
| Vercel 비용 증가 | 중간 | 중간 | 트래픽 모니터링, 필요시 마이그레이션 |
| Next.js 14 버그 | 낮음 | 중간 | LTS 버전 사용, 커뮤니티 모니터링 |

## Alternatives Considered (검토된 대안)

### 대안 1: Vue.js + Nuxt.js

| 항목 | 내용 |
|------|------|
| **설명** | Vue 생태계 활용 |
| **장점** | 러닝 커브 낮음, 문서 우수 |
| **단점** | React 생태계 대비 라이브러리 부족 |
| **선택하지 않은 이유** | 팀원 React 경험 우세 |

### 대안 2: Django + React

| 항목 | 내용 |
|------|------|
| **설명** | Python 백엔드 + React 프론트엔드 |
| **장점** | Django Admin 활용 가능, 안정적 |
| **단점** | 프론트-백 분리로 개발 복잡도 증가 |
| **선택하지 않은 이유** | MVP 속도 우선, 풀스택 TypeScript 선호 |

### 대안 3: Firebase

| 항목 | 내용 |
|------|------|
| **설명** | Google Firebase 올인원 솔루션 |
| **장점** | 빠른 프로토타이핑, 풍부한 기능 |
| **단점** | NoSQL 한계, 복잡한 쿼리 어려움 |
| **선택하지 않은 이유** | PostgreSQL 관계형 모델 필요 |

## Related Documents (관련 문서)

- [CONTEXT.md](../../CONTEXT.md) — 시스템 컨텍스트
- [ARCHITECTURE.md](../ARCHITECTURE.md) — 시스템 아키텍처

## Notes (참고)

- Phase 3에서 모바일 앱 추가 시 React Native 검토
- 트래픽 증가 시 Redis 캐싱 레이어 추가 예정
- AI 기능 추가 시 Python 마이크로서비스 고려

---

**작성자:** @tech-lead
**승인자:** @product-manager
**승인일:** 2025-11-25
