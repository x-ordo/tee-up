# Feature Flags

> **목표**: 배포 위험 감소, 점진적 기능 롤아웃, A/B 테스트 지원

---

## 1. 개요

TEE:UP의 feature flag 시스템은 3가지 유형을 지원합니다:

| 유형 | 설명 | 사용 사례 |
|------|------|----------|
| **Static** | 환경 변수 기반 | 환경별 기능 활성화 |
| **Percentage** | 사용자 ID 해시 기반 | 점진적 롤아웃 |
| **Dynamic** | 데이터베이스 기반 | 사용자별 기능 제어 (향후) |

---

## 2. 빠른 시작

### Server Component
```tsx
import { isServerFlagEnabled } from '@/lib/feature-flags/server';

export default async function Page() {
  const isNewEditorEnabled = await isServerFlagEnabled('PORTFOLIO_NEW_EDITOR');

  return isNewEditorEnabled ? <NewEditor /> : <LegacyEditor />;
}
```

### Client Component
```tsx
'use client';

import { useFeatureFlag, Feature } from '@/lib/feature-flags';

function MyComponent() {
  // Hook 방식
  const isEnabled = useFeatureFlag('PORTFOLIO_NEW_EDITOR');

  // 또는 Component 방식
  return (
    <Feature flag="PORTFOLIO_NEW_EDITOR" fallback={<LegacyEditor />}>
      <NewEditor />
    </Feature>
  );
}
```

### Server Action
```typescript
import { isServerFlagEnabled } from '@/lib/feature-flags/server';

export async function myAction() {
  if (await isServerFlagEnabled('BILLING_NEW_PRICING')) {
    // New pricing logic
  } else {
    // Legacy pricing logic
  }
}
```

---

## 3. 플래그 정의

플래그는 `lib/feature-flags/flags.ts`에서 정의합니다:

```typescript
export const FLAGS = {
  // Static flag (환경 변수)
  PORTFOLIO_AI_BIO: {
    type: 'static',
    key: 'PORTFOLIO_AI_BIO',
    defaultValue: false,
    description: 'AI 바이오 제안 기능',
    envVar: 'NEXT_PUBLIC_ENABLE_AI_BIO',
  },

  // Percentage flag (점진적 롤아웃)
  PORTFOLIO_NEW_EDITOR: {
    type: 'percentage',
    key: 'PORTFOLIO_NEW_EDITOR',
    defaultValue: false,
    description: '새 에디터 UI',
    percentage: 10, // 10%의 사용자에게 활성화
  },

  // Dynamic flag (데이터베이스 - 향후)
  USER_SPECIFIC_FEATURE: {
    type: 'dynamic',
    key: 'USER_SPECIFIC_FEATURE',
    defaultValue: false,
    description: '사용자별 기능',
  },
} as const;
```

---

## 4. 현재 정의된 플래그

### Portfolio
| 플래그 | 유형 | 기본값 | 설명 |
|--------|------|--------|------|
| `PORTFOLIO_NEW_EDITOR` | percentage | false | 새 포트폴리오 에디터 |
| `PORTFOLIO_AI_BIO` | static | false | AI 바이오 생성 |

### Billing
| 플래그 | 유형 | 기본값 | 설명 |
|--------|------|--------|------|
| `BILLING_NEW_PRICING` | percentage | false | 새 가격 정책 |
| `BILLING_TOSS_PAYMENTS` | static | true | 토스페이먼츠 연동 |

### Booking
| 플래그 | 유형 | 기본값 | 설명 |
|--------|------|--------|------|
| `SCHEDULER_V2` | percentage | false | 새 스케줄러 |
| `BOOKING_DEPOSITS` | static | true | 예약금 시스템 |

### Studio
| 플래그 | 유형 | 기본값 | 설명 |
|--------|------|--------|------|
| `STUDIO_ANALYTICS` | static | false | 스튜디오 분석 |
| `STUDIO_MULTI_TENANT` | percentage | false | 멀티테넌트 지원 |

### Beta
| 플래그 | 유형 | 기본값 | 설명 |
|--------|------|--------|------|
| `BETA_REAL_TIME_CHAT` | percentage | false | 실시간 채팅 |
| `BETA_PUSH_NOTIFICATIONS` | percentage | false | 푸시 알림 |

### Debug
| 플래그 | 유형 | 기본값 | 설명 |
|--------|------|--------|------|
| `DEBUG_QUERY_LOGS` | static | false | 쿼리 로깅 |
| `DEBUG_PERFORMANCE` | static | false | 성능 오버레이 |

---

## 5. 점진적 롤아웃 (Percentage Rollout)

### 작동 방식
1. 사용자 ID와 플래그 키를 해시
2. 해시값을 0-99 버킷으로 변환
3. 버킷이 percentage 미만이면 활성화

