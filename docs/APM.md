# APM (Application Performance Monitoring)

> **목표**: 성능 가시성 확보, 병목 지점 식별, 실시간 에러 추적

---

## 1. 개요

TEE:UP의 APM 시스템은 Sentry를 기반으로 추가 유틸리티를 제공합니다:

| 기능 | 설명 | 위치 |
|------|------|------|
| **Error Tracking** | 에러 자동 수집 및 추적 | Sentry 기본 |
| **Performance** | 트랜잭션/스팬 추적 | Sentry + 커스텀 |
| **Web Vitals** | Core Web Vitals 수집 | `lib/apm/client` |
| **Action Metrics** | Server Action 성능 | `lib/apm/server` |
| **Custom Metrics** | 커스텀 메트릭 수집 | `lib/apm/metrics` |

---

## 2. 빠른 시작

### Server Action 래핑
```typescript
import { measureAction } from '@/lib/apm/server';

// 기존 Server Action
async function updateProfileImpl(id: string, data: UpdateData) {
  const supabase = await createClient();
  return supabase.from('pro_profiles').update(data).eq('id', id);
}

// APM 래핑
export const updateProfile = measureAction(
  'updateProfile',
  updateProfileImpl,
  { module: 'profiles' }
);
```

### Web Vitals 초기화
```tsx
// app/providers.tsx
'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/apm/client';

export function APMProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initWebVitals();
  }, []);

  return <>{children}</>;
}
```

### 커스텀 메트릭 기록
```typescript
import { recordTiming, recordCount } from '@/lib/apm';

// 타이밍 기록
recordTiming('api.stripe.charge', 150, 'api');

// 카운트 기록
recordCount('leads.created', 1, 'custom', { tier: 'pro' });
```

---

## 3. Server-Side API

### measureAction
Server Action을 래핑하여 자동으로 성능 추적:

```typescript
import { measureAction } from '@/lib/apm/server';

export const createLead = measureAction(
  'createLead',
  async (proId: string, leadData: LeadData) => {
    // ... 구현
  },
  {
    module: 'leads',
    tags: { priority: 'high' }
  }
);
```

**자동 수집 항목:**
- 실행 시간 (duration)
- 성공/실패 상태
- 에러 발생 시 Sentry 보고

### measureQuery
DB 쿼리 성능 추적:

```typescript
import { measureQuery } from '@/lib/apm/server';

const profile = await measureQuery('getProProfile', async () => {
  return supabase
    .from('pro_profiles')
    .select('*')
    .eq('id', id)
    .single();
});
```

**자동 수집 항목:**
- 쿼리 실행 시간
- 500ms 초과 시 경고 로그

### measureAPI
외부 API 호출 추적:

```typescript
import { measureAPI } from '@/lib/apm/server';

const payment = await measureAPI(
  'stripe.createPayment',
  async () => stripe.paymentIntents.create({ ... }),
  { service: 'stripe', method: 'POST' }
);
```

---

## 4. Client-Side API

### Web Vitals
```typescript
import { initWebVitals, onWebVital } from '@/lib/apm/client';

// 초기화
initWebVitals();

// 커스텀 콜백
onWebVital((metric) => {
  console.log(`${metric.name}: ${metric.value} (${metric.rating})`);
});
```

**수집되는 메트릭:**
| 메트릭 | 설명 | 좋음 기준 |
|--------|------|----------|
| LCP | Largest Contentful Paint | < 2.5s |
| INP | Interaction to Next Paint | < 200ms |
| CLS | Cumulative Layout Shift | < 0.1 |
| FCP | First Contentful Paint | < 1.8s |
| TTFB | Time to First Byte | < 800ms |

### 사용자 상호작용 추적
```typescript
import { trackClick, trackFormSubmit } from '@/lib/apm/client';

// 버튼 클릭 추적
<button onClick={() => {
  trackClick('submit_portfolio');
  handleSubmit();
}}>
  저장
</button>

// 폼 제출 추적
const handleSubmit = () => {
  trackFormSubmit('lead_capture', { source: 'portfolio' });
};
```

### 에러 리포팅
```typescript
import { reportError, reportWarning } from '@/lib/apm/client';

try {
  await riskyOperation();
} catch (error) {
  reportError(error as Error, {
    component: 'PortfolioEditor',
    action: 'save',
  });
}

// 경고 리포팅
reportWarning('Deprecated API used', { api: 'v1/profiles' });
```

---

## 5. Core Metrics API

### 스팬 생성
```typescript
import { createSpan, endSpan } from '@/lib/apm';

const span = createSpan('processPayment', {
  operation: 'payment',
  tags: { provider: 'toss' },
});

try {
  await processPayment();
  endSpan(span, 'ok');
} catch (error) {
  endSpan(span, 'error');
  throw error;
}
```

### 측정 헬퍼
```typescript
import { measure, measureAsync, startTimer } from '@/lib/apm';

// 동기 함수 측정
const result = measure('calculateTotal', () => {
  return items.reduce((sum, item) => sum + item.price, 0);
});

// 비동기 함수 측정
const data = await measureAsync('fetchData', async () => {
  return await fetch('/api/data').then(r => r.json());
});

// 수동 타이머
const timer = startTimer();
await someOperation();
console.log(`Operation took ${timer.stop()}ms`);
```

---

## 6. Sentry 설정

### 환경 변수
```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=tee-up
SENTRY_AUTH_TOKEN=your-token
```

### 샘플 레이트
| 환경 | Traces | Replays | Profiles |
|------|--------|---------|----------|
| Production | 10% | 10% | 10% |
| Development | 100% | 10% | - |

---

## 7. 파일 구조

```
lib/apm/
├── types.ts        # 타입 정의
├── metrics.ts      # 코어 메트릭 유틸리티
├── server.ts       # 서버사이드 래퍼
├── client.ts       # 클라이언트사이드 유틸리티
└── index.ts        # 모듈 진입점
```

---

## 8. 모범 사례

### DO ✅
- 중요한 Server Action에 `measureAction` 적용
- 외부 API 호출에 `measureAPI` 적용
- 500ms 이상 소요되는 쿼리 최적화
- Web Vitals 모니터링 및 개선

### DON'T ❌
- 모든 함수에 측정 적용 (오버헤드)
- 민감한 데이터를 태그에 포함
- 높은 샘플 레이트로 프로덕션 운영
- 에러 무시하고 swallow

---

## 9. 대시보드

### Sentry 대시보드
1. [Issues](https://sentry.io/issues/) - 에러 목록
2. [Performance](https://sentry.io/performance/) - 트랜잭션 추적
3. [Web Vitals](https://sentry.io/performance/browser/pageloads/) - Web Vitals
4. [Replays](https://sentry.io/replays/) - 세션 리플레이

### 주요 알림 설정
- LCP > 4s 시 경고
- Error rate > 1% 시 알림
- P95 응답시간 > 2s 시 경고

---

## 10. 트러블슈팅

### Sentry에 데이터가 안 보임
1. DSN 환경 변수 확인
2. `enabled` 설정 확인
3. 샘플 레이트 확인

### Web Vitals가 수집 안 됨
1. `initWebVitals()` 호출 확인
2. 클라이언트 컴포넌트에서 호출 확인
3. 브라우저 지원 여부 확인

### 성능 오버헤드 우려
- 프로덕션 샘플 레이트 10% 유지
- 중요 경로만 측정
- 배치 전송 활용
