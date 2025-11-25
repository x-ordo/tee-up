---
title: TEE:UP 문서 인덱스
version: 2.0.0
status: Approved
owner: "@tech-lead"
created: 2025-11-24
updated: 2025-11-25
language: Korean (한국어)
---

# TEE:UP 문서 인덱스

## 문서 네비게이션

> **본 문서는 TEE:UP 프로젝트의 모든 문서에 대한 인덱스와 네비게이션을 제공합니다.**

---

## 📚 문서 구조

```
tee-up/
├── 📄 CONTEXT.md              ⭐ 시스템 단일 진실 공급원
├── 📄 README.md               빠른 시작 가이드
├── 📄 ENVIRONMENT.md          환경 설정 가이드
├── 📄 plan.md                 TDD 개발 계획
├── 📄 VERSIONING_GUIDE.md     버전 관리 규칙
│
├── 📁 docs/
│   ├── 📁 specs/              기술 명세서
│   ├── 📁 guides/             개발 가이드
│   ├── 📁 business/           비즈니스 문서
│   └── 📁 operations/         운영 문서
│
└── 📁 .github/
    ├── 📁 workflows/          CI/CD 파이프라인
    └── 📁 ISSUE_TEMPLATE/     이슈 템플릿
```

---

## 🚀 시작하기

| 단계 | 문서 | 설명 |
|------|------|------|
| 1 | [README.md](../README.md) | 프로젝트 개요 및 빠른 시작 |
| 2 | [ENVIRONMENT.md](../ENVIRONMENT.md) | 개발 환경 설정 |
| 3 | [CONTEXT.md](../CONTEXT.md) | 시스템 컨텍스트 이해 |
| 4 | [CONTRIBUTING.md](guides/CONTRIBUTING.md) | 기여 방법 |

---

## 📋 기술 명세서 (specs/)

| 문서 | 설명 | 상태 |
|------|------|------|
| [PRD.md](specs/PRD.md) | 제품 요구사항 정의서 | ✅ Active |
| [ARCHITECTURE.md](specs/ARCHITECTURE.md) | 시스템 아키텍처 설계 | ✅ Active |
| [API_SPEC.md](specs/API_SPEC.md) | REST API 명세서 | ✅ Active |
| [DATA_MODEL.md](specs/DATA_MODEL.md) | 데이터베이스 스키마 & ERD | ✅ Active |
| [DESIGN_SYSTEM.md](specs/DESIGN_SYSTEM.md) | 디자인 시스템 명세 | ✅ Active |

### ADRs (Architecture Decision Records)

| 문서 | 제목 | 상태 |
|------|------|------|
| [ADR-0000](specs/ADRs/ADR-0000-template.md) | ADR 템플릿 | Template |
| [ADR-0001](specs/ADRs/ADR-0001-tech-stack.md) | 기술 스택 선정 | Accepted |

---

## 📖 개발 가이드 (guides/)

| 문서 | 설명 | 대상 |
|------|------|------|
| [TDD_GUIDE.md](guides/TDD_GUIDE.md) | 테스트 주도 개발 가이드 | 개발자 |
| [CONTRIBUTING.md](guides/CONTRIBUTING.md) | 기여 가이드 | 기여자 |
| [CODE_REVIEW_GUIDE.md](guides/CODE_REVIEW_GUIDE.md) | 코드 리뷰 체크리스트 | 리뷰어 |
| [CODING_CONVENTIONS.md](guides/CODING_CONVENTIONS.md) | 코딩 컨벤션 | 개발자 |
| [ERROR_HANDLING.md](guides/ERROR_HANDLING.md) | 에러 처리 패턴 | 개발자 |
| [UX_STRATEGY.md](guides/UX_STRATEGY.md) | UX 전략 | 디자이너/개발자 |

---

## 💼 비즈니스 문서 (business/)

| 문서 | 설명 |
|------|------|
| [BUSINESS_PLAN.md](business/BUSINESS_PLAN.md) | 사업 계획서 |
| [PRD.md](business/PRD.md) | 제품 요구사항 (비즈니스 관점) |

---

## 🔧 운영 문서 (operations/)

| 문서 | 설명 | 대상 |
|------|------|------|
| [DEPLOYMENT_CHECKLIST.md](operations/DEPLOYMENT_CHECKLIST.md) | 배포 체크리스트 | DevOps |
| [INCIDENT_RESPONSE.md](operations/INCIDENT_RESPONSE.md) | 인시던트 대응 가이드 | 온콜 |

---

## ⚙️ CI/CD 파이프라인 (.github/workflows/)

| 파일 | 설명 | 트리거 |
|------|------|--------|
| [ci.yml](../.github/workflows/ci.yml) | CI 파이프라인 | Push, PR |
| [deploy-dev.yml](../.github/workflows/deploy-dev.yml) | 개발 환경 배포 | develop 푸시 |
| [deploy-prod.yml](../.github/workflows/deploy-prod.yml) | 프로덕션 배포 | 릴리스 태그 |

---

## 📝 이슈 템플릿 (.github/ISSUE_TEMPLATE/)

| 템플릿 | 용도 |
|--------|------|
| [bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md) | 버그 리포트 |
| [feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md) | 기능 요청 |

---

## 🔗 외부 리소스

### 공식 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### 프로젝트 링크

- **GitHub**: https://github.com/your-org/tee-up
- **Staging**: https://staging.teeup.kr
- **Production**: https://teeup.kr

---

## 📊 문서 상태

| 카테고리 | 완료 | 진행중 | 계획 |
|----------|------|--------|------|
| Foundation | 4 | 0 | 0 |
| Specs | 5 | 0 | 2 |
| Guides | 6 | 0 | 4 |
| Operations | 2 | 0 | 6 |
| CI/CD | 3 | 0 | 0 |
| **Total** | **20** | **0** | **12** |

---

## 🔄 최근 업데이트

| 날짜 | 문서 | 변경 내용 |
|------|------|----------|
| 2025-11-25 | CONTEXT.md | Master Prompt 표준 적용 |
| 2025-11-25 | ARCHITECTURE.md | 시스템 아키텍처 추가 |
| 2025-11-25 | TDD_GUIDE.md | TDD 가이드 추가 |
| 2025-11-25 | CI/CD workflows | 파이프라인 설정 |

---

**문서는 코드와 함께 유지됩니다. 변경 시 관련 문서도 업데이트하세요.**
