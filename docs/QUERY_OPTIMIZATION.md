# Query Optimization Guidelines

> **목표**: N+1 쿼리 방지, 적절한 인덱싱, RPC 함수 활용

---

## 1. N+1 쿼리 방지 패턴

### ❌ Bad: 두 번의 쿼리 (Two-Query Pattern)
```typescript
// 1차: 프로필 조회
const { data: profile } = await supabase
  .from('pro_profiles')
  .select('id')
  .eq('user_id', user.id)
  .single();

// 2차: 리드 조회 (profile.id 의존)
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('pro_id', profile.id);
```

### ✅ Good: RPC 함수 사용 (Single Query)
```typescript
// 단일 RPC 호출로 프로필 조회 + 리드 조회 통합
const { data: leads } = await supabase.rpc('get_user_leads', {
  p_user_id: user.id,
  p_limit: 50,
  p_offset: 0,
});
```

---

## 2. Batch Update 패턴

### ❌ Bad: N회의 개별 UPDATE
```typescript
// N개 섹션 → N번 UPDATE (성능 저하)
for (let i = 0; i < sectionIds.length; i++) {
  await supabase
    .from('portfolio_sections')
    .update({ display_order: i })
    .eq('id', sectionIds[i]);
}
```

### ✅ Good: 단일 RPC Batch Update
```typescript
const sectionOrders = sectionIds.map((id, index) => ({ id, order: index }));

await supabase.rpc('batch_update_portfolio_order', {
  p_profile_id: profileId,
  p_user_id: user.id,
  p_section_orders: sectionOrders,
});
```

---

## 3. 인덱스 전략

### 복합 인덱스 (Composite Index)
```sql
-- 필터 조건이 여러 컬럼일 때
CREATE INDEX idx_booking_requests_pro_status
ON booking_requests(pro_id, status);

-- 시간 기반 정렬이 필요할 때
CREATE INDEX idx_leads_pro_created
ON leads(pro_id, created_at DESC);
```

### 부분 인덱스 (Partial Index)
```sql
-- 특정 조건만 인덱싱 (공간 효율)
CREATE INDEX idx_lesson_logs_student_shared
ON lesson_logs(student_id, is_shared_with_student)
WHERE is_shared_with_student = true;
```

### 인덱스 대상 컬럼 선정 기준
| 우선순위 | 조건 |
|---------|------|
| 1 | WHERE 절에서 자주 사용되는 컬럼 |
| 2 | JOIN 조건에 사용되는 FK 컬럼 |
| 3 | ORDER BY 에서 사용되는 컬럼 |
| 4 | 카디널리티(고유값)가 높은 컬럼 |

---

## 4. RPC 함수 설계 원칙

### 함수 네이밍 컨벤션
| 접두사 | 용도 | 예시 |
|--------|------|------|
| `get_` | 조회 | `get_user_leads` |
| `batch_update_` | 일괄 수정 | `batch_update_portfolio_order` |
| `increment_` | 카운터 증가 | `increment_profile_views` |

### 보안 설정
```sql
-- SECURITY DEFINER: 함수 소유자 권한으로 실행
-- STABLE: 같은 트랜잭션 내 동일 결과 보장 (캐싱 가능)
CREATE OR REPLACE FUNCTION get_user_leads(p_user_id UUID)
RETURNS TABLE (...)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$ ... $$;

-- 권한 부여
GRANT EXECUTE ON FUNCTION get_user_leads TO authenticated;
```

---

## 5. 사용 가능한 RPC 함수 목록

| 함수명 | 용도 | 파라미터 |
|--------|------|----------|
| `get_user_leads` | 사용자 리드 조회 | `p_user_id`, `p_limit`, `p_offset` |
| `get_booking_settings_by_pro` | 예약 설정 조회 | `p_pro_id` |
| `get_user_lesson_logs` | 레슨 로그 조회 | `p_user_id`, `p_limit`, `p_offset`, `p_student_id` |
| `batch_update_portfolio_order` | 포트폴리오 순서 일괄 수정 | `p_profile_id`, `p_user_id`, `p_section_orders` |
| `get_user_studio_affiliations` | 스튜디오 소속 조회 | `p_user_id` |
| `increment_profile_views` | 프로필 조회수 증가 | `profile_slug` |

---

## 6. 마이그레이션 파일 위치

- **인덱스 & RPC 함수**: `supabase/migrations/019_query_optimization.sql`
- **프로필 조회수 증가**: `supabase/migrations/008_add_profile_views.sql`

---

## 7. 체크리스트

새 Server Action 작성 시:

- [ ] 두 번 이상의 쿼리가 필요한가? → RPC 함수 고려
- [ ] 루프 내 UPDATE가 있는가? → Batch RPC 고려
- [ ] WHERE 조건에 FK가 포함되는가? → 인덱스 확인
- [ ] ORDER BY + LIMIT 패턴인가? → 정렬 인덱스 확인

---

## 8. 성능 모니터링

Supabase Dashboard에서 확인:
- **Query Performance**: 느린 쿼리 식별
- **Index Usage**: 인덱스 활용도 확인
- **Connection Pool**: 연결 수 모니터링

목표 지표:
- Server Action 응답: < 200ms
- 쿼리 실행: < 50ms
- 인덱스 히트율: > 95%