### 일관성 보장
- 같은 사용자는 항상 같은 결과
- 플래그 키별로 독립적 분배
- 재배포 없이 percentage 변경 가능

### 롤아웃 예시
```typescript
// 10% 롤아웃 시작
PORTFOLIO_NEW_EDITOR: {
  type: 'percentage',
  percentage: 10,
  // ...
}

// 25%로 확대
percentage: 25,

// 50%로 확대
percentage: 50,

// 전체 롤아웃
percentage: 100,
```

---

## 6. 환경 변수 설정

Static 플래그에 사용하는 환경 변수:

```bash
# .env.local

# Portfolio
NEXT_PUBLIC_ENABLE_AI_BIO=false

# Billing
NEXT_PUBLIC_ENABLE_TOSS=true

# Booking
NEXT_PUBLIC_ENABLE_DEPOSITS=true

# Studio
NEXT_PUBLIC_ENABLE_STUDIO_ANALYTICS=false

# Admin
NEXT_PUBLIC_ENABLE_ADMIN_BULK=false

# Debug (개발 환경에서만)
NEXT_PUBLIC_DEBUG_QUERIES=true
NEXT_PUBLIC_DEBUG_PERF=true
```

---

## 7. 컨텍스트

플래그 평가 시 사용되는 컨텍스트:

```typescript
type FlagContext = {
  userId?: string;          // 사용자 ID (percentage 롤아웃에 필요)
  userTier?: 'free' | 'pro' | 'premium' | 'enterprise';
  environment?: 'development' | 'staging' | 'production';
  requestId?: string;       // 요청 추적용
};
```

### 자동 컨텍스트
서버 사이드에서는 자동으로 Supabase 세션에서 컨텍스트를 추출합니다:

```typescript
// 자동 컨텍스트 사용
const isEnabled = await isServerFlagEnabled('MY_FLAG');

// 수동 컨텍스트 오버라이드
const isEnabled = await isServerFlagEnabled('MY_FLAG', {
  userId: 'specific-user-id',
  userTier: 'pro',
});
```

---

## 8. 새 플래그 추가하기

### 1단계: 플래그 정의
```typescript
// lib/feature-flags/flags.ts
export const FLAGS = {
  // 기존 플래그들...

  MY_NEW_FEATURE: {
    type: 'percentage',
    key: 'MY_NEW_FEATURE',
    defaultValue: false,
    description: '새 기능 설명',
    percentage: 0, // 0%로 시작
  },
} as const;
```

### 2단계: 코드에서 사용
```tsx
// Server
const isEnabled = await isServerFlagEnabled('MY_NEW_FEATURE');

// Client
const isEnabled = useFeatureFlag('MY_NEW_FEATURE');
```

### 3단계: 점진적 롤아웃
```typescript
// 테스트 후 percentage 증가
percentage: 10,  // 10%
percentage: 50,  // 50%
percentage: 100, // 전체 롤아웃
```

### 4단계: 정리
전체 롤아웃 후 플래그 제거:
1. 플래그 조건문 제거 (새 코드만 유지)
2. `FLAGS`에서 플래그 정의 삭제

---

## 9. 파일 구조

```
lib/feature-flags/
├── types.ts           # 타입 정의
├── flags.ts           # 플래그 정의 (여기에 추가)
├── provider.ts        # 평가 로직
├── use-feature-flag.ts # React 훅
├── server.ts          # 서버사이드 유틸리티
└── index.ts           # 모듈 진입점
```

---

## 10. 모범 사례

### DO ✅
- 새 기능은 플래그 뒤에서 개발
- 0% 롤아웃으로 시작, 점진적 증가
- 플래그 설명을 명확하게 작성
- 전체 롤아웃 후 플래그 정리

### DON'T ❌
- 한 플래그에 여러 기능 묶기
- 플래그 조건 깊게 중첩하기
- 오래된 플래그 방치하기
- 플래그 이름 재사용하기

---

## 11. 테스트

### 단위 테스트에서 플래그 모킹
```typescript
jest.mock('@/lib/feature-flags', () => ({
  isEnabled: jest.fn().mockReturnValue(true),
  useFeatureFlag: jest.fn().mockReturnValue(true),
}));
```

### E2E 테스트에서 플래그 설정
```typescript
// 환경 변수로 설정
process.env.NEXT_PUBLIC_ENABLE_MY_FEATURE = 'true';
```

---

## 12. 향후 개선사항

1. **관리 UI** - 플래그 실시간 변경
2. **분석** - 플래그별 사용 통계
3. **Targeting** - 사용자 세그먼트별 플래그
4. **감사 로그** - 플래그 변경 이력
