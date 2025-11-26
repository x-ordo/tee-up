# [Setup] Supabase 프로젝트 초기 설정

**Labels:** `setup`, `critical`, `documentation`

---

## 우선순위: Critical

## 설명
Supabase 프로젝트 생성 및 데이터베이스 스키마 적용이 필요합니다.

## 필요한 작업

### 1. Supabase 프로젝트 생성
- [ ] https://supabase.com 에서 계정 생성
- [ ] 새 프로젝트 생성 (지역: Northeast Asia 권장)
- [ ] 프로젝트 URL 복사: `https://your-project.supabase.co`
- [ ] API Keys 복사:
  - `anon` key (공개)
  - `service_role` key (비밀)

### 2. 데이터베이스 스키마 적용
- [ ] Supabase Dashboard → SQL Editor 접속
- [ ] `/supabase/schema.sql` 파일 내용 실행

```sql
-- 주요 테이블:
-- - profiles (사용자 프로필)
-- - pro_profiles (프로 프로필)
-- - chat_rooms (채팅방)
-- - messages (메시지)
-- - subscriptions (구독)
```

### 3. RLS (Row Level Security) 확인
- [ ] 각 테이블에 RLS 정책이 적용되었는지 확인
- [ ] Authentication → Settings에서 Site URL 설정

### 4. 환경변수 설정

**프론트엔드 (`web/.env.local`)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**백엔드 (`api/.env`)**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 설정하지 않으면 발생하는 오류
```
Error: Supabase URL not configured
Error: relation "public.profiles" does not exist
Error: new row violates row-level security policy
```

## 참고 문서
- `/supabase/README.md`
- `/supabase/schema.sql`
