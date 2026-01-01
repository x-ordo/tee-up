# TEE:UP Documentation Index

이 문서는 프로젝트 전체 문서의 인덱스입니다.

## 루트 문서 (Root-Level)

| 문서 | 설명 | 상태 |
|------|------|------|
| [CLAUDE.md](/CLAUDE.md) | Claude Code 가이드 (권위 문서) | **Active** |
| [README.md](/README.md) | 프로젝트 개요 및 설정 | Active |
| [CHANGELOG.md](/CHANGELOG.md) | 버전 이력 | Active |
| [CONTEXT.md](/CONTEXT.md) | 시스템 컨텍스트 | Active |
| [SECURITY.md](/SECURITY.md) | 보안 가이드라인 | Active |

---

## 기술 문서 (Technical Docs)

### 인프라
| 문서 | 설명 |
|------|------|
| [APM.md](./APM.md) | 애플리케이션 성능 모니터링 |
| [CACHING.md](./CACHING.md) | 캐싱 전략 |
| [DATABASE_ABSTRACTION.md](./DATABASE_ABSTRACTION.md) | 데이터베이스 추상화 |
| [FEATURE_FLAGS.md](./FEATURE_FLAGS.md) | 기능 플래그 시스템 |
| [QUERY_OPTIMIZATION.md](./QUERY_OPTIMIZATION.md) | 쿼리 최적화 |

### 가이드
| 문서 | 설명 |
|------|------|
| [UI_UX_VALIDATION_STRATEGY.md](./guides/UI_UX_VALIDATION_STRATEGY.md) | UI/UX 검증 전략 |

---

## 이슈 트래킹 (Issues)

[docs/issues/](./issues/) 폴더에서 관리:
- 기능별 이슈 문서
- 해결된 이슈 이력

---

## 레거시 스펙 (Legacy Specs)

> ⚠️ 이 문서들은 `web/lib/docs/`에서 이동됨. 일부 내용이 오래되었을 수 있음.

### 비즈니스
| 문서 | 설명 |
|------|------|
| [PRD.md](./legacy-specs/business/PRD.md) | 제품 요구사항 문서 |
| [BUSINESS_PLAN.md](./legacy-specs/business/BUSINESS_PLAN.md) | 비즈니스 계획 |

### 아키텍처 & 스펙
| 문서 | 설명 |
|------|------|
| [ARCHITECTURE.md](./legacy-specs/specs/ARCHITECTURE.md) | 시스템 아키텍처 |
| [API_SPEC.md](./legacy-specs/specs/API_SPEC.md) | API 스펙 |
| [DATA_MODEL.md](./legacy-specs/specs/DATA_MODEL.md) | 데이터 모델 |
| [DESIGN_SYSTEM.md](./legacy-specs/specs/DESIGN_SYSTEM.md) | 디자인 시스템 |
| [DESIGN_TOKENS.md](./legacy-specs/specs/DESIGN_TOKENS.md) | 디자인 토큰 |

### UI/UX
| 문서 | 설명 |
|------|------|
| [UI_UX_PRINCIPLES.md](./legacy-specs/UI_UX_PRINCIPLES.md) | UI/UX 원칙 |
| [UX_FLOWS_TEEUP.md](./legacy-specs/specs/UX_FLOWS_TEEUP.md) | UX 플로우 |

### 개발 가이드
| 문서 | 설명 |
|------|------|
| [CODING_CONVENTIONS.md](./legacy-specs/guides/CODING_CONVENTIONS.md) | 코딩 컨벤션 |
| [ERROR_HANDLING.md](./legacy-specs/guides/ERROR_HANDLING.md) | 에러 처리 |
| [TDD_GUIDE.md](./legacy-specs/guides/TDD_GUIDE.md) | TDD 가이드 |

### QA
| 문서 | 설명 |
|------|------|
| [QA_CHECKLIST.md](./legacy-specs/qa/QA_CHECKLIST.md) | QA 체크리스트 |
| [TDD_RULES.md](./legacy-specs/qa/TDD_RULES.md) | TDD 규칙 |

### 운영
| 문서 | 설명 |
|------|------|
| [DEPLOYMENT_CHECKLIST.md](./legacy-specs/operations/DEPLOYMENT_CHECKLIST.md) | 배포 체크리스트 |
| [INCIDENT_RESPONSE.md](./legacy-specs/operations/INCIDENT_RESPONSE.md) | 인시던트 대응 |

---

## 기능별 스펙 (Feature Specs)

[/specs/](/specs/) 폴더에서 관리:

| 폴더 | 설명 |
|------|------|
| [001-ux-a11y-fixes](/specs/001-ux-a11y-fixes/) | UX 접근성 수정 |
| [002-ui-ux-color](/specs/002-ui-ux-color/) | UI/UX 색상 시스템 |
| [003-screen-definitions](/specs/003-screen-definitions/) | 화면 정의 (50+ 스펙) |
| [004-design-system-integration](/specs/004-design-system-integration/) | 디자인 시스템 통합 |

---

## 아카이브 (Archive)

> 더 이상 사용되지 않는 문서들

| 문서 | 이유 |
|------|------|
| [GEMINI.md](./archive/GEMINI.md) | Express.js 참조 (현재 Next.js 사용) |
| [AGENTS.md](./archive/AGENTS.md) | CLAUDE.md로 대체됨 |

---

## 문서 관리 규칙

1. **권위 문서**: CLAUDE.md가 최우선 참조 문서
2. **신규 문서**: `docs/` 폴더에 생성
3. **아카이브**: 사용되지 않는 문서는 `docs/archive/`로 이동
4. **기능 스펙**: `/specs/` 폴더의 표준 구조 따름

---

*Last updated: 2025-01*
