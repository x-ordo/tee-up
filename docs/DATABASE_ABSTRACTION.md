# Database Abstraction Layer

> **목표**: Supabase 종속성 감소, 테스트 용이성 향상, 향후 마이그레이션 가능성 확보

---

## 1. 현재 상태 (Coupling Analysis)

| 메트릭 | 수치 |
|--------|------|
| Supabase 직접 사용 파일 | 40개 |
| 데이터베이스 쿼리 | 219회 |
| 인증 체크 | 44회 |
| RPC 함수 호출 | 12+ |
| 스토리지 호출 | 6회 |

### 결합도 분류

| 영역 | 결합도 | 추상화 난이도 |
|------|--------|---------------|
| 스토리지 (lib/storage) | 낮음 | ✅ 이미 추상화됨 |
| 인증 체크 | 중간 | ✅ auth-helper로 중앙화 |
| RPC 함수 | 중간 | 🔄 점진적 마이그레이션 |
| 데이터베이스 쿼리 | 높음 | ⏳ Repository 패턴 필요 |

---

## 2. 추상화 레이어 구조

```
lib/db/
├── types.ts        # 인터페이스 정의
├── auth-helper.ts  # 인증 헬퍼 함수
└── index.ts        # 모듈 진입점

향후 추가:
├── providers/
│   ├── supabase.ts    # Supabase 구현체
│   └── prisma.ts      # Prisma 구현체 (대안)
└── repositories/
    ├── profile.ts     # ProfileRepository
    ├── lead.ts        # LeadRepository
    └── studio.ts      # StudioRepository
```

---

## 3. Auth Helper 사용법

### Before (반복 패턴 - 44회)
```typescript
export async function myAction(): Promise<ActionResult<T>> {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // ... 비즈니스 로직
}
```

### After (중앙화된 패턴)
```typescript
import { checkAuth } from '@/lib/db';

export async function myAction(): Promise<ActionResult<T>> {
  const auth = await checkAuth();
  if (!auth.authenticated) {
    return { success: false, error: auth.error };
  }

  const { user, supabase } = auth;
  // ... 비즈니스 로직
}
```

### 역할 기반 인증
```typescript
import { requireAdmin, requirePro } from '@/lib/db';

// 관리자 전용
export async function adminAction() {
  try {
    const { user, supabase } = await requireAdmin();
    // 관리자만 접근 가능
  } catch (e) {
    return { success: false, error: 'Admin access required' };
  }
}

// 프로 전용
export async function proAction() {
  try {
    const { user, supabase } = await requirePro();
    // 프로만 접근 가능
  } catch (e) {
    return { success: false, error: 'Pro access required' };
  }
}
```

---

## 4. 점진적 마이그레이션 로드맵

### Phase 1: 즉시 적용 가능 (완료)
- [x] 인터페이스 정의 (`lib/db/types.ts`)
- [x] Auth 헬퍼 생성 (`lib/db/auth-helper.ts`)
- [x] 문서화

### Phase 2: 단기 (1-2주)
- [ ] 신규 Server Actions에 auth-helper 적용
- [ ] 고빈도 쿼리에 Repository 패턴 시범 적용
  - `ProfileRepository` (40+ 쿼리)
  - `LeadRepository` (15+ 쿼리)

### Phase 3: 중기 (2-4주)
- [ ] 기존 Server Actions를 점진적으로 리팩토링
- [ ] RPC 함수를 TypeScript 서비스로 이동 검토
- [ ] 테스트에서 mock repository 사용

### Phase 4: 장기 (필요시)
- [ ] 전체 DatabaseProvider 구현
- [ ] Supabase → 대안 (Prisma/Drizzle) 마이그레이션

---

## 5. Repository 패턴 예시

### 인터페이스 정의
```typescript
// lib/db/repositories/profile.ts
import type { Repository, PaginationOptions } from '../types';
import type { ProProfile } from '@/actions/profiles';

export interface ProfileRepository extends Repository<ProProfile> {
  findBySlug(slug: string): Promise<ProProfile | null>;
  findApproved(options?: PaginationOptions): Promise<ProProfile[]>;
  findByUserId(userId: string): Promise<ProProfile | null>;
}
```

### Supabase 구현체
```typescript
// lib/db/repositories/supabase/profile.ts
import { createClient } from '@/lib/supabase/server';
import type { ProfileRepository } from '../profile';

export class SupabaseProfileRepository implements ProfileRepository {
  async findBySlug(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('pro_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('is_approved', true)
      .single();
    return data;
  }

  async findApproved(options) {
    const supabase = await createClient();
    let query = supabase
      .from('pro_profiles')
      .select('*')
      .eq('is_approved', true);

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10));

    const { data } = await query;
    return data || [];
  }

  // ... 나머지 메서드
}
```

### 사용
```typescript
// Server Action
import { SupabaseProfileRepository } from '@/lib/db/repositories/supabase/profile';

export async function getPublicProfile(slug: string) {
  const repo = new SupabaseProfileRepository();
  const profile = await repo.findBySlug(slug);
  return { success: true, data: profile };
}
```

---

## 6. 테스트 개선

### Before (Supabase 모킹)
```typescript
jest.mock('@/lib/supabase/server');
const mockClient = { from: jest.fn(), auth: { getUser: jest.fn() } };
// 복잡한 체이닝 모킹 필요
```

### After (Repository 모킹)
```typescript
const mockRepo: ProfileRepository = {
  findBySlug: jest.fn().mockResolvedValue(mockProfile),
  findApproved: jest.fn().mockResolvedValue([]),
  // 간단한 인터페이스 모킹
};

// 테스트에서 DI로 주입
const result = await getPublicProfile('test', mockRepo);
```

---

## 7. 대안 평가

| 솔루션 | 장점 | 단점 |
|--------|------|------|
| Supabase (현재) | 빠른 개발, Auth 통합 | 쿼리 빌더 종속성 |
| Prisma | 타입 안전성, 마이그레이션 | 러닝 커브, 런타임 오버헤드 |
| Drizzle | 경량, SQL 친화적 | 생태계 작음 |
| Raw PostgreSQL | 완전한 제어권 | 보일러플레이트 많음 |

### 권장사항
1. **단기**: Supabase 유지 + 추상화 레이어 적용
2. **중기**: Repository 패턴으로 테스트 용이성 확보
3. **장기**: 필요시 Prisma/Drizzle 마이그레이션 검토

---

## 8. 파일 위치

```
web/src/lib/db/
├── types.ts        # DatabaseProvider, Repository 인터페이스
├── auth-helper.ts  # checkAuth, requireAuth 등
└── index.ts        # 모듈 진입점

docs/
└── DATABASE_ABSTRACTION.md  # 이 문서
```

---

## 9. 결론

| 항목 | 현재 | 목표 |
|------|------|------|
| Supabase 직접 호출 | 219회 | Repository 통해 호출 |
| 인증 패턴 중복 | 44회 | `checkAuth()` 1개 함수 |
| 테스트 용이성 | 낮음 | 높음 (mock repository) |
| 마이그레이션 비용 | 높음 | 중간 (추상화 덕분) |

추상화 레이어는 점진적으로 적용하며, 신규 코드부터 새 패턴을 사용합니다.
