# [Setup] 관리자 계정 생성

**Labels:** `setup`, `critical`

---

## 우선순위: Critical

## 설명
관리자 대시보드 접근을 위한 관리자 계정을 생성해야 합니다.

## 필요한 작업

### 방법 A: Supabase Dashboard에서 생성 (간단)
- [ ] Supabase Dashboard → Authentication → Users
- [ ] "Add user" 클릭
- [ ] Email: `admin@teeup.com` (변경 가능)
- [ ] Password: 강력한 비밀번호 설정
- [ ] "Auto Confirm User" 체크

### 방법 B: SQL로 생성 (권장)
```sql
-- 1. 사용자 생성
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@teeup.com',
  crypt('YourStrongPassword123!', gen_salt('bf')),
  NOW(), NOW(), NOW()
);

-- 2. 프로필에 관리자 역할 부여
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@teeup.com';
```

## 설정하지 않으면 발생하는 오류
- `/admin` 페이지 접근 시 로그인 불가
- "Invalid credentials" 에러

## 참고 문서
- `/supabase/ADMIN_SETUP.md`
