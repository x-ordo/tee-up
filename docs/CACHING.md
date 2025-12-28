# Caching Strategy

> **목표**: 퍼블릭 페이지 응답 시간 개선, DB 부하 감소

---

## 1. 캐싱 레이어 개요

Next.js 14 `unstable_cache`를 사용한 데이터 캐싱:

```
┌─────────────────────────────────────────────────────────┐
│                    Request Flow                         │
│                                                         │
│   Client → Server Action → unstable_cache → Supabase   │
│                               ↓                         │
│                         Cache Hit?                      │
│                           ↙   ↘                        │
│                        Yes     No                       │
│                         ↓       ↓                       │
│                      Return   Fetch → Cache → Return    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. TTL 설정

| 데이터 유형 | TTL | 캐시 키 |
|------------|-----|---------|
| 퍼블릭 프로필 | 5분 | `profile-{slug}` |
| 퍼블릭 스튜디오 | 10분 | `studio-{slug}` |
| 승인된 프로필 목록 | 30분 | `approved-profiles` |
| 퍼블릭 사이트 | 10분 | `site-{handle}` |
| 사용자 프로필 | 5분 | `user-profile-{userId}` |
| 포트폴리오 섹션 | 5분 | `portfolio-sections-{profileId}` |

---

## 3. 캐시 무효화 (Cache Invalidation)

### 태그 기반 무효화
```typescript
import { revalidateTag } from 'next/cache';
import { profileTag, APPROVED_PROFILES_TAG } from '@/lib/cache';

// 프로필 업데이트 시
revalidateTag(profileTag(slug));         // profile-{slug}
revalidateTag(APPROVED_PROFILES_TAG);    // approved-profiles

// 스튜디오 업데이트 시
revalidateTag(studioTag(slug));          // studio-{slug}
```

### 무효화 트리거

| 액션 | 무효화 태그 |
|------|------------|
| `updateProProfile` | `profile-{slug}`, `approved-profiles` |
| `createProProfile` | `approved-profiles` |
| `updateStudio` | `studio-{slug}` |
| `updatePortfolioTheme` | `profile-{slug}` |

---

## 4. 사용 예시

### 캐시된 퍼블릭 프로필 조회
```typescript
import { createCachedPublicProfile, profileTag } from '@/lib/cache';

export async function getPublicProfile(slug: string) {
  const fetchProfile = createCachedPublicProfile(slug, async () => {
    const supabase = await createClient();
    return await supabase
      .from('pro_profiles')
      .select('*')
      .eq('slug', slug)
      .single();
  });

  return fetchProfile();
}
```

### 새 캐시 함수 추가
```typescript
// lib/cache/index.ts에 추가
export function createCachedMyData<T>(
  key: string,
  fetcher: () => Promise<T>
): () => Promise<T> {
  return unstable_cache(fetcher, [`my-data-${key}`], {
    revalidate: 60 * 5,  // 5분 TTL
    tags: [`my-data-${key}`],
  });
}
```

---

## 5. 캐싱 대상 / 비대상

### ✅ 캐싱 대상 (Public, Read-Only)
- `getPublicProfile(slug)` - 포트폴리오 페이지
- `getPublicStudio(slug)` - 스튜디오 페이지
- `getApprovedProfiles()` - 프로 디렉토리
- `getPublicSiteByHandle(handle)` - 사이트 페이지

### ❌ 캐싱 비대상 (Real-Time)
- `getLeadStats()` - 과금 데이터
- `getMyBookings()` - 예약 상태
- `getStudioDashboardStats()` - 실시간 통계
- `checkLeadLimit()` - 과금 체크

---

## 6. 성능 영향

### 예상 개선
| 메트릭 | Before | After |
|--------|--------|-------|
| 프로필 페이지 DB 쿼리 | 2/요청 | 0 (캐시 히트) |
| 디렉토리 페이지 응답 | ~200ms | ~50ms |
| DB 부하 (프로필 페이지) | 100% | ~10% |

### 캐시 히트율 목표
- 퍼블릭 프로필: > 95%
- 디렉토리: > 99%

---

## 7. 파일 구조

```
web/src/lib/cache/
├── constants.ts   # TTL 상수
├── tags.ts        # 태그 생성 함수
└── index.ts       # 캐시 유틸리티 (re-export)
```

---

## 8. 디버깅

### 캐시 상태 확인
```typescript
// 캐시 우회 (개발용)
const result = await fetchProfileDirectly(); // unstable_cache 없이 직접 호출

// 강제 무효화
revalidateTag(profileTag('test-slug'));
```

### 로그 추가 (개발 환경)
```typescript
const fetchProfile = createCachedPublicProfile(slug, async () => {
  console.log(`[CACHE MISS] profile: ${slug}`);
  // ... fetch logic
});
```

---

## 9. 향후 개선사항

1. **Redis 캐시 레이어** - 서버리스 환경에서 공유 캐시
2. **Edge 캐싱** - Vercel Edge Config 활용
3. **Incremental Static Regeneration** - 정적 페이지 생성
4. **캐시 워밍** - 인기 프로필 사전 캐싱
