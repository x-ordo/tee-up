# Contributing to TEE:UP

TEE:UP에 기여해 주셔서 감사합니다! 이 가이드는 프로젝트에 효과적으로 기여하는 방법을 설명합니다.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)를 읽고 준수해 주세요.

핵심 원칙:
- 존중과 포용적인 환경 유지
- 건설적인 피드백 제공
- 학습과 성장을 돕는 태도

---

## Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/tee-up.git
cd tee-up
```

### 2. Install Dependencies

```bash
# 프로젝트 루트에서 실행
npm run install:web
# 또는
cd web && npm install
```

### 3. Environment Setup

```bash
# web/.env.local 파일 생성
cp web/.env.example web/.env.local
# Supabase 자격 증명 입력
```

### 4. Start Development Server

```bash
npm run dev
# http://localhost:3000
```

---

## Development Workflow

### Branch Strategy

```
main                    # 프로덕션 브랜치
├── feature/*           # 새 기능
├── fix/*               # 버그 수정
├── refactor/*          # 리팩토링
└── docs/*              # 문서 업데이트
```

### Creating a Branch

```bash
# 최신 main에서 시작
git checkout main
git pull origin main

# 새 브랜치 생성
git checkout -b feature/your-feature-name
```

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good - 명시적 타입, 함수형 컴포넌트
'use server'

import type { ActionResult } from './types'

export async function updateProfile(
  id: string,
  data: ProfileUpdate
): Promise<ActionResult<Profile>> {
  // ...
}
```

```typescript
// ❌ Bad - any 사용, 타입 누락
export async function updateProfile(id, data) {
  // any 타입 사용 금지
}
```

### React/Next.js

```tsx
// ✅ Good - Server Component (기본)
import { getProfile } from '@/actions/profiles'

export default async function ProfilePage({ params }) {
  const result = await getProfile(params.slug)
  return <Profile data={result.data} />
}
```

```tsx
// ✅ Good - Client Component (필요할 때만)
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### CSS/Tailwind

```tsx
// ✅ Good - Design System 토큰 사용
<button className="bg-tee-accent-primary text-white">Action</button>
<div className="text-tee-ink-strong bg-tee-surface">Card</div>

// ❌ Bad - 하드코딩 값
<button style={{ backgroundColor: '#0A362B' }}>Action</button>
```

### File Structure

```
web/src/
├── app/                  # Next.js 라우트
│   ├── (marketing)/      # 마케팅 페이지
│   ├── (portfolio)/      # 포트폴리오 페이지
│   └── (dashboard)/      # 대시보드 (인증 필요)
├── actions/              # Server Actions
├── components/           # UI 컴포넌트
│   ├── ui/               # shadcn/ui
│   └── portfolio/        # 포트폴리오 관련
├── hooks/                # Custom Hooks
└── lib/                  # 유틸리티
```

---

## Commit Guidelines

### Conventional Commits

```bash
# 형식: <type>(<scope>): <subject>

feat(portfolio): add curriculum template
fix(auth): resolve session expiration issue
docs(readme): update installation guide
style(button): improve hover animation
refactor(actions): simplify error handling
test(portfolio): add e2e tests for lead capture
chore(deps): update dependencies
```

### Types

| Type | Description |
|------|-------------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 포맷팅 (코드 변경 없음) |
| `refactor` | 코드 구조 개선 |
| `test` | 테스트 추가/수정 |
| `chore` | 빌드, 도구 설정 등 |

### Good Commit Messages

```bash
# ✅ Good
feat(leads): add contact form validation with Zod schema
fix(portfolio): correct image aspect ratio on mobile
refactor(actions): extract auth check to middleware

# ❌ Bad
update code
fix bug
WIP
```

---

## Pull Request Process

### Pre-Submit Checklist

- [ ] `npm run lint` 통과
- [ ] `npm run type-check` 통과
- [ ] `npm run build` 성공
- [ ] 테스트 추가/수정 (해당되는 경우)
- [ ] 문서 업데이트 (해당되는 경우)

### PR Template

```markdown
## Summary
<!-- 변경 사항 요약 (1-2문장) -->

## Changes
<!-- 주요 변경 목록 -->
- Added X
- Fixed Y
- Updated Z

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation

## Testing
<!-- 테스트 방법 설명 -->

## Screenshots
<!-- UI 변경 시 스크린샷 첨부 -->
```

### Review Process

1. **PR 생성** - 명확한 제목과 설명 작성
2. **CI 통과** - 모든 자동화 검사 통과 확인
3. **코드 리뷰** - 1명 이상 승인 필요
4. **머지** - Squash and Merge 사용

---

## Reporting Issues

### Bug Report

```markdown
**문제 설명**
명확한 버그 설명

**재현 단계**
1. '...'로 이동
2. '...' 클릭
3. 오류 발생

**예상 동작**
정상적으로 기대하는 동작

**환경**
- OS: macOS 14.x
- Browser: Chrome 120
- Version: 0.2.0

**스크린샷**
(해당되는 경우)
```

### Feature Request

```markdown
**관련 문제**
이 기능이 필요한 이유

**제안 솔루션**
구현 방안 설명

**대안**
고려한 다른 방법

**추가 정보**
목업, 참고 자료 등
```

---

## Getting Help

- **GitHub Issues**: 버그 리포트, 기능 요청
- **GitHub Discussions**: 질문, 아이디어 논의
- **Security Issues**: [SECURITY.md](./SECURITY.md) 참고

---

## Recognition

기여자는 다음에서 인정됩니다:
- GitHub Contributors 페이지
- CHANGELOG.md (주요 변경 시)
- 릴리스 노트

---

**TEE:UP을 더 좋게 만들어 주셔서 감사합니다!**
